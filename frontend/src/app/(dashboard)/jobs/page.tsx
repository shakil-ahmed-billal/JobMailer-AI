"use client";

import { ApplyModal } from "@/components/jobs/apply-modal";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobForm } from "@/components/jobs/job-form";
import { JobTable } from "@/components/jobs/job-table";
import { Button } from "@/components/ui/button";
import { JobFilters as FilterType, jobsApi } from "@/lib/api/jobs";
import { Job } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.getAll(filters);
      setJobs(data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Job
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <JobFilters filters={filters} onFilterChange={setFilters} />
        {loading ? (
          <div className="text-center py-10">Loading jobs...</div>
        ) : (
          <JobTable jobs={jobs} onDelete={handleDelete} onApply={handleApply} />
        )}
      </div>

      <JobForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={fetchJobs}
      />

      {selectedJob && (
        <ApplyModal
          open={isApplyModalOpen}
          onOpenChange={setIsApplyModalOpen}
          job={selectedJob}
          onSuccess={fetchJobs}
        />
      )}
    </div>
  );
}
