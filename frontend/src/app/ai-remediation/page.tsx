"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw, Zap, Scale, Trash2 } from "lucide-react";

export default function RemediationPanel() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const simulateAction = async (action: string) => {
    setLoadingAction(action);
    // Simulate a network request
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(`${action} completed successfully`);
    setLoadingAction(null);
  };

  const actions = [
    {
      label: "Restart Service",
      icon: RefreshCw,
      handler: () => simulateAction("Service restarted"),
    },
    {
      label: "Clear Cache",
      icon: Trash2,
      handler: () => simulateAction("Cache cleared"),
    },
    {
      label: "Scale Server",
      icon: Scale,
      handler: () => simulateAction("Server scaled"),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">AI‑driven Remediation</h1>
        <p className="text-muted-foreground">
          Based on the latest AI analysis, you can execute automated remediation actions.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        {actions.map((act) => (
          <motion.div key={act.label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <Card className="bg-card/30 backdrop-blur-xl border border-white/10 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <act.icon className="h-5 w-5 text-primary" /> {act.label}
                </CardTitle>
                <CardDescription>
                  Perform a quick remediation step suggested by the AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Badge variant="secondary" className="text-xs uppercase">
                  Action
                </Badge>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={act.handler}
                  disabled={!!loadingAction}
                  className="gap-2"
                >
                  {loadingAction ? (
                    <Zap className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {loadingAction ? "Processing…" : act.label}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
