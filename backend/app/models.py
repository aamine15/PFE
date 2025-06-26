from pydantic import BaseModel,Field
from datetime import datetime
from typing import Optional

# Pour /api/security-kpis
class KPI(BaseModel):
    #window_start: datetime
    #window_end: datetime
    requests_blocked: int
    security_events: int
    total_attacks: int
    unique_ips: int
    bot_traffic_percent: float
    threat_score: str

# Pour /api/recent-threats
class RecentThreat(BaseModel):
    timestamp: datetime
    ip: str
    attack_type: str
    severity: str
    country: Optional[str]
    status: Optional[str]

# Modèle pour la table waf_rules
class WAFRule(BaseModel):
    rule_id: str
    rule_name: str
    description: str
    trigger_count: int
    last_triggered: Optional[datetime] = None
    status: str
    

# Pour /api/threat-timeline
class ThreatTimeline(BaseModel):
    window_start: datetime
    #window_end: datetime
    blocked: int
    allowed: int

# Pour /api/attack-types
class AttackTypeStat(BaseModel):
    #window_start: datetime
    #window_end: datetime
    #last_seen:datetime
    attack_type: str
    total_count:int
    #attack_count: int

# Pour /api/geo-threats
class GeoThreatStat(BaseModel):
    #window_start: datetime
    #window_end: datetime
    country: str
    #total_requests: int
    requests:int
    threats: int

# Pour /api/avg-response-time
class AvgResponseTime(BaseModel):
     window_start: datetime
    #window_end: datetime
     avg_response_ms: float
   