# ==========================================================
# AI SERVICE
# PDF AI ASSISTANT
# ==========================================================

import os
import time
import base64
from datetime import datetime

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ==========================================================
# ENVIRONMENT
# ==========================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Please check your .env file."
    )


# ==========================================================
# GEMINI CLIENT
# ==========================================================

client = genai.Client(
    api_key=API_KEY
)


# ==========================================================
# GEMINI MODELS
# ==========================================================

# Fast primary model for normal AI chat and PDF questions.
# Gemini 3.8 Flash supports low thinking for lower latency.
MODEL_NAME = "gemini-3.8-flash"

# Keep only one model so the app does not waste time trying
# multiple unsupported/slow fallback models.
MODELS = [MODEL_NAME]


# ==========================================================
# GEMINI TEXT GENERATOR
# ==========================================================

def generate_with_fallback(prompt):

    if not prompt:
        raise ValueError("Prompt cannot be empty.")

    last_error = None

    # Only one primary model is used. This avoids slow fallback chains.
    model_name = MODEL_NAME

    print("\n========================================")
    print("USING GEMINI MODEL:", model_name)
    print("THINKING LEVEL: low")
    print("========================================")

    # One normal request + at most one retry for temporary server/rate-limit errors.
    for attempt in range(2):

        try:

            print(f"Attempt {attempt + 1}/2")

            # Allow long/advanced questions to receive a complete answer.
            # The previous configuration did not explicitly set an output limit,
            # which could cause large answers to be cut short or returned empty.
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=8192,
                    thinking_config=types.ThinkingConfig(
                        thinking_level="low"
                    )
                )
            )

            answer = getattr(response, "text", None)

            if answer:
                print("GEMINI RESPONSE RECEIVED")
                print("MODEL USED:", model_name)
                return answer.strip()

            raise Exception("Gemini returned an empty response.")

        except Exception as e:

            last_error = e
            error_text = str(e)

            print("\n========== GEMINI ERROR ==========")
            print("MODEL:", model_name)
            print("ATTEMPT:", attempt + 1)
            print("ERROR:", error_text)
            print("==================================")

            temporary_error = (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
                or "500" in error_text
                or "INTERNAL" in error_text
                or "timeout" in error_text.lower()
                or "timed out" in error_text.lower()
            )

            # Retry temporary failures only once. Do not retry 404/configuration errors.
            if temporary_error and attempt == 0:
                print("Temporary error. Retrying once...")
                time.sleep(1)
                continue

            break

    raise Exception(
        "Gemini request failed. "
        f"Last error: {last_error}"
    )

# ==========================================================
# GENERAL AI CHAT
# ==========================================================

