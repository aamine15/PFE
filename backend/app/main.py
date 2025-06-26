from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .database import fetch_query
from .models import *

app = FastAPI(title="WAF Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chaque endpoint est désormais ultra propre et typé:

@app.get("/api/security-kpis", response_model=List[KPI])
async def get_security_kpis():
    query = """
        SELECT window_start, window_end, requests_blocked, security_events,
               total_attacks, unique_ips, bot_traffic_percent, threat_score
        FROM waf_kpis
        ORDER BY window_start DESC
        LIMIT 1
    """
    return fetch_query(query)

@app.get("/api/recent-threats", response_model=List[RecentThreat])
async def get_recent_threats():
    query = """
        SELECT timestamp, ip, attack_type, severity,country,
                    CASE
                       WHEN random() < 0.9 THEN 'blocked'
                       ELSE 'monitored'
                    END AS status
        FROM recent_threats
        ORDER BY timestamp DESC
        LIMIT 5
    """
    return fetch_query(query)

@app.get("/api/waf-rules", response_model=List[WAFRule])
async def get_waf_rules():
    query = """
        SELECT 
          wr.rule_id,
          meta.rule_name,
          meta.description,
          wr.trigger_count,
          wr.last_triggered,
          wr.status
        FROM waf_rules wr
        LEFT JOIN waf_rule_metadata meta ON wr.rule_id = meta.rule_id
        WHERE wr.window_start >= NOW() - INTERVAL '10 minutes'
        ORDER BY wr.trigger_count DESC
        LIMIT 5;
    """
  
    return fetch_query(query)

@app.get("/api/threat-timeline", response_model=List[ThreatTimeline])
async def get_threat_timeline():
    query = """
        SELECT window_start,window_end, blocked, allowed
        FROM threat_timeline
        WHERE window_start >= NOW() - INTERVAL '10 minutes'
        ORDER BY window_start ASC
        LIMIT 10
    """
    return fetch_query(query)

@app.get("/api/attack-types", response_model=List[AttackTypeStat])
async def get_attack_types():
    query = """
        SELECT 
          attack_type,
          SUM(attack_count) AS total_count,
          MAX(window_start) AS last_seen
          FROM attack_types
          WHERE window_start >= NOW() - INTERVAL '10 minutes'
        GROUP BY attack_type
        ORDER BY total_count DESC
    """
    return fetch_query(query)

@app.get("/api/geo-threats", response_model=List[GeoThreatStat])
async def get_geo_threats():
    query = """
        SELECT window_start, window_end, country, total_requests, threats,
                   (total_requests- threats) as requests
        FROM geo_threats
        ORDER BY window_start DESC,total_requests DESC
        LIMIT 10
    """
    return fetch_query(query)



@app.get("/api/avg-response-time", response_model=List[AvgResponseTime])
async def get_avg_response_time():
    query = """
        SELECT window_start,window_end, avg_response_ms
        FROM avg_response_time
        WHERE window_start >= NOW() - INTERVAL '10 minutes'
        ORDER BY window_start ASC
        LIMIT 10
    """
    return fetch_query(query)