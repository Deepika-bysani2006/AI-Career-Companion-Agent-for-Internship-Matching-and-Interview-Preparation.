"""
Apify Multi-Provider Job Scraper Architecture for SkillBridge.
Supports 4 independent providers:
- LinkedIn (LinkedInProvider)
- Naukri (NaukriProvider)
- Unstop (UnstopProvider)
- Internshala (InternshalaProvider)

Each provider reads its own environment-configurable Actor ID:
- APIFY_LINKEDIN_ACTOR_ID
- APIFY_NAUKRI_ACTOR_ID
- APIFY_UNSTOP_ACTOR_ID
- APIFY_INTERNSHALA_ACTOR_ID

All providers use APIFY_API_TOKEN for authentication.
Gracefully handles missing actor IDs, timeouts, rate limits, and network errors without crashing.
"""
import requests
import random
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.models import Job, Company

class ApifyJobProvider:
    """Base class for Apify Job Scrapers."""
    source_name: str = "Generic"
    actor_id_env_key: str = ""

    def __init__(self, actor_id: str, api_token: str):
        self.actor_id = actor_id
        self.api_token = api_token

    def is_configured(self) -> bool:
        return bool(self.actor_id and self.api_token)

    def scrape(self, keywords: List[str], location: str) -> Dict[str, Any]:
        """Performs scraping for requested keywords and location."""
        if not self.api_token:
            return {
                "source": self.source_name,
                "status": "error",
                "message": "APIFY_API_TOKEN is not configured on backend.",
                "jobs": []
            }
        if not self.actor_id:
            return {
                "source": self.source_name,
                "status": "skipped",
                "message": f"Actor ID for {self.source_name} ({self.actor_id_env_key}) is not configured.",
                "jobs": []
            }

        search_query = " ".join(keywords) if keywords else "Internship"
        url = f"https://api.apify.com/v2/acts/{self.actor_id}/run-sync-get-dataset-items?token={self.api_token}&limit=25"
        payload = {
            "title": search_query,
            "search": search_query,
            "location": location or "India",
            "maxRecords": 25
        }

        try:
            response = requests.post(url, json=payload, timeout=25)
            if response.status_code in (200, 201):
                items = response.json()
                if isinstance(items, list):
                    normalized = []
                    for item in items:
                        if not isinstance(item, dict):
                            continue
                        normalized.append(self.normalize_item(item, search_query, location))
                    return {
                        "source": self.source_name,
                        "status": "success",
                        "count": len(normalized),
                        "jobs": normalized
                    }
            elif response.status_code == 429:
                return {"source": self.source_name, "status": "rate_limited", "message": "Rate limit exceeded (429).", "jobs": []}
            else:
                return {"source": self.source_name, "status": "error", "message": f"Apify returned HTTP {response.status_code}", "jobs": []}
        except requests.exceptions.Timeout:
            return {"source": self.source_name, "status": "timeout", "message": "Scraper timed out.", "jobs": []}
        except Exception as e:
            return {"source": self.source_name, "status": "error", "message": str(e), "jobs": []}

    def normalize_item(self, item: Dict[str, Any], default_title: str, default_location: str) -> Dict[str, Any]:
        """Normalizes raw Apify item into standard Job dictionary structure."""
        title = item.get("title") or item.get("job_title") or item.get("role") or default_title
        company = item.get("companyName") or item.get("company") or item.get("organization") or f"{self.source_name} Partner"
        loc = item.get("location") or item.get("place") or default_location
        desc = item.get("description") or item.get("jobDescription") or f"Live {title} position on {self.source_name}."
        url = item.get("url") or item.get("jobUrl") or item.get("applyUrl") or f"https://www.google.com/search?q={title}+{company}"
        salary = item.get("salary") or item.get("stipend") or "Disclosed upon application"
        job_type = item.get("jobType") or item.get("employmentType") or "Full Time"

        skills = item.get("skills") or item.get("tags") or ["Python", "React", "SQL"]
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(",") if s.strip()]

        return {
            "job_title": title,
            "company_name": company,
            "location": loc,
            "job_type": job_type,
            "salary_stipend": salary,
            "job_description": desc,
            "required_skills": skills,
            "application_url": url,
            "source_platform": self.source_name
        }


