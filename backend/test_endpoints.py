import requests

BASE_URL = "http://localhost:8000"  # Change si ton API est déployée ailleurs

def test_security_kpis():
    response = requests.get(f"{BASE_URL}/api/security-kpis")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "requests_blocked" in item and isinstance(item["requests_blocked"], int)
        assert "security_events" in item and isinstance(item["security_events"], int)
        assert "total_attacks" in item and isinstance(item["total_attacks"], int)
        assert "unique_ips" in item and isinstance(item["unique_ips"], int)
        assert "bot_traffic_percent" in item and isinstance(item["bot_traffic_percent"], float)
        assert "threat_score" in item and isinstance(item["threat_score"], str)

def test_recent_threats():
    response = requests.get(f"{BASE_URL}/api/recent-threats")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "ip" in item and isinstance(item["ip"], str)
        assert "attack_type" in item and isinstance(item["attack_type"], str)
        assert "severity" in item and isinstance(item["severity"], str)
        assert "country" in item and isinstance(item["country"], str)

def test_waf_rules():
    response = requests.get(f"{BASE_URL}/api/waf-rules")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "rule_id" in item and isinstance(item["rule_id"], str)
        assert "attack_type" in item and isinstance(item["attack_type"], str)
        assert "severity" in item and isinstance(item["severity"], str)
        assert "trigger_count" in item and isinstance(item["trigger_count"], int)
        assert "last_triggered" in item
        assert "status" in item and isinstance(item["status"], str)

def test_threat_timeline():
    response = requests.get(f"{BASE_URL}/api/threat-timeline")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "blocked" in item and isinstance(item["blocked"], int)
        assert "allowed" in item and isinstance(item["allowed"], int)

def test_attack_types():
    response = requests.get(f"{BASE_URL}/api/attack-types")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "attack_type" in item and isinstance(item["attack_type"], str)
        assert "attack_count" in item and isinstance(item["attack_count"], int)

def test_geo_threats():
    response = requests.get(f"{BASE_URL}/api/geo-threats")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "country" in item and isinstance(item["country"], str)
        assert "total_requests" in item and isinstance(item["total_requests"], int)
        assert "threats" in item and isinstance(item["threats"], int)

def test_avg_response_time():
    response = requests.get(f"{BASE_URL}/api/avg-response-time")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and len(data) >= 1
    for item in data:
        assert "avg_response_ms" in item and isinstance(item["avg_response_ms"], float)
