"use client";

import { useState } from "react";
import { Search, Filter, Play, Square, Copy, Terminal, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockLogs = [
  { id: 1, time: "2026-05-24 10:15:00", level: "INFO", service: "payment-api", message: "Starting transaction processing..." },
  { id: 2, time: "2026-05-24 10:15:02", level: "DEBUG", service: "auth-service", message: "User authenticated successfully: user_1042" },
  { id: 3, time: "2026-05-24 10:15:10", level: "WARN", service: "inventory-db", message: "Query taking longer than expected (450ms)" },
  { id: 4, time: "2026-05-24 10:15:15", level: "ERROR", service: "redis-cache", message: "Connection timeout to Redis at 10.0.0.5:6379" },
  { id: 5, time: "2026-05-24 10:15:16", level: "ERROR", service: "redis-cache", message: "Failed to set key 'user_session_1042'" },
  { id: 6, time: "2026-05-24 10:15:20", level: "INFO", service: "frontend-web", message: "Served page /dashboard to 192.168.1.5" },
  { id: 7, time: "2026-05-24 10:15:25", level: "FATAL", service: "payment-api", message: "CPU usage spiked to 98%, dropping requests." },
];

export default function LogsPage() {
  const router = useRouter();
  const [isLive, setIsLive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message);
    toast.success("Log copied to clipboard");
  };

  const handleAnalyze = (message: string) => {
    localStorage.setItem("analyze_log", message);
    router.push("/analytics");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INFO": return "text-blue-400";
      case "DEBUG": return "text-gray-400";
      case "WARN": return "text-yellow-400";
      case "ERROR": return "text-orange-500 font-bold";
      case "FATAL": return "text-red-500 font-bold animate-pulse";
      default: return "text-gray-300";
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Logs</h1>
          <p className="text-muted-foreground">Real-time system and application logs.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isLive ? "destructive" : "secondary"} 
            className="gap-2"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLive ? "Stop Tailing" : "Resume"}
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-none shadow-lg overflow-hidden">
        <CardHeader className="border-b p-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8 bg-background/50 border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative bg-[#0a0a0a] font-mono text-sm overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto p-4 space-y-1">
            {mockLogs
              .filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.service.includes(searchTerm.toLowerCase()))
              .map((log) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id} 
                className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 hover:bg-white/5 p-1.5 rounded transition-colors"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-gray-500 text-xs w-[140px] shrink-0">{log.time}</span>
                  <span className={`w-14 shrink-0 ${getLevelColor(log.level)}`}>{log.level}</span>
                  <span className="text-purple-400 w-28 shrink-0 truncate">[{log.service}]</span>
                </div>
                <div className="flex-1 text-gray-300 break-all sm:break-normal">
                  {log.message}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0 self-start sm:self-center">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => handleCopy(log.message)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:text-primary hover:bg-primary/20" onClick={() => handleAnalyze(log.message)}>
                    <Zap className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {isLive && (
              <div className="flex items-center gap-2 text-gray-500 pt-4">
                <Terminal className="h-4 w-4 animate-pulse" />
                <span>Waiting for new logs...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
