import { useEffect, useState } from "react";
import axios from "axios";

export interface ThreatTimelineEntry {
  window_start: string;
  blocked: number;
  allowed: number;
}
export function  useThreatTimeline()  {
  const [data, setData] = useState<ThreatTimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/avg-response-time")
      .then(res => setData(res.data))
      .catch(err => setError("Failed to fetch threats"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}


