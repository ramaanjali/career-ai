# ==========================================================
# database.py
# PDF AI ASSISTANT DATABASE
# USER-WISE PDF + Q&A HISTORY
# ==========================================================

import sqlite3
import os
from datetime import datetime


# ==========================================================
# DATABASE PATH
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_FILE = os.path.join(
    BASE_DIR,
    "pdf_ai_assistant.db"
)


# ==========================================================
# DATABASE CONNECTION
# ==========================================================

def get_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ==========================================================
# CREATE / MIGRATE TABLES
# ==========================================================

def create_tables():

    conn = get_connection()
    cursor = conn.cursor()

    # ------------------------------------------------------
    # PDF HISTORY
    # ------------------------------------------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pdf_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT NOT NULL,
            file_path TEXT,
            page_count INTEGER DEFAULT 0,
            character_count INTEGER DEFAULT 0,
            word_count INTEGER DEFAULT 0,
            uploaded_at TEXT NOT NULL
        )
    """)

    # ------------------------------------------------------
    # Safe migration for old databases
    # ------------------------------------------------------
    cursor.execute("PRAGMA table_info(pdf_history)")
    pdf_columns = {
        row["name"] for row in cursor.fetchall()
    }

    if "user_id" not in pdf_columns:
        cursor.execute(
            "ALTER TABLE pdf_history ADD COLUMN user_id INTEGER"
        )

    # ------------------------------------------------------
    # Q&A HISTORY
    # ------------------------------------------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS qa_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pdf_id INTEGER NOT NULL,
            user_id INTEGER,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (pdf_id)
                REFERENCES pdf_history(id)
                ON DELETE CASCADE
        )
    """)

    cursor.execute("PRAGMA table_info(qa_history)")
    qa_columns = {
        row["name"] for row in cursor.fetchall()
    }

    if "user_id" not in qa_columns:
        cursor.execute(
            "ALTER TABLE qa_history ADD COLUMN user_id INTEGER"
        )

    conn.commit()
    conn.close()

    print("DATABASE TABLES CREATED / MIGRATED SUCCESSFULLY")


# ==========================================================
# SAVE PDF HISTORY
# ==========================================================

def save_pdf_history(
    filename,
    file_path,
    page_count=0,
    character_count=0,
    word_count=0,
    user_id=None
):

    conn = get_connection()
    cursor = conn.cursor()

    uploaded_at = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO pdf_history
        (
            user_id,
            filename,
            file_path,
            page_count,
            character_count,
            word_count,
            uploaded_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        filename,
        file_path,
        page_count,
        character_count,
        word_count,
        uploaded_at
    ))

    pdf_id = cursor.lastrowid

    conn.commit()
    conn.close()

    print(
        "PDF HISTORY SAVED:",
        pdf_id,
        "USER:",
        user_id
    )

    return pdf_id


# ==========================================================
# GET ALL PDF HISTORY FOR ONE USER
# ==========================================================

