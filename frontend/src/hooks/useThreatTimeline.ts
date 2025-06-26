import { useEffect, useState } from "react";
import axios from "axios";

export default function useThreatTimeline() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
  const fetchData = () => {
    axios.get("http://localhost:8000/api/threat-timeline")
      .then(res => {
        const mapped = res.data.map((item: any) => ({
          time: new Date(item.window_start).toLocaleTimeString(), 
          blocked: item.blocked,
          allowed: item.allowed
        }));
        setData(mapped);
      })
      .catch(() => setError("Failed to fetch threat timeline"))
      .finally(() => setLoading(false));
  };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
