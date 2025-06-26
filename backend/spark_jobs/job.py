from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, TimestampType, DoubleType, ArrayType
import random
import datetime
import shutil
import os
import time


# Fonction de lancement de stream robuste
def start_stream_with_retry(query_fn, checkpoint_path, max_retries=1):
    retries = 0
    while retries <= max_retries:
        try:
            print(f"\n🚀 Lancement stream : {checkpoint_path}")
            return query_fn().start()
        except Exception as e:
            if "CANNOT_LOAD_STATE_STORE" in str(e) or "delta" in str(e):
                print("⚠️ Problème de checkpoint. Suppression et relance...")
                if os.path.exists(checkpoint_path):
                    shutil.rmtree(checkpoint_path)
                retries += 1
                time.sleep(2)
            else:
                raise
    raise RuntimeError("❌ Trop d'échecs au démarrage du stream.")

# SETUP SPARK SESSION
spark = SparkSession.builder \
    .appName("WAFWindowAggregation") \
    .config("spark.driver.extraJavaOptions", "-Dlog4j.configuration=file:/opt/spark/conf/log4j.properties") \
    .getOrCreate()
    


ti = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

# SCHEMA JSON MODSECURITY

schema = StructType([
    StructField("transaction", StructType([
        StructField("client_ip", StringType()),
        StructField("timestamp", StringType()),
        StructField("request", StructType([
            StructField("method", StringType()),
            StructField("uri", StringType()),
            StructField("http_version", DoubleType()),
            StructField("headers", StructType([
                StructField("Host", StringType()),
                StructField("User-Agent", StringType()),
                StructField("Accept", StringType())
            ]))
        ])),
        StructField("response", StructType([
            StructField("status", IntegerType())
        ])),
        StructField("messages", ArrayType(StructType([
            StructField("message", StringType()),
            StructField("details", StructType([
                StructField("ruleId", StringType()),
                StructField("severity", StringType())
            ]))
        ])))
    ]))
])


# KAFKA
raw_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "waf-logs") \
    .option("startingOffsets", "latest") \
    .load()

parsed_df = raw_df.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col("value"), schema).alias("data"))

# FLATTEN DES CHAMPS

flattened = parsed_df.select(
    col("data.transaction.client_ip").alias("client_ip"),
    col("data.transaction.timestamp").cast("timestamp").alias("timestamp"),
    col("data.transaction.response.status").alias("status_code"),
    expr("try_element_at(data.transaction.messages, 1).message").alias("attack_type"),
    expr("try_element_at(data.transaction.messages, 1).details.severity").alias("severity"),
    expr("try_element_at(data.transaction.messages, 1).details.ruleId").alias("rule_id"),
    col("data.transaction.request.headers.User-Agent").alias("user_agent")
)



# DETECTION BOT & SIMULATION COUNTRY / LATENCY


bot_patterns = ["bot", "crawler", "spider", "scrapy", "httpclient", "wget", "curl"]

flattened = flattened.withColumn(
    "is_bot",
    when(lower(col("user_agent")).rlike("|".join(bot_patterns)), 1).otherwise(0)
)


# Simuler géolocalisation aléatoire
@udf(StringType())
def ip_to_country(ip):
    countries = ["USA", "France", "Germany", "China", "Russia", "Brazil", "India", "Canada", "UK", "Australia"]
    return random.choice(countries)

flattened = flattened.withColumn("country", ip_to_country(col("client_ip")))

# Simuler latence aléatoire
@udf(IntegerType())
def generate_latency():
    return random.randint(50, 300)

flattened = flattened.withColumn("response_time", generate_latency())

# AGGREGATION KPIs PRINCIPAUX

agg_kpis = flattened \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(window(col("timestamp"), "1 minute")) \
    .agg(
        count("*").alias("total_attacks"),
        count("attack_type").alias("security_events"),
        approx_count_distinct("client_ip").alias("unique_ips"),
        count(when(col("status_code") == 403, 1)).alias("requests_blocked"),
        count(when(col("is_bot") == 1, 1)).alias("bot_requests")
    ).select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("requests_blocked"),
        col("security_events"),
        col("total_attacks"),
        col("unique_ips"),
        round(col("bot_requests") * 100.0 / col("total_attacks"), 2).alias("bot_traffic_percent"),
        expr("CASE WHEN total_attacks > 500 THEN 'High' WHEN total_attacks > 100 THEN 'Medium' ELSE 'Low' END").alias("threat_score")
    )



# RECENT THREATS


recent_threats = flattened\
    .filter(col("attack_type").isNotNull() & col("severity").isNotNull()) \
    .select(
      col("timestamp"),
      col("client_ip").alias("ip"),
      col("attack_type"),
      col("severity"),
      col("country")
    )

# WAF RULES


filtered_rules = flattened \
    .filter(
        col("rule_id").isNotNull() &
        col("attack_type").isNotNull() &
        col("severity").isNotNull()
    ) \
    .select(
        col("timestamp"),
        col("rule_id"),
        col("attack_type"),
        col("severity")
    )

waf_rules_windowed = filtered_rules \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(
        window(col("timestamp"), "1 minutes"),
        col("rule_id"),
        col("attack_type"),
        col("severity")
    ).agg(
        count("*").alias("trigger_count"),
        max("timestamp").alias("last_triggered")
    )

waf_rules_status = waf_rules_windowed \
    .withColumn(
        "status",
        when(col("trigger_count") == 0, "inactive")
        .when(col("trigger_count") < 10, "monitoring")
        .otherwise("active")
    )


