import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ==========================================
# CLEAN TEXT
# ==========================================

def clean_text(text):
    if not text:
        return ""

    text = text.lower()

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ==========================================
# FIND RELEVANT CHUNKS
# ==========================================

def find_relevant_chunks(
    question,
    chunks,
    top_k=5,
    min_score=0.05
):

    if not question:
        return []

    if not chunks:
        return []

    # Clean question
    cleaned_question = clean_text(question)

    # Clean chunks
    cleaned_chunks = [
        clean_text(chunk)
        for chunk in chunks
    ]

    # Remove empty chunks
    valid_chunks = []

    for index, chunk in enumerate(cleaned_chunks):

        if chunk:
            valid_chunks.append(
                (index, chunk)
            )

    if not valid_chunks:
        return []

    original_indexes = [
        item[0]
        for item in valid_chunks
    ]

    texts = [
        item[1]
        for item in valid_chunks
    ]

    # ==========================================
    # TF-IDF
    # ==========================================

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True
    )

    try:

        vectors = vectorizer.fit_transform(
            texts + [cleaned_question]
        )

    except ValueError:

        return []

    # Question vector
    question_vector = vectors[-1]

    # Chunk vectors
    chunk_vectors = vectors[:-1]

    # ==========================================
    # COSINE SIMILARITY
    # ==========================================

    similarities = cosine_similarity(
        question_vector,
        chunk_vectors
    )[0]

    # ==========================================
    # RANK CHUNKS
    # ==========================================

    ranked_indexes = similarities.argsort()[::-1]

    relevant_chunks = []

    for ranked_index in ranked_indexes:

        score = float(
            similarities[ranked_index]
        )

        # Ignore irrelevant chunks
        if score < min_score:
            continue

        original_index = original_indexes[
            ranked_index
        ]

        relevant_chunks.append({

            "chunk_id": int(
                original_index + 1
            ),

            "score": round(
                score,
                4
            ),

            "text": chunks[
                original_index
            ]

        })

        # Stop after top_k
        if len(relevant_chunks) >= top_k:
            break

    return relevant_chunks