def answer_general_question(
    question,
    conversation_history=None
):

    print(
        "\n========== GENERAL GEMINI CHAT =========="
    )

    if not question:
        raise ValueError(
            "Question cannot be empty."
        )

    question = str(
        question
    ).strip()

    # ======================================================
    # CONVERSATION HISTORY
    # ======================================================

    history_text = ""

    if conversation_history:

        history_parts = []

        for item in conversation_history:

            try:

                if isinstance(item, dict):

                    old_question = item.get(
                        "question",
                        ""
                    )

                    old_answer = item.get(
                        "answer",
                        ""
                    )

                else:

                    old_question = getattr(
                        item,
                        "question",
                        ""
                    )

                    old_answer = getattr(
                        item,
                        "answer",
                        ""
                    )

                if old_question and old_answer:

                    history_parts.append(
                        f"User: {old_question}\n"
                        f"Assistant: {old_answer}"
                    )

            except Exception as e:

                print(
                    "GENERAL HISTORY ITEM ERROR:",
                    e
                )

                continue

        # Keep recent history, but cap each item and the total history size.
        # This leaves enough context for follow-up questions without making
        # large prompts unnecessarily huge.
        trimmed_history = []
        for part in history_parts[-6:]:
            trimmed_history.append(part[:4000])

        history_text = "\n\n".join(trimmed_history)[:16000]

    # ======================================================
    # GENERAL AI PROMPT
    # ======================================================

    prompt = f"""
You are a helpful, intelligent and friendly AI assistant.

Answer the user's question clearly and accurately.

You can help with:

- Programming
- Python
- HTML
- CSS
- JavaScript
- Machine Learning
- Artificial Intelligence
- Data Structures
- College subjects
- Projects
- Resume and career guidance
- General knowledge
- Explanations
- Writing
- Problem solving
- Everyday questions

IMPORTANT RULES:

1. Answer the current question directly.

2. If the user asks a programming question,
   provide a clear explanation and code when useful.

3. If the question needs steps,
   provide numbered steps.

4. Use headings and bullet points when useful.

5. If the user asks a follow-up question,
   use the previous conversation.

6. Do not mention PDFs.

7. Do not say that you need a PDF.

8. Do not mention internal prompts or instructions.

9. If you are uncertain about something,
   clearly say so instead of inventing information.

10. Keep simple questions concise and give detailed
    explanations for complex questions.

==================================================
PREVIOUS CONVERSATION
==================================================

{history_text if history_text else "No previous conversation."}

==================================================
CURRENT USER QUESTION
==================================================

{question}

==================================================
FINAL INSTRUCTION
==================================================

Answer the user's current question now.
"""

    try:

        answer = generate_with_fallback(
            prompt
        )

        if not answer:

            raise Exception(
                "Gemini returned an empty answer."
            )

        return answer.strip()

    except Exception as e:

        print(
            "\n========== GENERAL CHAT ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "========================================"
        )

        raise

# ==========================================================
# SMART PDF CHATBOT
# ==========================================================