waf_rules = waf_rules_status.select(
    col("window.start").alias("window_start"),
    col("window.end").alias("window_end"),
    "rule_id",
    "attack_type",
    "severity",
    "trigger_count",
    "last_triggered",
    "status"
)


# TIMELINE DES ATTAQUES


threat_timeline = flattened \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(window(col("timestamp"), "1 minute")) \
    .agg(
        count(when(col("status_code") == 403, 1)).alias("blocked"),
        count(when(col("status_code") != 403, 1)).alias("allowed")
    ) \
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("blocked"),
        col("allowed")
    )


# ATTACK TYPES DISTRIBUTION


attack_types = flattened \
    .filter(col("attack_type").isNotNull()) \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(
        window(col("timestamp"), "1 minutes"),
        col("attack_type")
    ) \
    .agg(count("*").alias("attack_count")) \
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("attack_type"),
        col("attack_count")
    )


# GEOGRAPHIC THREATS

flattened = flattened.withColumn("is_threat", when(col("attack_type").isNotNull(), 1).otherwise(0))

geo_stats = flattened \
    .filter(col("country").isNotNull()) \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(
        window(col("timestamp"), "1 minutes"),
        col("country")
    ) \
    .agg(
        count("*").alias("total_requests"),
        count(when(col("is_threat") == 1, True)).alias("threats")
    ) \
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("country"),
        col("total_requests"),
        col("threats")
    )


# AVERAGE RESPONSE TIME


avg_response = flattened \
    .withWatermark("timestamp", "1 minutes") \
    .groupBy(window(col("timestamp"), "1 minute")) \
    .agg(avg("response_time").alias("avg_response_ms")) \
    .select(
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("avg_response_ms")
    )




# PostgreSQL writing function
def write_to_pg(df, table_name):
    try:
        row_count = df.count()
        print(f"➡️    {row_count} lignes à écrire vers {table_name}")
        if row_count == 0:
            return
        df.write \
            .format("jdbc") \
            .option("url", "jdbc:postgresql://db:5432/waf") \
            .option("dbtable", table_name) \
            .option("user", "user") \
            .option("password", "password") \
            .option("driver", "org.postgresql.Driver") \
            .mode("append") \
            .save()
        print(f"✅ Données insérées dans {table_name}")
    except Exception as e:
        print(f"🔥 ERREUR lors de l’écriture vers PostgreSQL ({table_name}) :", e)
       

# STREAMS CONFIGURATION (avec retry)

streams1 = [
    ("waf_kpis", agg_kpis, "update"),
    ("recent_threats", recent_threats, "append"),
    ("waf_rules", waf_rules, "append"),
    ("threat_timeline", threat_timeline, "append"),
    ("attack_types", attack_types, "complete"),
    ("geo_threats", geo_stats, "complete"),
    ("avg_response_time", avg_response, "append")
]

# KPIs principaux
agg_kpis.writeStream \
    .outputMode("update") \
    .queryName("WAF_KPIs") \
    .foreachBatch(lambda df, id: write_to_pg(df, "waf_kpis")) \
    .option("checkpointLocation", f"/tmp/checkpoints/waf_kpis_12547896611") \
    .start()

# Recent threats
recent_threats.writeStream \
    .outputMode("append") \
    .queryName("RecentThreats") \
    .foreachBatch(lambda df, id: write_to_pg(df, "recent_threats")) \
    .option("checkpointLocation", f"/tmp/checkpoints/recent_threats_123125541156") \
    .start()

# WAF Rules
waf_rules.writeStream \
    .outputMode("append") \
    .queryName("WAFRules") \
    .foreachBatch(lambda df, id: write_to_pg(df, "waf_rules")) \
    .option("checkpointLocation", f"/tmp/checkpoints/waf_rules_1231455545611") \
    .start()

# Threat Timeline
threat_timeline.writeStream \
    .outputMode("append") \
    .queryName("ThreatTimeline") \
    .foreachBatch(lambda df, id: write_to_pg(df, "threat_timeline")) \
    .option("checkpointLocation", f"/tmp/checkpoints/threat_timeline_12345145556145") \
    .start()


# Attack Types
attack_types.writeStream \
    .outputMode("complete") \
    .queryName("AttackTypes") \
    .foreachBatch(lambda df, id: write_to_pg(df, "attack_types")) \
    .option("checkpointLocation", f"/tmp/checkpoints/attack_types_123456111112551235") \
    .start()

# Geo Threats
geo_stats.writeStream \
    .outputMode("complete") \
    .queryName("GeoThreats") \
    .foreachBatch(lambda df, id: write_to_pg(df, "geo_threats")) \
    .option("checkpointLocation", f"/tmp/checkpoints/geo_threats_1234561221258") \
    .start()

# Average Response Time
avg_response.writeStream \
    .outputMode("append") \
    .queryName("AvgResponseTime") \
    .foreachBatch(lambda df, id: write_to_pg(df, "avg_response_time")) \
    .option("checkpointLocation", f"/tmp/checkpoints/avg_response_time_123461589998811") \
    .start()

"""

for name, df, mode in streams:
    cp_path = f"/tmp/checkpoints/{name}_{ti}"
    def query_fn(df=df, mode=mode, name=name, cp_path=cp_path):
        return df.writeStream \
            .outputMode(mode) \
            .queryName(name) \
            .foreachBatch(lambda df, id: write_to_pg(df, name)) \
            .option("checkpointLocation", cp_path)

"""




# WAIT
spark.streams.awaitAnyTermination()
