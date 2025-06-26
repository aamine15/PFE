import { useEffect, useState } from "react";
import axios from "axios";

export interface AvgResponseItem {
  window_start: string;
  avg_response_ms: number;
}

export default function useAverageResponse() {
  const [data, setData] = useState<AvgResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<AvgResponseItem[]>("http://localhost:8000/api/avg-response-time");
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch Avg Responses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
