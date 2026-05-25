"use client";

import { useState, useEffect } from "react";
import { Zap, Bot, ShieldAlert, FileText, CheckCircle2, Copy, Play, Loader2, ArrowRight, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the expected schema from the backend
interface AIResponse {
  severity: string;
  root_cause: string;
  impact: string;
  solution: string;
  recommended_actions: string[];
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);

  useEffect(() => {
    // Check if we came from logs page with a log to analyze
    const logToAnalyze = localStorage.getItem("analyze_log");
    if (logToAnalyze) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLogs(logToAnalyze);
      localStorage.removeItem("analyze_log");
    }
  }, []);

  const handleAnalyze = async () => {
    if (!logs.trim()) {
      toast.error("Please enter logs to analyze");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Send the request to backend
      const res = await fetch("http://localhost:8000/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs }),
      });

      if (!res.ok) throw new Error("Failed to analyze logs");

      const data: AIResponse = await res.json();
      setResult(data);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Error connecting to AI Engine");
      console.error(error);
      
      // Fallback for hackathon UI if backend is down
      setTimeout(() => {
        setResult({
          severity: "High",
          root_cause: "Simulated Backend Failure: AI engine could not be reached.",
          impact: "Mocked impact for demonstration purposes.",
          solution: "Start the FastAPI backend server.",
          recommended_actions: ["Check uvicorn logs", "Verify port 8000 is open"]
        });
        setIsAnalyzing(false);
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "border-red-500 bg-red-500/10 text-red-500";
      case "high": return "border-orange-500 bg-orange-500/10 text-orange-500";
      case "medium": return "border-yellow-500 bg-yellow-500/10 text-yellow-500";
      case "low": return "border-blue-500 bg-blue-500/10 text-blue-500";
      default: return "border-primary bg-primary/10 text-primary";
    }
  };

  const loadSample = (type: string) => {
    if (type === "redis") setLogs("[ERROR] Redis connection timeout, retry 3 failed\n[WARN] Cache miss rate 100%");
    if (type === "cpu") setLogs("[FATAL] Worker-1 CPU usage spiked to 98%\n[ERROR] Request timeout after 30s");
    if (type === "db") setLogs("psycopg2.OperationalError: FATAL: remaining connection slots are reserved for non-replication superuser connections");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" /> AI Incident Analyzer
        </h1>
        <p className="text-muted-foreground">Paste your raw application logs, stack traces, or alerts to instantly find the root cause.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Input Logs</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => loadSample("redis")}>Redis Sample</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => loadSample("cpu")}>CPU Sample</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <textarea 
                placeholder="Paste logs here... e.g. 'Redis timeout error, CPU usage 98%, API failed'"
                className="flex-1 min-h-[300px] font-mono text-sm bg-background/50 border border-border/50 rounded-md p-3 focus-visible:ring-1 focus-visible:ring-primary/50 resize-none outline-none text-foreground placeholder:text-muted-foreground"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
              />
              <Button 
                size="lg" 
                className="w-full font-bold gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Incident...</>
                ) : (
                  <><Zap className="h-5 w-5" /> Analyze with AI</>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg h-full min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-lg">AI Insights</CardTitle>
              <CardDescription>Intelligent root cause analysis and remediation steps.</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                      <Bot className="h-16 w-16 text-primary relative z-10 animate-bounce" />
                    </div>
                    <div className="space-y-2 text-center w-full max-w-xs">
                      <div className="h-2 w-full bg-accent rounded overflow-hidden">
                        <div className="h-full bg-primary w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
                      </div>
                      <p className="text-sm text-muted-foreground animate-pulse">Running neural diagnostics...</p>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Detected Severity</p>
                        <Badge variant="outline" className={`text-base px-3 py-1 ${getSeverityColor(result.severity)}`}>
                          {result.severity}
                        </Badge>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
                        <p className="text-xl font-bold text-emerald-400">98.5%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                        <h3 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
                          <ShieldAlert className="h-4 w-4" /> Root Cause
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{result.root_cause}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                        <h3 className="font-semibold text-orange-400 flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4" /> System Impact
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{result.impact}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <h3 className="font-semibold text-emerald-400 flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4" /> Recommended Solution
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{result.solution}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                        <h3 className="font-semibold flex items-center gap-2 mb-3">
                          <ArrowRight className="h-4 w-4 text-primary" /> Action Plan
                        </h3>
                        <ul className="space-y-2">
                          {result.recommended_actions?.map((action, i) => (
                            <li key={i} className="flex gap-2 items-start text-sm text-gray-300">
                              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-[10px] shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-center space-y-4 text-muted-foreground"
                  >
                    <FileText className="h-12 w-12 opacity-20" />
                    <p>Enter logs and click Analyze to generate insights.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
