"use client";

import { ApplyModal } from "@/components/jobs/apply-modal";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobForm } from "@/components/jobs/job-form";
import { JobTable } from "@/components/jobs/job-table";
import { TaskModal } from "@/components/jobs/task-modal";
import { JobTableSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { swrFetcher } from "@/lib/api/client";
import { JobFilters as FilterType, jobsApi } from "@/lib/api/jobs";
import { Job } from "@/types";
import { Briefcase, ChevronLeft, ChevronRight, Plus, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FilterType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [jobForTask, setJobForTask] = useState<Job | undefined>(undefined);

  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.applyStatus) params.append("applyStatus", filters.applyStatus);
    if (filters.responseStatus)
      params.append("responseStatus", filters.responseStatus);
    if (filters.jobRole) params.append("jobRole", filters.jobRole);
    if (filters.search) params.append("search", filters.search);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    params.append("page", String(currentPage));
    params.append("limit", "10");
    return `/jobs?${params.toString()}`;
  }, [filters, currentPage]);

  const {
    data: rawResponse,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKey, swrFetcher, { keepPreviousData: true });

  useEffect(() => {
    if (rawResponse) {
      if (Array.isArray(rawResponse)) {
        setJobs(rawResponse);
        setTotalPages(1);
        setTotalItems(rawResponse.length);
      } else if (rawResponse && typeof rawResponse === "object") {
        setJobs(rawResponse.data || []);
        setTotalPages(rawResponse.meta?.totalPages || 1);
        setTotalItems(rawResponse.meta?.total || rawResponse.data?.length || 0);
      }
    }
  }, [rawResponse]);

  useEffect(() => {
    if (error) toast.error("Failed to load jobs");
  }, [error]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.delete(id);
        toast.success("Job deleted successfully");
        mutate();
      } catch {
        toast.error("Failed to delete job");
      }
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleAddTask = (job: Job) => {
    setJobForTask(job);
    setIsTaskModalOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingJob(undefined);
  };

  const handleStatusChange = async (jobId: string, status: string) => {
    const previousJobs = [...jobs];
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: status as any } : job
      )
    );
    try {
      await jobsApi.update(jobId, { status: status as any });
      toast.success("Status updated successfully");
    } catch {
      setJobs(previousJobs);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-3 md:p-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Icon badge */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-500/25">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Job Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and manage your job search pipeline
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingJob(undefined);
            setIsFormOpen(true);
          }}
          className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 border-0"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      

      {/* ── Filters + Table Card ── */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">

        {/* Card header bar */}
        {/* <div className="flex items-center gap-2 px-5 py-4 border-b border-border/50 bg-muted/30">
          <TrendingUp className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-foreground">Application Pipeline</span>
          {totalItems > 0 && (
            <span className="ml-auto inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-400">
              {totalItems} total
            </span>
          )}
        </div> */}

        {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Total Jobs", value: totalItems, accent: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/15", text: "text-violet-700 dark:text-violet-400" },
          { label: "This Page", value: jobs.length, accent: "from-sky-500/10 to-blue-500/5", border: "border-sky-500/15", text: "text-sky-700 dark:text-sky-400" },
          { label: "Current Page", value: currentPage, accent: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400" },
          { label: "Total Pages", value: totalPages, accent: "from-amber-500/10 to-orange-500/5", border: "border-amber-500/15", text: "text-amber-700 dark:text-amber-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`border ${stat.border} bg-gradient-to-br ${stat.accent} p-4`}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

        <div className="p-5 space-y-4">
          {/* Filters */}
          <JobFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Table or skeleton */}
          {isLoading && !jobs.length ? (
            <JobTableSkeleton />
          ) : (
            <div className="space-y-4">
              <JobTable
                jobs={jobs}
                onDelete={handleDelete}
                onApply={handleApply}
                onEdit={handleEdit}
                onAddTask={handleAddTask}
                onStatusChange={handleStatusChange}
              />

              {/* ── Pagination ── */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{jobs.length}</span>
                  {" "}of{" "}
                  <span className="font-medium text-foreground">{totalItems}</span>
                  {" "}jobs
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="gap-1.5 h-8 px-3 border-border/60 hover:bg-accent/70 hover:border-violet-500/30 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </Button>

                  {/* Page indicator pill */}
                  <div className="inline-flex items-center rounded-lg border border-border/60 bg-muted/40 px-3 h-8">
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {currentPage}
                    </span>
                    <span className="mx-1.5 text-muted-foreground/50 text-xs">/</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {totalPages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="gap-1.5 h-8 px-3 border-border/60 hover:bg-accent/70 hover:border-violet-500/30 disabled:opacity-40 transition-all"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals (unchanged) ── */}
      <JobForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={() => mutate()}
        job={editingJob}
      />

      {selectedJob && (
        <ApplyModal
          open={isApplyModalOpen}
          onOpenChange={setIsApplyModalOpen}
          job={selectedJob}
          onSuccess={() => mutate()}
        />
      )}

      {jobForTask && (
        <TaskModal
          open={isTaskModalOpen}
          onOpenChange={setIsTaskModalOpen}
          jobId={jobForTask.id}
          onSuccess={() => mutate()}
        />
      )}
    </div>
  );
}