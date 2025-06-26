import { useEffect, useState } from "react";
import axios from "axios";

export default function useAttackTypes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:8000/api/attack-types")
        .then(res => setData(res.data))
        .catch(() => setError("Failed to fetch attack types"))
        .finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
