"use client";

import { 
  Server, 
  Activity, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockServices = [
  {
    name: "Payment API",
    status: "Healthy",
    uptime: "99.99%",
    latency: "120ms",
    errorRate: "0.01%",
    dependencies: ["Inventory DB", "Auth Service"],
    version: "v2.4.1"
  },
  {
    name: "Auth Service",
    status: "Degraded",
    uptime: "98.50%",
    latency: "450ms",
    errorRate: "2.50%",
    dependencies: ["Redis Cache", "Inventory DB"],
    version: "v1.8.0"
  },
  {
    name: "Inventory DB",
    status: "Healthy",
    uptime: "99.999%",
    latency: "15ms",
    errorRate: "0.00%",
    dependencies: [],
    version: "Postgres 15.2"
  },
  {
    name: "Redis Cache",
    status: "Down",
    uptime: "95.00%",
    latency: "0ms",
    errorRate: "100%",
    dependencies: [],
    version: "Redis 7.0"
  },
  {
    name: "Frontend Web",
    status: "Healthy",
    uptime: "99.85%",
    latency: "200ms",
    errorRate: "0.10%",
    dependencies: ["Payment API", "Auth Service"],
    version: "v3.1.2"
  }
];

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Inventory</h1>
          <p className="text-muted-foreground">Monitor microservice health and dependencies.</p>
        </div>
        <Button className="gap-2">
          <Activity className="h-4 w-4" />
          Dependency Map
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <Card key={service.name} className="border-none bg-card/50 overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  service.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500' :
                  service.status === 'Degraded' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-destructive/10 text-destructive'
                }`}>
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{service.name}</CardTitle>
                  <p className="text-[10px] text-muted-foreground font-mono">{service.version}</p>
                </div>
              </div>
              <Badge 
                variant={
                  service.status === 'Healthy' ? 'default' : 
                  service.status === 'Degraded' ? 'secondary' : 'destructive'
                }
              >
                {service.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Latency</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {service.latency}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Error Rate</p>
                  <p className={`text-sm font-bold flex items-center gap-1 ${parseFloat(service.errorRate) > 1 ? 'text-destructive' : ''}`}>
                    <Zap className="h-3 w-3 text-muted-foreground" />
                    {service.errorRate}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Uptime</span>
                  <span className="text-foreground">{service.uptime}</span>
                </div>
                <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${
                      parseFloat(service.uptime) > 99.5 ? 'bg-emerald-500' :
                      parseFloat(service.uptime) > 98 ? 'bg-amber-500' :
                      'bg-destructive'
                    }`}
                    style={{ width: service.uptime }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dependencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {service.dependencies.length > 0 ? (
                    service.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-[10px] py-0 bg-accent/30 border-none">
                        {dep}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">No downstream dependencies</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-all">
                <Button variant="secondary" size="sm" className="flex-1 gap-2 text-[10px] h-8">
                  <BarChart3 className="h-3 w-3" />
                  Metrics
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 text-[10px] h-8">
                  <ExternalLink className="h-3 w-3" />
                  Traces
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