class LinkedInProvider(ApifyJobProvider):
    source_name = "LinkedIn"
    actor_id_env_key = "APIFY_LINKEDIN_ACTOR_ID"


class NaukriProvider(ApifyJobProvider):
    source_name = "Naukri"
    actor_id_env_key = "APIFY_NAUKRI_ACTOR_ID"


class UnstopProvider(ApifyJobProvider):
    source_name = "Unstop"
    actor_id_env_key = "APIFY_UNSTOP_ACTOR_ID"


class InternshalaProvider(ApifyJobProvider):
    source_name = "Internshala"
    actor_id_env_key = "APIFY_INTERNSHALA_ACTOR_ID"


PROVIDERS = {
    "linkedin": lambda: LinkedInProvider(settings.APIFY_LINKEDIN_ACTOR_ID, settings.APIFY_API_TOKEN),
    "naukri": lambda: NaukriProvider(settings.APIFY_NAUKRI_ACTOR_ID, settings.APIFY_API_TOKEN),
    "unstop": lambda: UnstopProvider(settings.APIFY_UNSTOP_ACTOR_ID, settings.APIFY_API_TOKEN),
    "internshala": lambda: InternshalaProvider(settings.APIFY_INTERNSHALA_ACTOR_ID, settings.APIFY_API_TOKEN),
}

def execute_multi_source_scrape(db: Session, sources: List[str], keywords: List[str], location: str) -> Dict[str, Any]:
    """
    Orchestrates job scraping across requested providers (LinkedIn, Naukri, Unstop, Internshala).
    Deduplicates and saves normalized jobs into PostgreSQL.
    """
    valid_sources = ["linkedin", "naukri", "unstop", "internshala"]
    target_sources = [s.lower().strip() for s in sources if s.lower().strip() in valid_sources]
    if not target_sources:
        target_sources = valid_sources

    provider_results = []
    total_added = 0
    total_duplicates_skipped = 0

    for src in target_sources:
        provider_factory = PROVIDERS.get(src)
        if not provider_factory:
            continue

        provider = provider_factory()
        res = provider.scrape(keywords, location)

        scraped_jobs = res.get("jobs", [])
        added_for_provider = 0

        for raw_job in scraped_jobs:
            title = raw_job["job_title"]
            comp_name = raw_job["company_name"]

            # Deduplication Check
            existing = db.query(Job).join(Company).filter(
                Job.job_title == title,
                Company.company_name == comp_name
            ).first()

            if existing:
                total_duplicates_skipped += 1
                continue

            # Find or Create Company
            comp = db.query(Company).filter(Company.company_name == comp_name).first()
            if not comp:
                comp = Company(
                    company_name=comp_name,
                    industry="Technology",
                    company_website=raw_job["application_url"],
                    company_description=f"{comp_name} hiring via {provider.source_name}."
                )
                db.add(comp)
                db.commit()
                db.refresh(comp)

            # Insert Job
            new_job = Job(
                company_id=comp.company_id,
                job_title=title,
                job_type=raw_job["job_type"],
                location=raw_job["location"],
                salary_stipend=raw_job["salary_stipend"],
                experience_required="Freshers / 0-2 Years",
                job_description=raw_job["job_description"],
                required_skills=raw_job["required_skills"],
                preferred_skills=["Git", "Problem Solving"],
                application_url=raw_job["application_url"],
                source_platform=provider.source_name,
                posted_date=datetime.utcnow()
            )
            db.add(new_job)
            db.commit()
            added_for_provider += 1
            total_added += 1

        res["jobs_inserted"] = added_for_provider
        res.pop("jobs", None) # Omit heavy list from stats overview
        provider_results.append(res)

    return {
        "status": "completed",
        "requested_sources": sources,
        "processed_sources": target_sources,
        "total_jobs_inserted": total_added,
        "total_duplicates_skipped": total_duplicates_skipped,
        "providers_status": provider_results
    }
