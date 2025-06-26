import useGeographicThreats  from "@/hooks/useGeographicThreats";
import useAttackTypes  from "@/hooks/useAttackTypes";
import useAverageResponse from "@/hooks/useAverageResponse";
import useThreatTimeline from "@/hooks/useThreatTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
/*
const threatData = [
  { time: '00:00', blocked: 45, allowed: 320 },
  { time: '04:00', blocked: 23, allowed: 180 },
  { time: '08:00', blocked: 89, allowed: 450 },
  { time: '12:00', blocked: 156, allowed: 380 },
  { time: '16:00', blocked: 203, allowed: 520 },
  { time: '20:00', blocked: 98, allowed: 280 },
];
*/
/*
const attackTypes = [
  { name: 'SQL Injection', value: 35, color: '#EF4444' },
  { name: 'XSS', value: 28, color: '#F97316' },
  { name: 'CSRF', value: 18, color: '#EAB308' },
  { name: 'Bot Traffic', value: 12, color: '#8B5CF6' },
  { name: 'Other', value: 7, color: '#6B7280' },
];
*/
/*
const geoData = [
  { country: 'USA', requests: 45000, threats: 1200 },
  { country: 'China', requests: 32000, threats: 2800 },
  { country: 'Russia', requests: 18000, threats: 3200 },
  { country: 'Brazil', requests: 25000, threats: 800 },
  { country: 'India', requests: 28000, threats: 600 },
  { country: 'Germany', requests: 22000, threats: 400 },
];
*/
/*
const responseTimeData = [
  { time: '00:00', avgTime: 120 },
  { time: '04:00', avgTime: 95 },
  { time: '08:00', avgTime: 180 },
  { time: '12:00', avgTime: 220 },
  { time: '16:00', avgTime: 165 },
  { time: '20:00', avgTime: 140 },
];
*/
export function SecurityChartsGrid() {
  const { data: geoData,error:errorGeoThreats, loading:loadingGeoThreats} = useGeographicThreats(); 
  const { data: attackTypes,error:errorAttackTypes, loading: loadingAttackTypes } = useAttackTypes();
  const { data: avgResponseData,error:errorAvgResponses, loading: loadingAvgResponses} = useAverageResponse();
  const { data: threatData,error:errorThreatTimeline,  loading: loadingThreatTimeline } = useThreatTimeline();


  const colors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#0088FE"
];
  return (
    <div className="space-y-6">
      {/* Threat Timeline */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Threat Detection Timeline</CardTitle>
        </CardHeader>
        <CardContent> 
          {loadingThreatTimeline && <p className="text-sm text-gray-500">Loading...</p>}
          {errorThreatTimeline && <p className="text-sm text-red-500">{errorThreatTimeline}</p>}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" className="text-sm" />
              <YAxis className="text-sm" />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="blocked" stroke="#EF4444" fillOpacity={1} fill="url(#colorBlocked)" strokeWidth={2} />
              <Area type="monotone" dataKey="allowed" stroke="#10B981" fillOpacity={1} fill="url(#colorAllowed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Types Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Attack Types</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAttackTypes && <p className="text-sm text-gray-500">Loading...</p>}
            {errorAttackTypes && <p className="text-sm text-red-500">{errorAttackTypes}</p>}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attackTypes}
                  dataKey="total_count"   
                  nameKey="attack_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attackTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Threats */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Geographic Threats</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingGeoThreats && <p className="text-sm text-gray-500">Loading...</p>}
            {errorGeoThreats && <p className="text-sm text-red-500">{errorGeoThreats}</p>}
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={geoData}>
                <XAxis dataKey="country" className="text-sm" />
                <YAxis className="text-sm" />
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="threats" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Monitoring */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Average Response Time (ms)</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAvgResponses && <p className="text-sm text-gray-500">Loading...</p>}
          {errorAvgResponses && <p className="text-sm text-red-500">{errorAvgResponses}</p>}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={avgResponseData}>
              <XAxis dataKey="time" className="text-sm" />
              <YAxis className="text-sm" />
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <Tooltip />
              <Line type="monotone" dataKey="avgTime" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
