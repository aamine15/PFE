import { useEffect, useState } from "react";
import axios from "axios";

export default function useWafRules() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:8000/api/waf-rules")
        .then(res => setData(res.data))
        .catch(() => setError("Failed to fetch WAF rules"))
        .finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
