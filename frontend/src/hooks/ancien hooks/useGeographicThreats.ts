import { useEffect, useState } from "react";
import axios from "axios";

export interface GeographicThreat {
  country: string;
  requests: number;
  threats: number;
}

export function useGeographicThreats() {
  const [data, setData] = useState<GeographicThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/geo-threats")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch geo threats");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
