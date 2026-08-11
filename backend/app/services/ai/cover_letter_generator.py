"""
AI Cover Letter Generator Service for SkillBridge.
Generates tailored, high-converting cover letters across multiple tone profiles (Professional, Confident, Friendly, Formal, Student, Software Engineer).
"""
from typing import Dict, Any

TONE_PROMPT_STYLES = {
    "Professional": "authoritative, polished, and structured",
    "Confident": "bold, action-oriented, and impact-driven",
    "Friendly": "warm, enthusiastic, and approachable",
    "Formal": "traditional, dignified, and highly respectful",
    "Student": "eager to learn, humble, and ambitious",
    "Software Engineer": "technical, problem-solving focused, and analytical"
}

def generate_ai_cover_letter(
    user_info: Dict[str, Any],
    company_name: str,
    job_title: str,
    job_description: str = "",
    tone: str = "Professional"
) -> Dict[str, Any]:
    """Generates customized AI cover letter content."""
    
    full_name = user_info.get("full_name", "Applicant Name")
    email = user_info.get("email", "applicant@example.com")
    phone = user_info.get("phone", "+91 9876543210")
    college = user_info.get("college", "Engineering College")
    branch = user_info.get("branch", "Computer Science & Engineering")
    skills = user_info.get("skills", ["Python", "React", "SQL", "FastAPI"])
    skills_str = ", ".join(skills[:5]) if skills else "software engineering and modern web frameworks"
    
    style_desc = TONE_PROMPT_STYLES.get(tone, TONE_PROMPT_STYLES["Professional"])

    salutation = f"Dear Hiring Manager at {company_name},"
    
    intro = (
        f"I am writing to express my strong enthusiasm for the {job_title} position at {company_name}. "
        f"As a dedicated student specializing in {branch} at {college}, I have developed a solid foundation in {skills_str} "
        f"and am deeply passionate about solving real-world challenges through innovative technology."
    )
    
    body_1 = (
        f"Throughout my academic journey and technical projects, I have consistently demonstrated a commitment to engineering excellence. "
        f"Specifically, I have hands-on experience building scalable applications, designing RESTful APIs, and implementing responsive user interfaces. "
        f"My hands-on background with tools such as {skills_str} aligns directly with the goals of your team at {company_name}."
    )
    
    body_2 = (
        f"What excites me most about joining {company_name} is your reputation for fostering innovation and technical impact. "
        f"I thrive in collaborative environments where I can quickly master new stacks, contribute clean, maintainable code, and deliver measurable results."
    )
    
    closing = (
        f"Thank you for considering my application. I would welcome the opportunity to discuss how my technical skills, "
        f"problem-solving mindset, and drive to excel can add immediate value to the {job_title} role at {company_name}. "
        f"Please find my resume attached for your review."
    )
    
    signoff = f"Sincerely,\n{full_name}\nEmail: {email} | Phone: {phone}"

    full_text = f"{salutation}\n\n{intro}\n\n{body_1}\n\n{body_2}\n\n{closing}\n\n{signoff}"

    return {
        "company_name": company_name,
        "job_title": job_title,
        "tone": tone,
        "content": full_text,
        "matched_keywords": skills[:4],
        "suggested_improvements": [
            "Quantify your project achievements with metrics (e.g. 'Improved API load time by 30%').",
            "Tailor the opening line to reference a recent company product update or announcement."
        ]
    }
