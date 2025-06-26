import { useEffect, useState } from "react";
import axios from "axios";

export default function useRecentThreats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:8000/api/recent-threats")
        .then(res => setData(res.data))
        .catch(() => setError("Failed to fetch recent threats"))
        .finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
