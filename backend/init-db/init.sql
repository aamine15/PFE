
select(now()-INTERVAL '1 minutes');


-- Table principale des KPIs (SecurityKPIs)
CREATE TABLE waf_kpis (
    window_start TIMESTAMP,
    window_end TIMESTAMP,
    requests_blocked INTEGER,
    security_events INTEGER,
    total_attacks INTEGER,
    unique_ips INTEGER,
    bot_traffic_percent DOUBLE PRECISION,
    threat_score VARCHAR(50)
);

-- Table des attaques récentes (RecentThreats)
CREATE TABLE recent_threats (
    timestamp     TIMESTAMP,
    ip            VARCHAR(50),
    attack_type   VARCHAR(100),
    severity      VARCHAR(50),
    country       VARCHAR(100)
);

-- Table des règles WAF déclenchées (WAFRules)
CREATE TABLE waf_rules (
    window_start      TIMESTAMP,
    window_end        TIMESTAMP,
    rule_id           VARCHAR(50),
    attack_type       VARCHAR(100),
    severity          VARCHAR(50),
    trigger_count     INTEGER,
    last_triggered    TIMESTAMP,
    status            VARCHAR(20)
);


-- Table Threat Detection Timeline (Threat Detection Timeline)
CREATE TABLE threat_timeline (
    window_start TIMESTAMP,
    window_end     TIMESTAMP,
    blocked INTEGER,
    allowed INTEGER
);


-- Table Attack Types (Attack Types)
CREATE TABLE attack_types (
    window_start   TIMESTAMP,
    window_end     TIMESTAMP,
    attack_type    VARCHAR(100),
    attack_count   INTEGER
);

-- Table Geographic Threats (Geographic Threats)

CREATE TABLE geo_threats (
    window_start    TIMESTAMP,
    window_end      TIMESTAMP,
    country         VARCHAR(100),
    total_requests  BIGINT,
    threats         BIGINT
);

-- Table Average Response Time (Average Response Time)
CREATE TABLE avg_response_time (
    window_start      TIMESTAMP,
    window_end        TIMESTAMP,
    avg_response_ms   FLOAT
);

CREATE TABLE waf_rule_metadata (
    rule_id TEXT PRIMARY KEY,
    rule_name TEXT NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO waf_rule_metadata (rule_id, rule_name, description) VALUES
('942100', 'SQL Injection Protection', 'Blocks common SQL injection patterns'),
('941130', 'XSS Prevention', 'Prevents cross-site scripting attacks'),
('930110', 'Path Traversal Protection', 'Blocks path traversal attempts'),
('913100', 'Rate Limiting', 'Limits excessive requests per client'),
('920100', 'CSRF Protection', 'Blocks CSRF (Cross-Site Request Forgery) attempts'),
('949110', 'Bot Detection', 'Detects and mitigates bot activity');

