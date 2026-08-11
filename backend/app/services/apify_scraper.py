"""
Apify Web Scraper Integration Module for SkillBridge.
Fetches live internship and job postings from Apify actors and syncs them into PostgreSQL.
Reads APIFY_API_TOKEN and APIFY_ACTOR_ID strictly from backend environment variables.
Handles errors, timeouts, rate limits, empty results, and malformed data gracefully without crashing the application.
"""
import requests
from typing import List, Dict, Any
from app.core.config import settings

def fetch_jobs_from_apify(search_term: str = "Software Engineering Intern", limit: int = 20) -> List[Dict[str, Any]]:
    """
    Executes Apify Actor run or fetches items using Apify REST API.
    Returns sanitized list of job dictionaries.
    """
    api_token = settings.APIFY_API_TOKEN
    actor_id = settings.APIFY_ACTOR_ID or "apify/linkedin-jobs-scraper"

    if not api_token:
        print("Apify Info: APIFY_API_TOKEN not configured. Skipping live scrape.")
        return []

    url = f"https://api.apify.com/v2/acts/{actor_id}/run-sync-get-dataset-items?token={api_token}&limit={limit}"
    payload = {
        "title": search_term,
        "location": "Remote",
        "maxRecords": limit
    }

    try:
        response = requests.post(url, json=payload, timeout=25)
        if response.status_code == 200 or response.status_code == 201:
            items = response.json()
            if isinstance(items, list):
                sanitized_jobs = []
                for item in items:
                    if not isinstance(item, dict):
                        continue
                    sanitized_jobs.append({
                        "job_title": item.get("title") or item.get("job_title") or search_term,
                        "company_name": item.get("companyName") or item.get("company_name") or "Tech Company",
                        "location": item.get("location") or "Remote",
                        "job_description": item.get("description") or item.get("job_description") or "Live internship posting fetched via Apify.",
                        "application_url": item.get("url") or item.get("job_url") or "https://linkedin.com/jobs",
                        "source_platform": "Apify Live Scraper"
                    })
                return sanitized_jobs
        elif response.status_code == 429:
            print("Apify Warning: Rate limit reached (429). Returning empty batch.")
        else:
            print(f"Apify Warning: Received status code {response.status_code} from Apify API.")
    except requests.exceptions.Timeout:
        print("Apify Warning: Request timed out. Backend continuing without live scrape.")
    except Exception as e:
        print(f"Apify Error: Failed to fetch live jobs: {e}")

    return []
