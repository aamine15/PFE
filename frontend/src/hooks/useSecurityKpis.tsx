import { useEffect, useState } from "react";
import { LucideIcon ,Shield, Globe, AlertTriangle,Ban,Activity,Eye} from "lucide-react";
import axios from "axios";

type KPI = {
  title: string;
  value: string | number;
  change: string | number;
  icon: LucideIcon;
  color: string;
  isPositive: boolean;
};
export default function useSecurityKpis() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = () => {
  axios.get("http://localhost:8000/api/security-kpis")
    .then((res) => {

       const data = res.data[0]; 

        const Kpis: KPI[] = [
          {
            title: "Requests Blocked",
            value: data.requests_blocked,
            change: "+15.3%",
            icon: Ban, 
            color: "from-red-400 to-red-600",
            isPositive: true
          },
          {
            title: "Threat Score",
            value: data.threat_score,
            change: "-5.2%",
            icon: Shield,
            color: "from-orange-400 to-orange-600",
            isPositive: data.threat_score !== "High"
          },
          {
            title: "Total Requests",
            value: data.total_attacks,
            change: "+23.1%",
            icon: Globe,
            color: "from-blue-400 to-blue-600",
            isPositive: true
          },
          {
            title: "Security Events",
            value: data.security_events,
            change: "+8.7%",
            icon: AlertTriangle,
            color: "from-yellow-400 to-yellow-600",
            isPositive: false
          },
          {
            title: "Bot Traffic",
            value: `${data.bot_traffic_percent}%`,
            change: "-2.1%",
            icon: Activity,
            color: "from-purple-400 to-purple-600",
            isPositive: data.bot_traffic_percent < 50
          },
          {
            title: "Unique IPs",
            value: data.unique_ips,
            change: "+12.8%",
            icon: Eye ,
            color: "from-green-400 to-green-600",
            isPositive: true
          }
        ];
      
      setKpis(Kpis);
    
    })
    .catch(() => setError("Failed to fetch Security Kpis"))
    .finally(() => setLoading(false));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { kpis, loading, error };
}
