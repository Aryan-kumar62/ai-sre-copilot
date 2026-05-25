"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  ServerCrash,
} from "lucide-react";

import axios from "axios";
import { useEffect, useState } from "react";

export function LiveAlerts() {

  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/alerts"
      );

      const formattedAlerts = response.data.map(
        (alert: any, index: number) => {

          let icon = AlertTriangle;

          if (alert.severity === "Critical") {
            icon = ServerCrash;
          } else if (alert.severity === "High") {
            icon = Activity;
          } else if (alert.severity === "Medium") {
            icon = ShieldAlert;
          }

          return {
            id: index + 1,
            title: alert.title,
            severity: alert.severity,
            time: alert.time,
            icon,
          };
        }
      );

      setAlerts(formattedAlerts);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-3xl border bg-card/50 p-6 shadow-2xl backdrop-blur-sm">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Live Incident Stream
          </h2>

          <p className="text-sm text-muted-foreground">
            Real-time AI infrastructure monitoring
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-500">

          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>

          LIVE

        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">

        <AnimatePresence>

          {alerts.map((alert) => {

            const Icon = alert.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="group rounded-2xl border bg-background/50 p-5 transition-all hover:scale-[1.01] hover:bg-accent/30"
              >

                <div className="flex items-center justify-between">

                  {/* Left */}
                  <div className="flex items-center gap-4">

                    <div
                      className={`rounded-xl p-3 ${
                        alert.severity === "Critical"
                          ? "bg-red-500/10 text-red-500"
                          : alert.severity === "High"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >

                      <Icon className="h-5 w-5" />

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {alert.title}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {alert.time}
                      </p>

                    </div>
                  </div>

                  {/* Right */}
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      alert.severity === "Critical"
                        ? "bg-red-500/20 text-red-500"
                        : alert.severity === "High"
                        ? "bg-orange-500/20 text-orange-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >

                    {alert.severity}

                  </div>
                </div>
              </motion.div>
            );
          })}

        </AnimatePresence>

      </div>
    </div>
  );
}