import { useEffect, useState } from "react";
import axios from "axios";

export interface AttackTypeData {
  attack_type: string;
  attack_count: number;
}

export function useAttackTypes() {
  const [data, setData] = useState<AttackTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/attack-types")
      .then(res => setData(res.data))
      .catch(err => setError("Failed to fetch attack types"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
