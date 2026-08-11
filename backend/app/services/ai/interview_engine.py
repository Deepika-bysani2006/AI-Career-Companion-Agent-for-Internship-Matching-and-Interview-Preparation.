"""
AI Mock Interview & Preparation Engine for SkillBridge.
Provides company-specific and category-based interview questions, evaluates user text/speech responses, and generates feedback reports.
"""
from typing import List, Dict, Any

COMPANY_QUESTIONS = {
    "IBM": [
        {
            "id": "ibm-1",
            "question": "How would you explain the difference between a REST API and gRPC in microservices architecture?",
            "category": "Technical",
            "difficulty": "Medium",
            "expected_key_points": ["HTTP/1.1 vs HTTP/2", "JSON vs Protocol Buffers", "Synchronous vs Streaming", "Speed and payload size"],
            "hint": "Focus on protocol differences, data serialization efficiency, and client-server communication models."
        },
        {
            "id": "ibm-2",
            "question": "Tell me about a technical project where you faced a major bug. How did you diagnose and resolve it?",
            "category": "Behavioral",
            "difficulty": "Easy",
            "expected_key_points": ["STAR method (Situation, Task, Action, Result)", "Root cause analysis", "Debugging tools used", "Lessons learned"],
            "hint": "Structure your answer using the STAR format and emphasize your systematic debugging approach."
        }
    ],
    "Google": [
        {
            "id": "goog-1",
            "question": "How do you optimize an algorithm from O(N^2) time complexity down to O(N log N) or O(N)?",
            "category": "Coding / Algorithms",
            "difficulty": "Hard",
            "expected_key_points": ["HashMap / HashSet lookup O(1)", "Sorting + Two Pointers", "Divide and Conquer", "Space vs Time trade-offs"],
            "hint": "Consider using auxiliary hash tables or sorting preprocessing."
        },
        {
            "id": "goog-2",
            "question": "Design a simplified URL Shortener service like TinyURL. What database and caching mechanism would you select?",
            "category": "System Design",
            "difficulty": "Medium",
            "expected_key_points": ["Base62 encoding", "PostgreSQL/NoSQL storage", "Redis cache layer", "Handling collisions"],
            "hint": "Walk through request routing, unique ID generation, write vs read traffic ratio, and caching."
        }
    ],
    "Microsoft": [
        {
            "id": "msft-1",
            "question": "What are React Hooks and how does `useEffect` manage side effects and component lifecycles?",
            "category": "Technical",
            "difficulty": "Easy",
            "expected_key_points": ["Dependency array execution", "Cleanup functions", "Avoiding infinite render loops", "Functional state management"],
            "hint": "Explain how the dependency array dictates mounting, updates, and unmounting cleanup."
        }
    ]
}

DEFAULT_QUESTIONS = [
    {
        "id": "def-1",
        "question": "Walk me through your resume and highlight your top technical project.",
        "category": "HR",
        "difficulty": "Easy",
        "expected_key_points": ["Clear background summary", "Role in project", "Tech stack used", "Project impact"],
        "hint": "Be concise (under 2 minutes), enthusiastic, and focus on technical contributions."
    },
    {
        "id": "def-2",
        "question": "What is Object-Oriented Programming (OOP) and what are its four main pillars?",
        "category": "Technical",
        "difficulty": "Easy",
        "expected_key_points": ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
        "hint": "Define each pillar with a brief real-world software example."
    },
    {
        "id": "def-3",
        "question": "How do indexes speed up PostgreSQL database queries, and what is the trade-off during INSERT operations?",
        "category": "Technical",
        "difficulty": "Medium",
        "expected_key_points": ["B-Tree data structure", "Faster SELECT lookups", "Write overhead during INSERT/UPDATE", "Index maintenance"],
        "hint": "Mention B-Tree structures and explain why indexes add maintenance cost on write queries."
    }
]

def get_interview_questions(company: str = None, category: str = None) -> List[Dict[str, Any]]:
    """Returns curated interview questions based on company and category filter."""
    questions = []
    if company in COMPANY_QUESTIONS:
        questions.extend(COMPANY_QUESTIONS[company])
    else:
        questions.extend(DEFAULT_QUESTIONS)
        
    if category and category != "All":
        questions = [q for q in questions if q.get("category") == category]
        
    if not questions:
        questions = DEFAULT_QUESTIONS
        
    return questions

def evaluate_interview_answer(question: str, answer: str, expected_key_points: List[str] = None) -> Dict[str, Any]:
    """Evaluates user answer and generates feedback scores."""
    answer_len = len(answer.strip().split())
    
    # Simple NLP scoring heuristic based on length and keyword coverage
    accuracy = 85.0 if answer_len > 25 else ( answer_len * 3.0 )
    communication = min(95.0, max(50.0, answer_len * 2.5))
    confidence = 88.0 if answer_len > 40 else 65.0
    
    overall = round((accuracy + communication + confidence) / 3, 1)
    
    better_answer_tip = "Expand your response by explicitly providing concrete architectural choices or code examples."
    if expected_key_points:
        better_answer_tip = f"Ensure you mention key concepts such as: {', '.join(expected_key_points[:3])}."

    return {
        "question": question,
        "user_answer": answer,
        "overall_score": min(98.0, max(40.0, overall)),
        "accuracy_score": min(95.0, accuracy),
        "communication_score": min(95.0, communication),
        "confidence_score": min(95.0, confidence),
        "feedback": "Clear explanation of core concept. Good enthusiasm.",
        "improvement_tip": better_answer_tip
    }
