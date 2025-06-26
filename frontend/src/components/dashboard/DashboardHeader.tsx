
import { Shield, Search, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
          <Shield className="h-8 w-8 text-red-600" />
          WAF Security Dashboard
        </h1>
        <p className="text-gray-600 mt-1">Real-time web application firewall and security analytics</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            WAF Active
          </Badge>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            2 Alerts
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search logs, IPs..." 
            className="pl-10 bg-white/50 border-gray-200/50 focus:border-red-300"
          />
        </div>
        
        <Button variant="outline" size="icon" className="relative">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <Button variant="outline" size="icon">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
