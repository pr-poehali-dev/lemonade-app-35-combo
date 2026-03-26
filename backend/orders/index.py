"""
API для управления заказами: создание, получение, обновление статуса, отмена.
"""
import json
import os
import random
import string
import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def generate_code():
    return "".join(random.choices(string.digits, k=5))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    headers = {**cors_headers(), "Content-Type": "application/json"}

    # GET /orders — список всех заказов
    if method == "GET":
        with get_conn() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT code, items, total, payment, status, to_char(created_at, 'HH24:MI, DD TMMonth YYYY') as created_at FROM orders ORDER BY created_at DESC"
                )
                rows = [dict(r) for r in cur.fetchall()]
        return {"statusCode": 200, "headers": headers, "body": json.dumps(rows, ensure_ascii=False)}

    # POST /orders — создать заказ
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        items = body["items"]
        total = body["total"]
        payment = body["payment"]
        code = generate_code()
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO orders (code, items, total, payment, status) VALUES (%s, %s, %s, %s, 'preparing')",
                    (code, json.dumps(items), total, payment),
                )
            conn.commit()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"code": code})}

    # PUT /orders — обновить статус
    if method == "PUT":
        body = json.loads(event.get("body") or "{}")
        code = body["code"]
        status = body["status"]
        allowed = ("preparing", "ready", "done", "cancelled")
        if status not in allowed:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "invalid status"})}
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE orders SET status = %s WHERE code = %s", (status, code))
            conn.commit()
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "not found"})}