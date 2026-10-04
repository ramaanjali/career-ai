# ==========================================================
# RESUME AI ANALYZER
# ==========================================================

import json
import re

from services.ai_service import generate_with_fallback


# ==========================================================
# EXTRACT JSON FROM GEMINI RESPONSE
# ==========================================================

def extract_json(text):

    if not text:
        raise ValueError("AI returned an empty response.")

    text = text.strip()

    # Remove markdown code block
    text = re.sub(
        r"```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"```\s*$",
        "",
        text
    )

    text = text.strip()

    # Direct JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Find JSON object inside response
    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:

        json_text = text[start:end + 1]

        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            pass

    raise ValueError(
        "AI response did not contain valid JSON."
    )


# ==========================================================
# ANALYZE RESUME
# ==========================================================

def analyze_resume(resume_text):

    if not resume_text:
        raise ValueError("Resume text is empty.")

    # Limit extremely large resumes
    resume_text = resume_text[:50000]

    prompt = f"""
You are an advanced AI Resume Analyzer and Career Advisor.

Analyze the following resume carefully.

Your analysis must be based primarily on information found
in the resume.

Do NOT invent:
- education
- companies
- job experience
- projects
- certifications
- skills already present in the resume

However, for CAREER RECOMMENDATIONS, SKILL GAPS and ROADMAP,
you may make reasonable career-oriented recommendations
based on the candidate's documented skills, education,
projects and experience.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside JSON.

==================================================
REQUIRED JSON STRUCTURE
==================================================

{{
    "candidate_name": "",
    "email": "",
    "phone": "",

    "education": [
        {{
            "degree": "",
            "field": "",
            "institution": "",
            "year": ""
        }}
    ],

    "skills": [],

    "programming_languages": [],

    "frameworks": [],

    "databases": [],

    "tools": [],

    "certifications": [],

    "projects": [
        {{
            "name": "",
            "description": "",
            "technologies": []
        }}
    ],

    "experience": [
        {{
            "company": "",
            "role": "",
            "duration": "",
            "description": ""
        }}
    ],

    "internships": [
        {{
            "company": "",
            "role": "",
            "duration": ""
        }}
    ],

    "summary": "",

    "resume_score": 0,

    "skill_gaps": [
        {{
            "skill": "",
            "reason": "",
            "priority": "High"
        }}
    ],

    "career_roles": [
        {{
            "role": "",
            "match": 0,
            "reason": ""
        }}
    ],

    "roadmap": [
        {{
            "phase": "",
            "title": "",
            "duration": "",
            "skills": [],
            "projects": [],
            "actions": []
        }}
    ]
}}

==================================================
FIELD REQUIREMENTS
==================================================

### candidate_name

Extract the candidate's name from the resume.

### education

Extract all education information explicitly present
in the resume.

### skills

Extract technical and professional skills that are
actually present in the resume.

Remove duplicates.

### programming_languages

Extract programming languages explicitly present.

Examples:
Python, Java, JavaScript, C++, SQL

Only include them when supported by the resume.

### frameworks

Extract frameworks/libraries explicitly present.

### databases

Extract databases explicitly present.

### tools

Extract development/software tools explicitly present.

### certifications

Extract certifications explicitly present.

### projects

Extract projects from the resume.

For every project include:
- project name
- short description
- technologies used

### experience

Extract professional work experience.

### internships

Extract internships.

### summary

Create a concise professional summary based on
the resume.

==================================================
RESUME SCORE
==================================================

Calculate a resume_score from 0 to 100.

Consider:

- skills
- education
- projects
- experience
- certifications
- clarity
- career readiness

The score is an AI-generated resume quality estimate.

==================================================
SKILL GAPS
==================================================

Identify skills the candidate should learn next.

These should NOT simply repeat skills already present
in the resume.

Recommend skills that are relevant to the candidate's
likely career paths.

For every skill gap provide:

skill:
The skill to learn.

reason:
Why this skill would help the candidate.

priority:
Use one of:

"High"
"Medium"
"Low"

Return approximately 5 to 10 useful skill gaps.

==================================================
CAREER ROLES
==================================================

Recommend realistic career/job roles based on:

- current skills
- education
- projects
- internships
- experience

Return approximately 5 career roles.

For every role provide:

role:
Example:
"Python Developer"

match:
A numeric percentage from 0 to 100.

reason:
Explain briefly why the role matches the resume.

Do NOT recommend roles that have no reasonable connection
to the candidate's background.

==================================================
PERSONALIZED ROADMAP
==================================================

Create a practical career roadmap based on the candidate's
current profile.

Return approximately 4 to 6 phases.

Each phase must contain:

phase:
Example:
"Phase 1"

title:
Example:
"Strengthen Python Fundamentals"

duration:
Example:
"2-3 weeks"

skills:
Skills to learn/practice.

projects:
Projects the candidate should build.

actions:
Specific actions the candidate should take.

The roadmap should move from the candidate's CURRENT LEVEL
towards realistic target career roles.

==================================================
IMPORTANT RULES
==================================================

1. Return ONLY valid JSON.

2. Do not return markdown.

3. Do not invent resume facts.

4. Skill gaps and roadmap recommendations are allowed to
   be recommendations based on the resume.

5. Do not put existing skills into skill_gaps unless the
   recommendation is specifically for advanced mastery.

6. Keep career roles realistic.

7. Keep match values numeric.

8. Keep resume_score numeric.

9. Remove duplicate skills.

10. If resume information is missing, use empty strings
    or empty arrays.

==================================================
RESUME TEXT
==================================================

-------------------------
{resume_text}
-------------------------
"""

    # ======================================================
    # CALL GEMINI
    # ======================================================

    response = generate_with_fallback(prompt)

    # ======================================================
    # CONVERT RESPONSE TO JSON
    # ======================================================

    data = extract_json(response)

    if not isinstance(data, dict):
        raise ValueError("Invalid AI response format.")

    # ======================================================
    # SAFETY DEFAULTS
    # ======================================================

    defaults = {
        "candidate_name": "",
        "email": "",
        "phone": "",

        "education": [],
        "skills": [],
        "programming_languages": [],
        "frameworks": [],
        "databases": [],
        "tools": [],
        "certifications": [],

        "projects": [],
        "experience": [],
        "internships": [],

        "summary": "",

        "resume_score": 0,

        "skill_gaps": [],
        "career_roles": [],
        "roadmap": []
    }

    for key, default_value in defaults.items():

        if key not in data or data[key] is None:
            data[key] = default_value

    # ======================================================
    # NORMALIZE NUMERIC FIELDS
    # ======================================================

    try:
        data["resume_score"] = int(
            float(data.get("resume_score", 0))
        )
    except (ValueError, TypeError):
        data["resume_score"] = 0

    data["resume_score"] = max(
        0,
        min(100, data["resume_score"])
    )

    # Normalize career match percentages

    if isinstance(data.get("career_roles"), list):

        for role in data["career_roles"]:

            if not isinstance(role, dict):
                continue

            try:
                role["match"] = int(
                    float(role.get("match", 0))
                )
            except (ValueError, TypeError):
                role["match"] = 0

            role["match"] = max(
                0,
                min(100, role["match"])
            )

    return data