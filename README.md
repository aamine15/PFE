# 🔐 Détection intelligente des attaques Web via un pipeline Big Data temps réel

Ce projet met en œuvre une architecture Big Data en temps réel pour détecter et analyser les attaques Web grâce à un pipeline basé sur **Kafka**, **Spark Structured Streaming**, **FastAPI** et **React**.

---

## 🧱 Architecture du pipeline

### 1. Simulateur WAF (Python)
- Génère des logs d'attaques Web simulées (`SQLi`, `XSS`, `CSRF`, etc.).
- Ajoute du bruit, des périodes de burst et de silence.
- Envoie les logs vers Kafka (`topic: waf_logs`).

### 2. Kafka (Streaming)
- Transporte les logs WAF vers Spark en temps réel.
- Topics utilisés : `waf_logs`, `processed_logs`, `metrics`.

### 3. Spark Structured Streaming (PySpark)
- Ingestion des logs Kafka.
- Fenêtrage glissant pour détection et agrégation :
  - `avg_response_time`
  - `threat_timeline`
  - `attack_types`
  - `waf_rules_metrics`
- Écrit en temps réel dans PostgreSQL.

### 4. PostgreSQL
- Stocke les métriques calculées par Spark.
- Tables principales :
  - `threat_timeline`
  - `waf_rules_metrics`
  - `geo_threats`
  - `avg_response_time`
  - `rules_reference` (table enrichissement `rule_id` → nom + description)

### 5. FastAPI (Backend API)
- Fournit des endpoints REST pour React :
  - `/api/security-kpis`
  - `/api/recent-threats`
  - `/api/waf-rules`
  - `/api/geo-threats`
  - `/api/avg-response-time`
- Jointures SQL (`JOIN`) pour enrichir les résultats.

### 6. React (Dashboard)
- Dashboard en temps réel :
  - KPIs (threats, bots, IPs, requests...)
  - Graphiques `Recharts`
  - Timeline, top attacks, règles WAF
- Hooks personnalisés (ex. `useSecurityKpis`, `useAttackTypes`, `useWafRules`, etc.).
- Auto-refresh toutes les 5 secondes.

### 7. Docker / Infrastructure
- Conteneurisation de chaque composant :
  - Simulateur WAF
  - Kafka + Zookeeper
  - Spark
  - FastAPI
  - PostgreSQL
  - React
- Fichier `docker-compose.yml` fourni.
- ⚙️ **Option avancée** : déploiement Kubernetes avec Ingress NGINX.

### 8. (Optionnel) Alerting
- Envoi d’alertes temps réel via :
  - WebSocket
  - Bots Telegram / Discord (facultatif)

---

## 📊 Objectif pédagogique

Ce projet s'inscrit dans un PFE (Projet de Fin d'Études) de spécialité **Big Data** :
- Orchestration temps réel.
- Traitement distribué.
- Visualisation et monitoring.
- Architecture modulaire extensible.

---

## 📁 Arborescence simplifiée

```bash
📦project-root
 ┣ 📂simulator          # Simulateur de logs WAF
 ┣ 📂spark-job          # Traitement en PySpark
 ┣ 📂api                # Backend FastAPI
 ┣ 📂frontend           # React dashboard
 ┣ 📂postgres           # Scripts SQL d'initialisation
 ┣ 📂docker             # Dockerfiles / compose
 ┣ docker-compose.yml
 ┗ README.md
