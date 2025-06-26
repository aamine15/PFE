
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SecurityKPIs } from "@/components/dashboard/SecurityKPIs";
import { SecurityChartsGrid } from "@/components/dashboard/SecurityChartsGrid";
import { ThreatActivity } from "@/components/dashboard/ThreatActivity";
import { WAFRules } from "@/components/dashboard/WAFRules";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto p-6 space-y-6">
        <DashboardHeader />
        <SecurityKPIs />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityChartsGrid />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ThreatActivity />
            <WAFRules />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
