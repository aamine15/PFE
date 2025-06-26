import os
import time
import shutil
from datetime import datetime, timedelta

# Configuration
CHECKPOINT_ROOT = "/tmp/checkpoints"
MAX_AGE_DAYS = 2  # Supprimer les checkpoints plus vieux que ce nombre de jours

# Calcul de la date limite
cutoff_time = time.time() - (MAX_AGE_DAYS * 86400)  # 86400 = secondes dans un jour

deleted = 0

for root, dirs, files in os.walk(CHECKPOINT_ROOT):
    for dir_name in dirs:
        dir_path = os.path.join(root, dir_name)
        try:
            if os.path.isdir(dir_path):
                dir_mtime = os.path.getmtime(dir_path)
                if dir_mtime < cutoff_time:
                    shutil.rmtree(dir_path)
                    print(f"🗑️  Supprimé : {dir_path}")
                    deleted += 1
        except Exception as e:
            print(f"⚠️  Erreur lors de la suppression de {dir_path}: {e}")

print(f"\n✅ Nettoyage terminé. {deleted} dossier(s) supprimé(s).")
