
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Ban, Eye } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import useRecentThreats from "@/hooks/useRecentThreats";




export function ThreatActivity() {

  const { data: threats, loading, error } = useRecentThreats();


  const getSeverityColor = (severity: string) => {
     switch (severity.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800 border-red-300';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'low': return 'bg-green-100 text-green-800 border-green-300';
       default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
  };

  const getStatusIcon = (status: string) => {
  switch (status) {
    case 'blocked': return <Ban className="h-4 w-4 text-red-500" />;
    case 'monitored': return <Eye className="h-4 w-4 text-yellow-500" />;
    default: return <Shield className="h-4 w-4 text-gray-500" />;
  }
};
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Threats
          </span>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {threats.map((threat,index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors border-l-4 border-red-400">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(threat.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {threat.ip}
                </p>
                <Badge variant="outline" className={`text-xs ${getSeverityColor(threat.severity)}`}>
                  {threat.severity}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 font-semibold">
                {threat.attack_type}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(threat.timestamp))}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{threat.country}</span>
                  <Badge variant="secondary" className={`text-xs ${threat.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {threat.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-red-600 hover:text-red-800 font-medium">
            View all security events
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
