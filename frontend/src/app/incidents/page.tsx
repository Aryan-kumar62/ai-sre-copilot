"use client";

import { useMemo, useState } from "react";

import {
  AlertTriangle,
  Clock,
  Search,
  BrainCircuit,
  ShieldAlert,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const incidentsData = [
  {
    id: 1,
    title: "Redis Cache Failure",
    severity: "Critical",
    status: "Investigating",
    service: "Redis Cluster",
    time: "2 mins ago",
    rootCause: "Memory exhaustion causing cache eviction storm.",
    solution: "Restart Redis node and increase memory allocation.",
  },
  {
    id: 2,
    title: "Payment API Latency Spike",
    severity: "High",
    status: "Monitoring",
    service: "Payment API",
    time: "12 mins ago",
    rootCause: "Slow DB queries from analytics workload.",
    solution: "Scale read replicas and optimize queries.",
  },
  {
    id: 3,
    title: "Auth Service CPU Usage",
    severity: "Medium",
    status: "Resolved",
    service: "Auth Service",
    time: "1 hour ago",
    rootCause: "Unexpected traffic burst.",
    solution: "Autoscaling policy triggered successfully.",
  },
];

export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  const filteredIncidents = useMemo(() => {
    return incidentsData.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.service.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || incident.severity === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Incident Center
          </h1>

          <p className="text-muted-foreground">
            AI-powered infrastructure incident management.
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Critical", "High", "Medium"].map((level) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              onClick={() => setFilter(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search incidents..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Incident Cards */}
      <div className="space-y-5">

        {filteredIncidents.map((incident) => (
          <Card
            key={incident.id}
            className="border-l-4 border-red-500/40 bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all"
          >
            <CardContent className="p-6 space-y-4">

              {/* Top */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="space-y-2">
                  <div className="flex items-center gap-3">

                    <ShieldAlert className="h-5 w-5 text-red-500" />

                    <h2 className="text-xl font-semibold">
                      {incident.title}
                    </h2>

                    <Badge variant="destructive">
                      {incident.severity}
                    </Badge>

                    <Badge variant="outline">
                      {incident.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">

                    <span>{incident.service}</span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {incident.time}
                    </span>
                  </div>
                </div>

                <Button onClick={() => setSelectedIncident(incident)}>
                  View Details
                </Button>
              </div>

              {/* AI Analysis */}
              <div className="rounded-xl border bg-background/50 p-4 space-y-3">

                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />

                  <h3 className="font-semibold">
                    AI Root Cause Analysis
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {incident.rootCause}
                  </p>
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-sm">
                    <span className="font-semibold">
                      Suggested Fix:
                    </span>{" "}
                    {incident.solution}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}

      </div>

      {selectedIncident && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl border relative">

      <div className="flex items-start justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            {selectedIncident.title}
          </h2>

          <p className="text-muted-foreground">
            AI-powered incident details and remediation
          </p>
        </div>

        <button
          onClick={() => setSelectedIncident(null)}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="destructive" className="px-3 py-1">
          {selectedIncident.severity}
        </Badge>

        <Badge variant="outline" className="px-3 py-1">
          {selectedIncident.status}
        </Badge>
      </div>

      <div className="space-y-6">

        <div>
          <h3 className="font-semibold mb-2">
            Root Cause
          </h3>

          <p className="text-muted-foreground">
            {selectedIncident.rootCause}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Suggested Fix
          </h3>

          <div className="rounded-lg bg-primary/10 p-4">
            {selectedIncident.solution}
          </div>
        </div>

      </div>

    </div>

  </div>
)}

</div>
);
}