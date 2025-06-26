import requests
import json
import time

SPARK_HOST = "http://localhost:4040"  # ou http://history-server:18080
APP_ENDPOINT = f"{SPARK_HOST}/api/v1/applications"

def get_app_id():
    try:
        apps = requests.get(APP_ENDPOINT).json()
        if not apps:
            print("❌ Aucune application Spark en cours.")
            return None
        return apps[0]['id']
    except Exception as e:
        print("❌ Erreur de connexion à Spark:", e)
        return None

def monitor_streams(app_id):
    stream_url = f"{SPARK_HOST}/api/v1/applications/{app_id}/streamingqueries"
    try:
        response = requests.get(stream_url).json()
        if not response:
            print("⚠️ Aucun stream actif trouvé.")
            return

        for stream in response:
            print(f"🔎 Nom         : {stream.get('name')}")
            print(f"🆔 ID          : {stream.get('id')}")
            print(f"📊 Statut      : {stream.get('status')}")
            print(f"📥 Rows        : {stream.get('lastProgress', {}).get('numInputRows', 'N/A')}")
            print(f"⏱  Batch Time  : {stream.get('lastProgress', {}).get('batchDuration', 'N/A')} ms")
            print(f"📆 Dernier batch : {stream.get('lastProgress', {}).get('timestamp', 'N/A')}")
            print("-" * 60)
    except Exception as e:
        print("❌ Erreur récupération des streams:", e)

if __name__ == "__main__":
    print("🔁 Lancement monitoring des streams Spark...")
    while True:
        app_id = get_app_id()
        if app_id:
            monitor_streams(app_id)
        else:
            print("⏳ En attente d'une application Spark...")
        time.sleep(30)  # Requête toutes les 30 secondes