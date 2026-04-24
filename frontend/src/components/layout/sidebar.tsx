"use client";

import { cn } from "@/lib/utils";
import {
  Briefcase,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Jobs",
      icon: Briefcase,
      href: "/jobs",
      active: pathname.startsWith("/jobs"),
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname.startsWith("/tasks"),
    },
    {
      label: "Messages",
      icon: Mail,
      href: "/messages",
      active: pathname.startsWith("/messages"),
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      active: pathname.startsWith("/profile"),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-border/60 w-64",
        className
      )}
    >
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
            <FileText className="h-4.5 w-4.5" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-1.5 w-1.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight leading-none text-foreground">
              JobMailer AI
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
              Application Automation
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              route.active
                ? "bg-violet-500/15 text-violet-700 dark:text-violet-400 shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
            )}
          >
            {/* Active indicator bar */}
            <div
              className={cn(
                "absolute left-0 h-5 w-0.5 rounded-r-full bg-violet-500 transition-all duration-200",
                route.active ? "opacity-100" : "opacity-0"
              )}
            />
            <route.icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors duration-200",
                route.active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>{route.label}</span>

            {/* Active dot indicator */}
            {route.active && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom gradient accent */}
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border to-transparent mb-3" />
    </div>
  );
}