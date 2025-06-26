import psycopg2
import time

TABLE_NAME = 'waf_rules'
conn = psycopg2.connect("dbname=waf user=user password=password host=localhost")

def get_insert_count():
    with conn.cursor() as cur:
        cur.execute(f"""
            SELECT n_tup_ins FROM pg_stat_user_tables
            WHERE relname = %s
        """, (TABLE_NAME,))
        result = cur.fetchone()
        return result[0] if result else 0

previous_count = get_insert_count()
print(f"🔎 Insertion initiale : {previous_count} lignes")

while True:
    time.sleep(60)  # ⏱️ chaque minute
    current_count = get_insert_count()
    if current_count == previous_count:
        print("⚠️ Aucune insertion depuis 1 minute")
    else:
        print(f"✅ Insertions détectées : +{current_count - previous_count} lignes")
        previous_count = current_count