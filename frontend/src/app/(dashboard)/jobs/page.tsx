"use client";

import { ApplyModal } from "@/components/jobs/apply-modal";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobForm } from "@/components/jobs/job-form";
import { JobTable } from "@/components/jobs/job-table";
import { TaskModal } from "@/components/jobs/task-modal";
import { Button } from "@/components/ui/button";
import { JobFilters as FilterType, jobsApi } from "@/lib/api/jobs";
import { Job } from "@/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await jobsApi.getAll(filters, currentPage, 10);

      // Resilience check: handle both paginated and non-paginated (array) responses
      if (Array.isArray(response)) {
        setJobs(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else if (response && typeof response === "object") {
        setJobs(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalItems(response.meta?.total || response.data?.length || 0);
      } else {
        setJobs([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.delete(id);
        toast.success("Job deleted successfully");
        fetchJobs();
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
        {loading ? (
          <div className="text-center py-10">Loading jobs...</div>
        ) : (
          <div className="space-y-4">
            <JobTable
              jobs={jobs}
              onDelete={handleDelete}
              onApply={handleApply}
              onEdit={handleEdit}
              onAddTask={handleAddTask}
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
                  disabled={currentPage === 1 || loading}
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
                  disabled={currentPage === totalPages || loading}
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
        onSuccess={fetchJobs}
        job={editingJob}
      />

      {selectedJob && (
        <ApplyModal
          open={isApplyModalOpen}
          onOpenChange={setIsApplyModalOpen}
          job={selectedJob}
          onSuccess={fetchJobs}
        />
      )}

      {jobForTask && (
        <TaskModal
          open={isTaskModalOpen}
          onOpenChange={setIsTaskModalOpen}
          jobId={jobForTask.id}
          onSuccess={fetchJobs}
        />
      )}
    </div>
  );
}
