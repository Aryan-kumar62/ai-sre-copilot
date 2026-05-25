"use client";

import { AlertTriangle, Bell, Clock, ShieldAlert, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const initialAlerts = [
  {
    id: 1,
    title: "High CPU Usage detected on Worker-1",
    service: "Payment API",
    priority: "Critical",
    time: "2 mins ago",
    status: "Active",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    id: 2,
    title: "Database connection pool at 90%",
    service: "Inventory DB",
    priority: "High",
    time: "15 mins ago",
    status: "Active",
    icon: AlertTriangle,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    id: 3,
    title: "Increased API latency in eu-west-1",
    service: "Auth Service",
    priority: "Medium",
    time: "1 hour ago",
    status: "Acknowledged",
    icon: AlertCircle,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    id: 4,
    title: "Routine backup completed successfully",
    service: "Database Cluster",
    priority: "Low",
    time: "4 hours ago",
    status: "Resolved",
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);

  // Simulate realtime addition of alerts every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = alerts.length + 1;
      const priorities = ["Critical", "High", "Medium", "Low"];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const mock = {
        id: newId,
        title: `New ${randomPriority} alert generated`,
        service: "Synthetic Service",
        priority: randomPriority,
        time: "just now",
        status: "Active",
        icon: ShieldAlert,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
      };
      setAlerts((prev) => [mock, ...prev].slice(0, 12)); // keep last 12 alerts
    }, 12000);
    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Alerts</h1>
          <p className="text-muted-foreground">Real‑time monitoring of automated infrastructure alerts.</p>
        </div>
        <Button className="gap-2" onClick={() => setAlerts(initialAlerts)}>
          <CheckCircle2 className="h-4 w-4" /> Reset Demo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Critical", count: alerts.filter((a) => a.priority === "Critical").length, color: "text-red-500" },
          { label: "High", count: alerts.filter((a) => a.priority === "High").length, color: "text-orange-500" },
          { label: "Medium", count: alerts.filter((a) => a.priority === "Medium").length, color: "text-yellow-500" },
          { label: "Low", count: alerts.filter((a) => a.priority === "Low").length, color: "text-blue-500" },
        ].map((card) => (
          <Card key={card.label} className="bg-card/30 backdrop-blur-xl border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${card.color}`}>{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white/90">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert List */}
      <motion.div
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {alerts.map((alert) => (
          <motion.div key={alert.id} variants={item}>
            <Card className={`border-l-4 ${alert.border} bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors rounded-xl shadow-lg`}> 
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 rounded-full ${alert.bg} p-2`}> 
                    <alert.icon className={`h-5 w-5 ${alert.color}`} /> 
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold leading-none text-foreground">{alert.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                      <span className="font-medium text-foreground">{alert.service}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <Badge variant={alert.priority === "Critical" ? "destructive" : "outline"} className="capitalize bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    {alert.priority}
                  </Badge>
                  {alert.status === "Active" ? (
                    <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">Acknowledge</Button>
                  ) : (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {alert.status}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
