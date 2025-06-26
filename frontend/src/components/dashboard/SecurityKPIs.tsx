
import { Shield, AlertTriangle, Activity, Globe, Ban, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import  useSecurityKpis  from "@/hooks/useSecurityKpis";

const iconMap = {
  Ban,
  Shield,
  Globe,
  AlertTriangle,
  Activity,
  Eye
};


export function SecurityKPIs() {
  const { kpis: securityKpis, loading, error } =useSecurityKpis();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {securityKpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}  
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">{kpi.title}</p>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              
              <div className={`p-2 rounded-lg bg-gradient-to-r ${kpi.color} shadow-lg`}>
                <kpi.icon className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
