import random
import json
import asyncio
from datetime import datetime
from faker import Faker
from aiokafka import AIOKafkaProducer

fake = Faker()
methods = ['GET', 'POST', 'PUT', 'DELETE']
uris = [
      '/login',
      '/admin', 
      '/search',
      '/products?id=1',
      '/comment',
      '/register',
      '/api/data',
      '/user/profile',
      '/.env',           
      '/etc/passwd',     
      '/search?q=test',
      '/products/123',
      '/logout'
       ]
user_agents = [

    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/113.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36",
    "sqlmap/1.6.12#stable (http://sqlmap.org)",  
    "curl/7.64.1",
    "Wget/1.20.3 (linux-gnu)",
    "PostmanRuntime/7.28.4",
    "Nmap NSE Script",  
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Python-urllib/3.8",
    "sqlmap/1.5.2#stable (http://sqlmap.org)",
    "curl/7.68.0",
    "python-requests/2.31.0",
    "Apache-HttpClient/4.5.2 (Java/1.8.0_181)",
    "Nikto/2.1.5 (Evasion: None) (Test: OSVDB-877) (Test: XSS)",
    "nmap/ncat 7.93"
]

messages = [
    {
        "message": "SQL Injection",
        "details": {
            "ruleId": "942100",
            "severity": "HIGH"
        }
    },
    {
        "message": "XSS Attack",
        "details": {
            "ruleId": "941130",
            "severity": "MEDIUM"
        }
    },
    {
        "message": "Bot Traffic",
        "details": {
            "ruleId": "949110",
            "severity": "LOW"
        }
    },
    {
        "message": "Brute Force",
        "details": {
            "ruleId": "913100",
            "severity": "HIGH"
        }
    },
    {
        "message": "CSRF",
        "details": {
            "ruleId": "920100",
            "severity": "MEDIUM"
        }
    },
    {
        "message": "Path traversal attempt",
        "details": {
            "ruleId": "930110",
            "severity": "MEDIUM"
        }
    }

]

"""
messages = [
    {
        "message": "SQL injection attempt",
        "details": {
            "ruleId": "942100",
            "severity": "CRITICAL"
        }
    },
    {
        "message": "Cross-site scripting (XSS)",
        "details": {
            "ruleId": "941130",
            "severity": "HIGH"
        }
    },
    {
        "message": "Path traversal attempt",
        "details": {
            "ruleId": "930110",
            "severity": "MEDIUM"
        }
    }
]
"""
async def send_waf_logs(bootstrap_servers="kafka:9092", topic="waf-logs"):
    producer = AIOKafkaProducer(bootstrap_servers=bootstrap_servers)
    await producer.start()
    try:
        while True:
            burst = random.random() < 0.7
            delay = random.expovariate(1/0.05) if burst else random.uniform(0.5,1)
            nb_logs = random.randint(5, 10) if burst else 3

            for _ in range(nb_logs):
                selected_message = random.choice(messages) if random.random() < 0.4 else None

                log = {
                    "transaction": {
                        "client_ip": fake.ipv4(),
                        "timestamp": datetime.utcnow().isoformat() ,
                        "request": {
                            "method": random.choice(methods),
                            "uri": random.choice(uris),
                            "http_version": 1.1,
                            "headers": {
                                "Host": "example.com",
                                "User-Agent": random.choice(user_agents),
                                "Accept": "text/html"
                            }
                        },
                        "response": {
                            "status": random.choice([200, 403, 500])
                        },
                        "messages": [selected_message] if selected_message else []
                    }
                }

                await producer.send_and_wait(topic, json.dumps(log).encode('utf-8'))

            await asyncio.sleep(delay)
    finally:
        await producer.stop()