def get_pdf_history(user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        rows = []
    else:
        cursor.execute("""
            SELECT
                id,
                user_id,
                filename,
                file_path,
                page_count,
                character_count,
                word_count,
                uploaded_at
            FROM pdf_history
            WHERE user_id = ?
            ORDER BY uploaded_at DESC
        """, (user_id,))

        rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# ==========================================================
# GET PDF BY ID + USER
# ==========================================================

def get_pdf_by_id(pdf_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return None

    cursor.execute("""
        SELECT
            id,
            user_id,
            filename,
            file_path,
            page_count,
            character_count,
            word_count,
            uploaded_at
        FROM pdf_history
        WHERE id = ?
          AND user_id = ?
    """, (
        pdf_id,
        user_id
    ))

    row = cursor.fetchone()

    conn.close()

    if row:
        return dict(row)

    return None


# ==========================================================
# GET PDF BY FILENAME + USER
# ==========================================================

def get_pdf_by_filename(filename, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return None

    cursor.execute("""
        SELECT
            id,
            user_id,
            filename,
            file_path,
            page_count,
            character_count,
            word_count,
            uploaded_at
        FROM pdf_history
        WHERE filename = ?
          AND user_id = ?
        ORDER BY id DESC
        LIMIT 1
    """, (
        filename,
        user_id
    ))

    row = cursor.fetchone()

    conn.close()

    if row:
        return dict(row)

    return None


# ==========================================================
# SAVE Q&A HISTORY
# ==========================================================

def save_qa_history(
    pdf_id,
    question,
    answer,
    user_id=None
):

    conn = get_connection()
    cursor = conn.cursor()

    # If user_id is omitted, derive it from the PDF owner.
    if user_id is None:
        cursor.execute("""
            SELECT user_id
            FROM pdf_history
            WHERE id = ?
        """, (pdf_id,))

        owner = cursor.fetchone()

        if owner:
            user_id = owner["user_id"]

    # Do not save a Q&A record for an unknown PDF owner.
    if user_id is None:
        conn.close()
        raise ValueError(
            "Cannot save Q&A without a valid user_id."
        )

    created_at = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO qa_history
        (
            pdf_id,
            user_id,
            question,
            answer,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        pdf_id,
        user_id,
        question,
        answer,
        created_at
    ))

    qa_id = cursor.lastrowid

    conn.commit()
    conn.close()

    print(
        "Q&A HISTORY SAVED:",
        qa_id,
        "PDF ID:",
        pdf_id,
        "USER:",
        user_id
    )

    return qa_id


# ==========================================================
# GET Q&A HISTORY FOR ONE PDF + USER
# ==========================================================

def get_qa_history(pdf_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return []

    cursor.execute("""
        SELECT
            id,
            pdf_id,
            user_id,
            question,
            answer,
            created_at,
            created_at AS asked_at
        FROM qa_history
        WHERE pdf_id = ?
          AND user_id = ?
        ORDER BY created_at ASC
    """, (
        pdf_id,
        user_id
    ))

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# ==========================================================
# GET ALL Q&A HISTORY FOR ONE USER
# ==========================================================

def get_all_qa_history(user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return []

    cursor.execute("""
        SELECT
            q.id,
            q.pdf_id,
            q.user_id,
            q.question,
            q.answer,
            q.created_at,
            q.created_at AS asked_at,
            p.filename
        FROM qa_history q
        LEFT JOIN pdf_history p
            ON q.pdf_id = p.id
        WHERE q.user_id = ?
          AND p.user_id = ?
        ORDER BY q.created_at DESC
    """, (
        user_id,
        user_id
    ))

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# ==========================================================
# GET SINGLE Q&A BY ID + USER
# ==========================================================

def get_qa_by_id(qa_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return None

    cursor.execute("""
        SELECT
            q.id,
            q.pdf_id,
            q.user_id,
            q.question,
            q.answer,
            q.created_at,
            q.created_at AS asked_at,
            p.filename
        FROM qa_history q
        LEFT JOIN pdf_history p
            ON q.pdf_id = p.id
        WHERE q.id = ?
          AND q.user_id = ?
          AND p.user_id = ?
    """, (
        qa_id,
        user_id,
        user_id
    ))

    row = cursor.fetchone()

    conn.close()

    if row:
        return dict(row)

    return None


# ==========================================================
# GET RECENT Q&A FOR ONE USER
# ==========================================================

def get_recent_qa_history(limit=20, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return []

    cursor.execute("""
        SELECT
            q.id,
            q.pdf_id,
            q.user_id,
            q.question,
            q.answer,
            q.created_at,
            q.created_at AS asked_at,
            p.filename
        FROM qa_history q
        LEFT JOIN pdf_history p
            ON q.pdf_id = p.id
        WHERE q.user_id = ?
          AND p.user_id = ?
        ORDER BY q.created_at DESC
        LIMIT ?
    """, (
        user_id,
        user_id,
        limit
    ))

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# ==========================================================
# DELETE Q&A HISTORY FOR ONE USER'S PDF
# ==========================================================

def delete_qa_history(pdf_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return 0

    cursor.execute("""
        DELETE FROM qa_history
        WHERE pdf_id = ?
          AND user_id = ?
    """, (
        pdf_id,
        user_id
    ))

    deleted_count = cursor.rowcount

    conn.commit()
    conn.close()

    print(
        "Q&A HISTORY DELETED:",
        deleted_count,
        "PDF:",
        pdf_id,
        "USER:",
        user_id
    )

    return deleted_count


# ==========================================================
# DELETE PDF HISTORY FOR ONE USER
# ==========================================================

def delete_pdf_history(pdf_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return False

    # Delete related Q&A only for this user.
    cursor.execute("""
        DELETE FROM qa_history
        WHERE pdf_id = ?
          AND user_id = ?
    """, (
        pdf_id,
        user_id
    ))

    cursor.execute("""
        DELETE FROM pdf_history
        WHERE id = ?
          AND user_id = ?
    """, (
        pdf_id,
        user_id
    ))

    deleted_pdf = cursor.rowcount

    conn.commit()
    conn.close()

    print(
        "PDF HISTORY DELETED:",
        pdf_id,
        "USER:",
        user_id
    )

    return deleted_pdf > 0


# ==========================================================
# TOTAL PDFs FOR ONE USER
# ==========================================================

def get_total_pdfs(user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return 0

    cursor.execute("""
        SELECT COUNT(*)
        FROM pdf_history
        WHERE user_id = ?
    """, (user_id,))

    result = cursor.fetchone()[0]

    conn.close()

    return result


# ==========================================================
# TOTAL QUESTIONS FOR ONE USER
# ==========================================================

def get_total_questions(user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return 0

    cursor.execute("""
        SELECT COUNT(*)
        FROM qa_history
        WHERE user_id = ?
    """, (user_id,))

    result = cursor.fetchone()[0]

    conn.close()

    return result


# ==========================================================
# TOTAL WORDS FOR ONE USER
# ==========================================================

def get_total_words(user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return 0

    cursor.execute("""
        SELECT COALESCE(SUM(word_count), 0)
        FROM pdf_history
        WHERE user_id = ?
    """, (user_id,))

    result = cursor.fetchone()[0]

    conn.close()

    return result


# ==========================================================
# RECENT PDFs FOR ONE USER
# ==========================================================

def get_recent_pdfs(limit=5, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return []

    cursor.execute("""
        SELECT
            id,
            user_id,
            filename,
            file_path,
            page_count,
            character_count,
            word_count,
            uploaded_at
        FROM pdf_history
        WHERE user_id = ?
        ORDER BY uploaded_at DESC
        LIMIT ?
    """, (
        user_id,
        limit
    ))

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


# ==========================================================
# GET Q&A COUNT FOR ONE USER'S PDF
# ==========================================================

def get_qa_count(pdf_id, user_id=None):

    conn = get_connection()
    cursor = conn.cursor()

    if user_id is None:
        conn.close()
        return 0

    cursor.execute("""
        SELECT COUNT(*)
        FROM qa_history
        WHERE pdf_id = ?
          AND user_id = ?
    """, (
        pdf_id,
        user_id
    ))

    result = cursor.fetchone()[0]

    conn.close()

    return result


# ==========================================================
# QUESTIONS COUNT FOR ONE USER'S PDF
# ==========================================================

def get_question_count_for_pdf(pdf_id, user_id=None):
    return get_qa_count(
        pdf_id,
        user_id
    )


# ==========================================================
# TEST DATABASE
# ==========================================================

if __name__ == "__main__":

    print()
    print("========================================")
    print("PDF AI ASSISTANT DATABASE TEST")
    print("========================================")

    print(
        "Database:",
        DATABASE_FILE
    )

    create_tables()

    print(
        "Database tables are ready."
    )

    print(
        "========================================"
    )
