"use client";

import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { Button } from "@/components/ui/button";
import { swrFetcher } from "@/lib/api/client";
import { jobsApi } from "@/lib/api/jobs";
import { resumesApi } from "@/lib/api/resumes";
import { useAuthContext } from "@/lib/auth/auth-context";
import { JOB_ROLE_OPTIONS } from "@/lib/job-roles";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

/* ── Tiny section wrapper ── */
function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Stat tile ── */
function StatTile({
  label,
  value,
  icon: Icon,
  description,
  accent,
  trend,
}: {
  label: string;
  value: number;
  icon: any;
  description: string;
  accent: string;
  trend?: string;
}) {
  return (
    <SectionCard className="relative overflow-hidden group hover:shadow-md transition-shadow duration-200">
      {/* Decorative corner glow */}
      <div
        className={`pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity ${accent}`}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-sm`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-2 py-0.5">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>

        <p className="text-3xl font-bold tracking-tight text-foreground mb-0.5">
          {value}
        </p>
        <p className="text-sm font-semibold text-foreground/80 mb-0.5">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </SectionCard>
  );
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    responseRate: 0,
    interviewCount: 0,
  });
  const [resumeStats, setResumeStats] = useState({
    total: 0,
    missingCount: JOB_ROLE_OPTIONS.length,
    missingLabels: JOB_ROLE_OPTIONS.map((o) => o.label),
  });

  const { data: upcomingTasksResponse } = useSWR("/tasks/upcoming", swrFetcher);
  const { data: recentActivityResponse } = useSWR("/users/activity", swrFetcher);

  const upcomingTasks = upcomingTasksResponse
    ? Array.isArray(upcomingTasksResponse)
      ? upcomingTasksResponse
      : upcomingTasksResponse.data
    : [];

  const recentActivities = recentActivityResponse
    ? Array.isArray(recentActivityResponse)
      ? recentActivityResponse
      : recentActivityResponse.data
    : [];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await jobsApi.getStats();
        if (data) setStats(data);
      } catch {}
    };

    const fetchResumes = async () => {
      try {
        const resumes = (await resumesApi.getAll()) || [];
        const have = new Set(resumes.map((r) => r.jobRole));
        const missing = JOB_ROLE_OPTIONS.filter((o) => !have.has(o.value));
        setResumeStats({
          total: resumes.length,
          missingCount: missing.length,
          missingLabels: missing.map((m) => m.label),
        });
      } catch {}
    };

    fetchStats();
    fetchResumes();
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  /* Progress bar for applied/total */
  const appliedPct =
    stats.totalJobs > 0
      ? Math.round((stats.appliedJobs / stats.totalJobs) * 100)
      : 0;
  const pendingJobs = stats.totalJobs - stats.appliedJobs;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">

      {/* ── 4 stat tiles ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          description="Tracked in system"
          accent="from-violet-500 to-purple-600"
        />
        <StatTile
          label="Applied"
          value={stats.appliedJobs}
          icon={Send}
          description="Applications sent"
          accent="from-sky-500 to-blue-600"
          trend={appliedPct + "%"}
        />
        <StatTile
          label="Interviews"
          value={stats.interviewCount}
          icon={CheckCircle}
          description="Scheduled interviews"
          accent="from-emerald-500 to-teal-600"
        />
        <StatTile
          label="Pending"
          value={pendingJobs}
          icon={Clock}
          description="Yet to apply"
          accent="from-amber-500 to-orange-500"
        />
      </div>

      {/* ── Resume coverage card ── */}
      <SectionCard>
        {/* Accent top strip */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-500" />

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/40 shrink-0">
              <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Resume Coverage
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground/80">
                  {resumeStats.total}
                </span>{" "}
                resumes uploaded ·{" "}
                <span
                  className={`font-semibold ${resumeStats.missingCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {resumeStats.missingCount} roles missing
                </span>
              </p>

              {/* Resume role coverage bar */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 max-w-[200px] rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700"
                    style={{
                      width: `${Math.round((resumeStats.total / JOB_ROLE_OPTIONS.length) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {resumeStats.total}/{JOB_ROLE_OPTIONS.length} roles covered
                </span>
              </div>

              {resumeStats.missingCount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground/70 max-w-sm">
                  Missing:{" "}
                  <span className="text-muted-foreground font-medium">
                    {resumeStats.missingLabels.slice(0, 4).join(", ")}
                    {resumeStats.missingLabels.length > 4 &&
                      ` +${resumeStats.missingLabels.length - 4} more`}
                  </span>
                </p>
              )}
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="shrink-0 h-9 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-md shadow-violet-500/20 text-sm"
          >
            <Link href="/resumes">
              <Upload className="h-3.5 w-3.5" />
              Manage Resumes
            </Link>
          </Button>
        </div>
      </SectionCard>

      {/* ── Quick actions row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Browse Jobs",   icon: Briefcase, href: "/jobs",     color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 border-violet-200/50 dark:border-violet-800/40" },
          { label: "Track Tasks",   icon: Target,    href: "/tasks",    color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 border-sky-200/50 dark:border-sky-800/40" },
          { label: "Send Emails",   icon: Zap,       href: "/messages", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200/50 dark:border-emerald-800/40" },
          { label: "My Profile",    icon: TrendingUp, href: "/profile", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200/50 dark:border-amber-800/40" },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-150 group ${color}`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="text-sm font-semibold">{label}</span>
            <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* ── Activity + Tasks ── */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Activity — wider */}
        <SectionCard className="lg:col-span-4">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Recent Activity</h3>
            </div>
            <Link
              href="/jobs"
              className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            <RecentActivity activities={recentActivities} />
          </div>
        </SectionCard>

        {/* Upcoming Tasks — narrower */}
        <SectionCard className="lg:col-span-3">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Upcoming Tasks</h3>
              {upcomingTasks.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-800/40 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  {upcomingTasks.length}
                </span>
              )}
            </div>
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            <UpcomingTasks tasks={upcomingTasks} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}