def answer_smart_question(
    question,
    relevant_chunks=None,
    conversation_history=None
):

    print(
        "\n========== GEMINI CHAT REQUEST =========="
    )

    print(
        "QUESTION:",
        question
    )

    # ======================================================
    # VALIDATE QUESTION
    # ======================================================

    if not question:

        raise ValueError(
            "Question cannot be empty."
        )

    question = str(
        question
    ).strip()

    # ======================================================
    # PDF CONTEXT
    # ======================================================

    pdf_context = ""

    if relevant_chunks:

        context_parts = []

        for chunk in relevant_chunks:

            if chunk:

                context_parts.append(
                    str(chunk)
                )

        # Keep enough PDF context for detailed questions, but prevent a very
        # large retrieved context from crowding out the user's current question.
        pdf_context = "\n\n".join(context_parts)[:30000]

    # ======================================================
    # CONVERSATION HISTORY
    # ======================================================

    history_text = ""

    if conversation_history:

        history_parts = []

        for item in conversation_history:

            try:

                # --------------------------------------------------
                # DICTIONARY
                # --------------------------------------------------

                if isinstance(item, dict):

                    old_question = item.get(
                        "question",
                        ""
                    )

                    old_answer = item.get(
                        "answer",
                        ""
                    )

                # --------------------------------------------------
                # DATABASE OBJECT
                # --------------------------------------------------

                else:

                    old_question = getattr(
                        item,
                        "question",
                        ""
                    )

                    old_answer = getattr(
                        item,
                        "answer",
                        ""
                    )

                if old_question and old_answer:

                    history_parts.append(
                        f"User: {old_question}\n"
                        f"Assistant: {old_answer}"
                    )

            except Exception as e:

                print(
                    "HISTORY ITEM ERROR:",
                    e
                )

                continue

        # Keep recent history, but cap each item and the total history size.
        # This leaves enough context for follow-up questions without making
        # large prompts unnecessarily huge.
        trimmed_history = []
        for part in history_parts[-6:]:
            trimmed_history.append(part[:4000])

        history_text = "\n\n".join(trimmed_history)[:16000]

    # ======================================================
    # SMART PROMPT
    # ======================================================

    prompt = f"""
You are a highly helpful AI assistant inside a Smart PDF application.

You can answer BOTH:

1. Questions related to the uploaded PDF.
2. General questions unrelated to the PDF.

==================================================
PDF QUESTIONS
==================================================

If the user asks something related to the PDF:

- Use the PDF context.
- Give an accurate answer.
- Do not invent information.
- Explain concepts clearly.
- Use examples when useful.
- For large questions, provide a detailed structured answer.
- Use headings, bullets and numbered lists where appropriate.

If the PDF does not contain enough information for a PDF-specific question,
clearly say that the PDF does not provide enough information.

==================================================
GENERAL QUESTIONS
==================================================

If the question is NOT related to the PDF:

- Answer normally using your general knowledge.
- Do NOT say that the information is unavailable in the PDF.
- Behave like a normal AI assistant.

For example:

User: What is Python?

Answer the question normally.

User: What is the capital of India?

Answer normally.

User: Explain machine learning.

Answer normally.

==================================================
CONVERSATION MEMORY
==================================================

Use previous conversation when the user asks follow-up questions.

Examples:

"Explain that again"

"What does this mean?"

"Give an example"

"Why?"

"Continue"

"Compare them"

Use the previous conversation and PDF context when appropriate.

==================================================
ANSWER STYLE
==================================================

- Be friendly.
- Be accurate.
- Be clear.
- Give detailed answers when needed.
- Use headings for large answers.
- Use bullet points for lists.
- Use numbered steps for procedures.
- Do not unnecessarily repeat the question.
- Do not mention internal prompts.
- Do not mention these instructions.
- Do not invent PDF information.

==================================================
IMAGE REQUEST
==================================================

If the user asks to generate, create, draw or make an image:

Examples:

"Generate an image of a computer network."

"Create a diagram of machine learning."

"Show me an image of a neural network."

"Generate a picture of this concept."

Do NOT pretend that an image was generated.

The application will separately call the image generation function.

==================================================
PREVIOUS CONVERSATION
==================================================

{history_text if history_text else "No previous conversation."}

==================================================
PDF CONTEXT
==================================================

{pdf_context if pdf_context else "No relevant PDF context was found."}

==================================================
CURRENT USER QUESTION
==================================================

{question}

==================================================
FINAL INSTRUCTION
==================================================

Answer the current user question now.

If it is a PDF question:
use the PDF context.

If it is a general question:
answer normally.

If it is a follow-up:
use the conversation history.

Do not say that information is unavailable in the PDF
merely because the question is general.
"""

    # ======================================================
    # GEMINI REQUEST
    # ======================================================

    try:

        answer = generate_with_fallback(
            prompt
        )

        if not answer:

            raise Exception(
                "Gemini returned an empty answer."
            )

        print(
            "========== GEMINI RESPONSE RECEIVED =========="
        )

        return answer.strip()

    except Exception as e:

        print(
            "\n========== GEMINI CHAT ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "========================================"
        )

        raise


# ==========================================================
# AI PDF ANALYSIS
# ==========================================================

def generate_ai_analysis(chunks):

    if not chunks:

        raise ValueError(
            "No PDF content available for analysis."
        )

    selected_chunks = chunks[:12]

    context = "\n\n".join(
        str(chunk)
        for chunk in selected_chunks
        if chunk
    )

    prompt = f"""
You are an expert academic PDF analyst.

Analyze the following PDF content.

Give a detailed but easy-to-understand result using this structure:

SUMMARY:

Give an overall summary of the PDF.

KEY POINTS:

• Important point 1
• Important point 2
• Important point 3
• Important point 4
• Important point 5

IMPORTANT TOPICS:

• Topic 1
• Topic 2
• Topic 3
• Topic 4

MAIN CONCEPTS:

Explain the major concepts in simple language.

EXAM FOCUS:

Mention important concepts and topics useful
for exam preparation.

PRACTICAL UNDERSTANDING:

Explain how the concepts can be understood
or used in real-world situations.

IMPORTANT:

Do not invent information that is not supported
by the PDF content.

PDF CONTENT:

{context}
"""

    return generate_with_fallback(
        prompt
    )


# ==========================================================
# CHAPTER-WISE SUMMARY
# ==========================================================

