"use client";

import { User, Mail, Shield, Award, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">View your account details and SRE performance metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg text-center overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/40 to-purple-500/40"></div>
            <CardContent className="pt-0 relative">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-background bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-xl">
                  AD
                </div>
              </div>
              <h2 className="text-2xl font-bold">Admin User</h2>
              <p className="text-muted-foreground mb-4">Senior Site Reliability Engineer</p>
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" /> Admin</Badge>
                <Badge variant="outline" className="gap-1 text-emerald-400 border-emerald-400/30"><Award className="h-3 w-3" /> Level 42</Badge>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>admin@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Joined Oct 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Performance Stats</CardTitle>
              <CardDescription>Your incident response metrics over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1 p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-muted-foreground">Incidents Resolved</p>
                  <p className="text-2xl font-bold text-emerald-400">124</p>
                </div>
                <div className="space-y-1 p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-muted-foreground">Avg Time to Acknowledge</p>
                  <p className="text-2xl font-bold text-blue-400">1.2m</p>
                </div>
                <div className="space-y-1 p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-muted-foreground">Avg Time to Resolve</p>
                  <p className="text-2xl font-bold text-purple-400">14m</p>
                </div>
                <div className="space-y-1 p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-muted-foreground">AI Copilot Uses</p>
                  <p className="text-2xl font-bold text-orange-400">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Resolved Incident #1042", time: "2 hours ago", desc: "Database connection timeout fixed via failover." },
                  { title: "Acknowledged Critical Alert", time: "5 hours ago", desc: "CPU Spike on Worker-1 acknowledged." },
                  { title: "Ran AI Analysis", time: "1 day ago", desc: "Analyzed memory leak logs in auth-service." }
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded hover:bg-white/5 transition-colors">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{act.title}</p>
                      <p className="text-xs text-muted-foreground">{act.desc}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
