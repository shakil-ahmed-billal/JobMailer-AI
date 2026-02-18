"use client";

import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobsApi } from "@/lib/api/jobs";
import { resumesApi } from "@/lib/api/resumes";
import { JOB_ROLE_OPTIONS } from "@/lib/job-roles";
import { useAuthContext } from "@/lib/auth/auth-context";
import { Briefcase, CheckCircle, Clock, Send } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    // Fetch real stats
    const fetchStats = async () => {
      try {
        const data = await jobsApi.getStats();
        if (data) setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
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
      } catch (error) {
        // Keep silent; dashboard should still load
      }
    };

    fetchStats();
    fetchResumes();
  }, []);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          description="Jobs tracked in system"
        />
        <StatsCard
          title="Applied"
          value={stats.appliedJobs}
          icon={Send}
          description="Applications sent"
        />
        <StatsCard
          title="Interviews"
          value={stats.interviewCount}
          icon={CheckCircle}
          description="Upcoming interviews"
        />
        <StatsCard
          title="Pending"
          value={stats.totalJobs - stats.appliedJobs}
          icon={Clock}
          description="Jobs to apply for"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumes</CardTitle>
            <CardDescription>
              {resumeStats.total} uploaded • {resumeStats.missingCount} roles missing
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/resumes">Quick upload</Link>
          </Button>
        </CardHeader>
        {resumeStats.missingCount > 0 && (
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              Missing: {resumeStats.missingLabels.join(", ")}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent job application activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due soon and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingTasks />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
