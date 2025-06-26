import { useEffect, useState } from "react";
import axios from "axios";

export interface ThreatItem {
  ip: string;
  attack_type: string;
  severity: string;
  timestamp: string;
  country: string;
  status?: string; // optionnel si calculé côté React
}

export function useRecentThreats() {
  const [data, setData] = useState<ThreatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<ThreatItem[]>("http://localhost:8000/api/recent-threats")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch recent threats");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
