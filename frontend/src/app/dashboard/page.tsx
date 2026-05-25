"use client";

import { LiveAlerts } from "@/components/live-alerts";
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  Zap, 
  Server, 
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const chartData = [
  { time: "00:00", errorRate: 0.1, latency: 120 },
  { time: "04:00", errorRate: 0.2, latency: 150 },
  { time: "08:00", errorRate: 0.8, latency: 450 },
  { time: "12:00", errorRate: 0.3, latency: 180 },
  { time: "16:00", errorRate: 0.1, latency: 130 },
  { time: "20:00", errorRate: 0.1, latency: 125 },
  { time: "23:59", errorRate: 0.1, latency: 120 },
];

const serviceHealth = [
  { name: "Payment API", status: "Healthy", latency: "120ms", uptime: "99.9%" },
  { name: "Auth Service", status: "Degraded", latency: "450ms", uptime: "98.5%" },
  { name: "Inventory DB", status: "Healthy", latency: "15ms", uptime: "99.99%" },
  { name: "Redis Cache", status: "Down", latency: "0ms", uptime: "95.0%" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
  incidents: 3,
  uptime: 99.85,
  latency: 185,
  errors: 0.24,
});
useEffect(() => {
  fetchIncidents();
}, []);

const fetchIncidents = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/incidents"
    );

    setMetrics((prev) => ({
      ...prev,
      incidents: response.data.length,
    }));
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  const interval = setInterval(() => {
    setMetrics({
      incidents: Math.floor(Math.random() * 5) + 1,
      uptime: Number((99 + Math.random()).toFixed(2)),
      latency: Math.floor(Math.random() * 200) + 100,
      errors: Number((Math.random() * 1).toFixed(2)),
    });
  }, 4000);

  return () => clearInterval(interval);
}, []);
  const router = useRouter();

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Real-time infrastructure health and incident analysis.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
          Live Monitoring Active
        </div>
      </div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Incidents"
          value={metrics.incidents.toString()}
          icon={AlertCircle}
          trend={{ value: 12, isUp: true }}
          description="2 Critical, 1 High"
        />
        <MetricCard
          title="System Uptime"
          value={`${metrics.uptime}%`}
          icon={Activity}
          trend={{ value: 0.05, isUp: false }}
        />
        <MetricCard
          title="Avg. Latency"
          value={`${metrics.latency}ms`}
          icon={Clock}
          trend={{ value: 8, isUp: true }}
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errors}%`}
          icon={Zap}
          trend={{ value: 15, isUp: true }}
        />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Latency & Error Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}ms`} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="latency" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl h-full">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Service Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {serviceHealth.map((service) => (
                  <div key={service.name} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{service.name}</p>
                      <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{service.latency}</p>
                      </div>
                      <Badge 
                        variant={service.status === "Healthy" ? "default" : service.status === "Degraded" ? "secondary" : "destructive"}
                        className="w-20 justify-center shadow-sm"
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                Critical Alerts
              </CardTitle>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => router.push('/alerts')}>View All</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4 transition-all hover:bg-accent/20 hover:border-accent">
                    <div className="mt-1 rounded-full bg-destructive/10 p-2 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Database Connection Timeout</p>
                        <span className="text-xs text-muted-foreground">2 mins ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Payment Service is unable to connect to Postgres-Primary cluster.</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <CardHeader className="flex flex-row items-center justify-between relative z-10">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500 fill-purple-500" />
                Recent AI Insights
              </CardTitle>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => router.push('/analytics')}>Analytics</Badge>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4 hover:bg-purple-500/10 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30">Critical Severity</Badge>
                    <span className="text-xs text-muted-foreground">Auth Service Incident #1204</span>
                  </div>
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400" /> Expired SSL certificate on node-04
                  </p>
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    <span className="font-semibold text-white">Impact:</span> Complete authentication failure across European region.
                  </p>
                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    <span className="font-semibold text-emerald-400">Solution:</span> Rotate certificates and restart gateway instances.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-purple-500/20">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Actions:</span>
                    <Badge variant="outline" className="text-[10px] bg-background">Rotate Certs</Badge>
                    <Badge variant="outline" className="text-[10px] bg-background">Clear Cache</Badge>
                  </div>
                </div>
                
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Auto-Remediation Successful
                    </p>
                    <span className="text-[10px] text-muted-foreground">10m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI Copilot automatically scaled Redis cluster to handle traffic spike.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    <LiveAlerts />
    </motion.div>
  );
}