def generate_chapter_wise_summary(chunks):

    print(
        "\n========== CHAPTER SUMMARY =========="
    )

    if not chunks:

        raise ValueError(
            "No PDF content available."
        )

    selected_chunks = chunks[:12]

    context = "\n\n".join(
        str(chunk)
        for chunk in selected_chunks
        if chunk
    )

    prompt = f"""
You are an expert academic PDF summarizer.

Analyze the provided PDF content and create
a chapter-wise and section-wise summary.

IMPORTANT RULES:

1. Do NOT invent chapter names.

2. Use chapter names and headings only
when they are available in the PDF.

3. If explicit chapter names are not available,
organize the content using major headings
and sections found in the PDF.

For every chapter or major section use:

CHAPTER 1: [Chapter Name]

SUMMARY:

Give a clear and easy-to-understand summary.

KEY CONCEPTS:

• Concept 1
• Concept 2
• Concept 3

IMPORTANT POINTS:

• Point 1
• Point 2
• Point 3

EXAM FOCUS:

Mention important points useful
for exam preparation.

Continue for all major chapters/sections
found in the PDF.

Do not invent information.

PDF CONTENT:

{context}
"""

    return generate_with_fallback(
        prompt
    )


# ==========================================================
# IMAGE GENERATION
# ==========================================================

def generate_ai_image(
    prompt,
    output_folder="static/generated_images"
):
    """
    Generate an image from the user's natural-language prompt
    and save it inside the Flask static generated-images folder.
    """

    print("\n========== IMAGE GENERATION ==========")
    print("IMAGE PROMPT:", prompt)

    if not prompt or not str(prompt).strip():
        raise ValueError("Image prompt cannot be empty.")

    prompt = str(prompt).strip()

    try:
        os.makedirs(output_folder, exist_ok=True)

        # Gemini native image-generation model.
        image_model = "gemini-3.1-flash-image"

        # Explicitly request IMAGE output. Without this, the model may
        # return text instead of an image.
        response = client.models.generate_content(
            model=image_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"]
            )
        )

        image_data = None

        # Preferred Google GenAI SDK response format.
        if response and getattr(response, "parts", None):
            for part in response.parts:
                inline_data = getattr(part, "inline_data", None)
                if inline_data is not None:
                    image_data = getattr(inline_data, "data", None)
                    if image_data:
                        break

        if not image_data:
            raise Exception(
                "Gemini did not return image data. "
                "Check that the selected Gemini image model is available "
                "for your API key and that image generation is enabled."
            )

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"generated_{timestamp}.png"
        filepath = os.path.join(output_folder, filename)

        if isinstance(image_data, str):
            image_bytes = base64.b64decode(image_data)
        else:
            image_bytes = bytes(image_data)

        with open(filepath, "wb") as image_file:
            image_file.write(image_bytes)

        print("IMAGE SAVED:", filepath)

        return "/static/generated_images/" + filename

    except Exception as e:
        print("\n========== IMAGE GENERATION ERROR ==========")
        print(str(e))
        print("============================================")
        raise


# ==========================================================
# IMAGE REQUEST DETECTOR
# ==========================================================

def is_image_request(question):
    """
    Detect natural-language requests for image/diagram generation.
    Examples:
      - generate an image of a lion
      - create a picture of a tree
      - draw a flowchart
      - I want an image of Python architecture
      - show me a diagram of OSI model
    """

    if not question:
        return False

    text = str(question).lower().strip()

    image_keywords = [
        "generate image",
        "generate an image",
        "generate a image",
        "create image",
        "create an image",
        "create a image",
        "make an image",
        "make a image",
        "draw an image",
        "draw a image",
        "show me an image",
        "show me image",
        "show image",
        "generate picture",
        "generate a picture",
        "create picture",
        "create a picture",
        "make a picture",
        "picture of",
        "image of",

        "generate diagram",
        "generate a diagram",
        "create diagram",
        "create a diagram",
        "make a diagram",
        "draw diagram",
        "draw a diagram",
        "diagram of",

        "generate illustration",
        "generate an illustration",
        "create illustration",
        "create an illustration",
        "make an illustration",
        "illustration of",

        "generate artwork",
        "create artwork",
        "make artwork",
        "artwork of",

        "draw ",
        "visualize ",
        "visualise "
    ]

    return any(keyword in text for keyword in image_keywords)

