"use client";

import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Bell, 
  Activity, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Zap,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: BrainCircuit, label: "AI Analysis", href: "/ai-analysis" },
  { icon: Activity, label: "AI Remediation", href: "/ai-remediation" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: AlertTriangle, label: "Incidents", href: "/incidents" },
  { icon: FileText, label: "Logs", href: "/logs" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
  { icon: ShieldCheck, label: "Services", href: "/services" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary fill-primary" />
          <span className="text-xl font-bold tracking-tight">AI SRE Copilot</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <Link href="/profile" className="flex items-center gap-3 rounded-lg bg-accent/50 px-3 py-2 hover:bg-accent transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">AD</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
