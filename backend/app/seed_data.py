"""
JobSeeder Service for SkillBridge.
Automatically generates and inserts at least 1000 realistic internship & job records into PostgreSQL.
"""
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import User, Company, Job
from app.core.security import get_password_hash

COMPANIES_LIST = [
    {"name": "IBM", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", "industry": "Enterprise Cloud & AI"},
    {"name": "Google", "logo": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", "industry": "Internet & Search"},
    {"name": "Microsoft", "logo": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg", "industry": "Cloud & Software"},
    {"name": "Amazon", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", "industry": "AWS & E-Commerce"},
    {"name": "Infosys", "logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", "industry": "IT Services"},
    {"name": "TCS", "logo": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", "industry": "IT Services"},
    {"name": "Wipro", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg", "industry": "IT Services"},
    {"name": "Accenture", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", "industry": "Consulting"},
    {"name": "Capgemini", "logo": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg", "industry": "IT Consulting"},
    {"name": "Cognizant", "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Cognizant_logo_2022.svg", "industry": "IT Services"},
    {"name": "Deloitte", "logo": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Deloitte.svg", "industry": "Financial Advisory & Tech"},
    {"name": "Oracle", "logo": "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg", "industry": "Database & Cloud"},
    {"name": "Intel", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg", "industry": "Semiconductors"},
    {"name": "Adobe", "logo": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg", "industry": "Creative Software"},
    {"name": "Zoho", "logo": "https://upload.wikimedia.org/wikipedia/commons/6/69/Zoho_Corporation_logo.png", "industry": "SaaS"},
    {"name": "Paytm", "logo": "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.jpg", "industry": "FinTech"},
    {"name": "PhonePe", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg", "industry": "FinTech"},
    {"name": "Flipkart", "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg", "industry": "E-Commerce"},
    {"name": "Swiggy", "logo": "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.svg", "industry": "Food Delivery"},
    {"name": "Zomato", "logo": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg", "industry": "Food Tech"},
    {"name": "Freshworks", "logo": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Freshworks_Logo.png", "industry": "SaaS"},
    {"name": "Meesho", "logo": "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo.png", "industry": "E-Commerce"},
    {"name": "Razorpay", "logo": "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg", "industry": "FinTech Payments"},
    {"name": "NVIDIA", "logo": "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg", "industry": "AI & GPU"},
    {"name": "Cisco", "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", "industry": "Networking"}
]

JOB_TITLES = [
    "Python Developer", "Java Developer", "Full Stack Developer", "Frontend Developer",
    "Backend Developer", "React Developer", "Node.js Developer", "AI Engineer",
    "Machine Learning Intern", "Data Science Intern", "Data Analyst", "UI/UX Designer",
    "DevOps Engineer", "Cybersecurity Intern", "Cloud Engineer", "Android Developer",
    "QA Tester", "Software Engineer", "Business Analyst", "Product Management Intern"
]

LOCATIONS = [
    "Bengaluru, India", "Hyderabad, India", "Pune, India", "Gurugram, India",
    "Noida, India", "Chennai, India", "Mumbai, India", "Kolkata, India",
    "Ahmedabad, India", "Remote"
]

PLATFORMS = ["LinkedIn", "Naukri", "Internshala", "Unstop"]

WORK_MODES = ["Remote", "Hybrid", "Onsite"]
INTERNSHIP_TYPES = ["Internship", "Full Time"]

STIPENDS = [
    "₹20,000 / month", "₹30,000 / month", "₹45,000 / month",
    "₹60,000 / month", "₹85,000 / month", "₹1,20,000 / month", "8-12 LPA"
]

DURATIONS = ["3 Months", "6 Months", "1 Year", "Permanent"]

SKILLS_MAP = {
    "Python Developer": ["Python", "FastAPI", "Django", "PostgreSQL", "Git"],
    "Java Developer": ["Java", "Spring Boot", "MySQL", "Hibernate", "Microservices"],
    "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    "Frontend Developer": ["React", "JavaScript", "HTML5", "CSS3", "Redux"],
    "Backend Developer": ["Python", "Node.js", "PostgreSQL", "Redis", "Docker"],
    "React Developer": ["React", "Next.js", "JavaScript", "Tailwind CSS", "Redux Toolkit"],
    "Node.js Developer": ["Node.js", "Express", "TypeScript", "MongoDB", "REST API"],
    "AI Engineer": ["Python", "PyTorch", "LangChain", "OpenAI", "FAISS"],
    "Machine Learning Intern": ["Python", "Scikit-Learn", "TensorFlow", "Pandas", "NumPy"],
    "Data Science Intern": ["Python", "SQL", "Pandas", "Matplotlib", "Statistics"],
    "Data Analyst": ["SQL", "Excel", "Tableau", "Power BI", "Python"],
    "UI/UX Designer": ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
    "Cybersecurity Intern": ["Ethical Hacking", "Network Security", "Linux", "Wireshark", "Python"],
    "Cloud Engineer": ["AWS", "Azure", "Linux", "CloudFormation", "Docker"],
    "Android Developer": ["Kotlin", "Android SDK", "Java", "Firebase", "REST API"],
    "QA Tester": ["Selenium", "Python", "JUnit", "Manual Testing", "Postman"],
    "Software Engineer": ["C++", "Data Structures", "Algorithms", "System Design", "Git"],
    "Business Analyst": ["SQL", "Agile", "Jira", "Excel", "Data Visualization"],
    "Product Management Intern": ["Product Strategy", "User Research", "Agile", "Mixpanel", "Jira"]
}

def seed_database(db: Session):
    """Executes JobSeeder: ensures 1000+ realistic job listings exist in PostgreSQL."""
    # 1. Admin User Setup
    admin = db.query(User).filter(User.email == "admin@skillbridge.com").first()
    if not admin:
        admin = User(
            full_name="SkillBridge System Admin",
            email="admin@skillbridge.com",
            password_hash=get_password_hash("SkillBridge@2026"),
            role="admin",
            college="Admin HQ",
            is_verified=True
        )
        db.add(admin)
        db.commit()

    # 2. Check current job count
    existing_count = db.query(Job).count()
    if existing_count >= 1000:
        print(f"JobSeeder: Database already contains {existing_count} jobs. Skipping seed.")
        return

    print(f"JobSeeder: Current count = {existing_count}. Generating 1000+ mock job listings...")

    # 3. Create / Retrieve Companies
    created_companies = []
    for comp_data in COMPANIES_LIST:
        comp = db.query(Company).filter(Company.company_name == comp_data["name"]).first()
        if not comp:
            comp = Company(
                company_name=comp_data["name"],
                company_logo=comp_data["logo"],
                industry=comp_data["industry"],
                company_website=f"https://www.{comp_data['name'].lower().replace(' ', '')}.com/careers",
                company_description=f"{comp_data['name']} is a global tech company hiring top talent.",
                location="Global"
            )
            db.add(comp)
            db.commit()
            db.refresh(comp)
        created_companies.append(comp)

    # 4. Generate 1000 Jobs
    target_count = 1000
    needed = target_count - existing_count

    jobs_batch = []
    for i in range(1, needed + 1):
        comp = random.choice(created_companies)
        title = random.choice(JOB_TITLES)
        location = random.choice(LOCATIONS)
        platform = random.choice(PLATFORMS)
        work_mode = "Remote" if "Remote" in location else random.choice(WORK_MODES)
        internship_type = random.choice(INTERNSHIP_TYPES)
        skills = SKILLS_MAP.get(title, ["Python", "SQL", "Git"])

        j = Job(
            company_id=comp.company_id,
            job_title=f"{title} - {comp.company_name}",
            job_type=f"{work_mode} • {internship_type}",
            location=location,
            salary_stipend=random.choice(STIPENDS),
            experience_required="Freshers / 0-2 Years",
            job_description=f"Join {comp.company_name} as a {title}. You will work on real-world projects, building scalable software, AI pipelines, and cloud solutions.",
            responsibilities=[
                f"Develop and maintain {title} components and modules.",
                "Collaborate with agile cross-functional engineering teams.",
                "Write clean, documented, and tested production code."
            ],
            required_skills=skills,
            preferred_skills=["Docker", "AWS", "Git"],
            benefits=["Pre-Placement Offer (PPO)", "Flexible Hours", "Mentorship", "Certificate"],
            last_date="30 days left",
            application_url=f"https://www.{comp.company_name.lower().replace(' ', '')}.com/careers/job-{i+existing_count}",
            source_platform=platform,
            posted_date=datetime.utcnow() - timedelta(days=random.randint(0, 45))
        )
        jobs_batch.append(j)

        if len(jobs_batch) >= 200:
            db.add_all(jobs_batch)
            db.commit()
            jobs_batch = []

    if jobs_batch:
        db.add_all(jobs_batch)
        db.commit()

    total_now = db.query(Job).count()
    print(f"JobSeeder: Successfully populated database with {total_now} mock jobs!")
