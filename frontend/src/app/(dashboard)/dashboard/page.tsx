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
import { jobsApi } from "@/lib/api/jobs";
import { useAuthContext } from "@/lib/auth/auth-context";
import { Briefcase, CheckCircle, Clock, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    responseRate: 0,
    interviewCount: 0,
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

    fetchStats();
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
