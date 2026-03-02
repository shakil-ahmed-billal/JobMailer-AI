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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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

  // Generate SWR key based on filters and page
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
  } = useSWR(swrKey, swrFetcher, {
    keepPreviousData: true,
  });

  // Sync SWR data to local state for optimistic updates
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
    if (error) {
      toast.error("Failed to load jobs");
    }
  }, [error]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.delete(id);
        toast.success("Job deleted successfully");
        mutate();
      } catch (error) {
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
    if (!open) {
      setEditingJob(undefined);
    }
  };

  const handleStatusChange = async (jobId: string, status: string) => {
    // Optimistic update
    const previousJobs = [...jobs];
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: status as any } : job,
      ),
    );

    try {
      await jobsApi.update(jobId, { status: status as any });
      toast.success("Status updated successfully");
      // No need to fetchJobs() here as we've already updated the state locally
    } catch (error) {
      // Revert on error
      setJobs(previousJobs);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setEditingJob(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Job
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />
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

            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {jobs.length} of {totalItems} jobs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
