import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ToggleLeft, Settings } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import useWafRules  from "@/hooks/useWafRules"

/*
const wafRules = [
  {
    id: 1,
    name: "SQL Injection Protection",
    description: "Blocks common SQL injection patterns",
    status: "active",
    triggered: 156,
    lastTriggered: "2 min ago"
  },
  {
    id: 2,
    name: "XSS Prevention",
    description: "Prevents cross-site scripting attacks",
    status: "active",
    triggered: 89,
    lastTriggered: "5 min ago"
  },
  {
    id: 3,
    name: "Rate Limiting",
    description: "Limits requests per IP address",
    status: "active",
    triggered: 234,
    lastTriggered: "1 min ago"
  },
  {
    id: 4,
    name: "Bot Detection",
    description: "Identifies and blocks malicious bots",
    status: "monitoring",
    triggered: 45,
    lastTriggered: "8 min ago"
  },
  {
    id: 5,
    name: "Geo Blocking",
    description: "Blocks traffic from specific countries",
    status: "inactive",
    triggered: 0,
    lastTriggered: "Never"
  }
];
*/
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 border-green-300';
    case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export function WAFRules() {
  const { data: wafRules, loading, error } = useWafRules();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            WAF Rules
          </span>
          <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {wafRules.map((rule,index) => (
          <div key={index} className="p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">{rule.rule_name}</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${getStatusColor(rule.status)}`}>
                  {rule.status}
                </Badge>
                <ToggleLeft className="h-3 w-3 text-gray-400" />
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{rule.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Triggered: <span className="font-semibold text-gray-700">{rule.trigger_count}</span>
              </span>
              <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(rule.last_triggered))}</span>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
            Manage WAF Rules
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
