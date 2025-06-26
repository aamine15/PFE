import { useEffect, useState } from "react";
import axios from "axios";

export interface WafRule {
  name: string;
  description: string;
  status: string;
  trigger_count: number;
  last_triggered: string;
}

export function useWafRules() {
  const [data, setData] = useState<WafRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/waf-rules") 
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to fetch WAF rules"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
