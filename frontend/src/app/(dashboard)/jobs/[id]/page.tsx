"use client";

import { ReplyModal } from "@/components/emails/reply-modal";
import { JobDetails } from "@/components/jobs/job-details";
import { JobForm } from "@/components/jobs/job-form";
import { jobsApi } from "@/lib/api/jobs";
import { Job } from "@/types";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const id = resolvedParams.id;

  const fetchJob = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.getById(id);
      setJob(data);
    } catch (error) {
      toast.error("Failed to load job details");
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await jobsApi.delete(id);
        toast.success("Job deleted");
        router.push("/jobs");
      } catch (error) {
        toast.error("Failed to delete job");
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8">Job not found</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <JobDetails
        job={job}
        onDelete={handleDelete}
        onEdit={() => setIsEditOpen(true)}
        onReply={() => setIsReplyOpen(true)}
      />

      <JobForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        job={job}
        onSuccess={fetchJob}
      />

      <ReplyModal
        open={isReplyOpen}
        onOpenChange={setIsReplyOpen}
        jobId={job.id}
        companyEmail={job.companyEmail}
        companyName={job.companyName}
        onSuccess={() => {
          toast.success("Reply generated and sent!");
          // Optionally refresh job/emails
        }}
      />
    </div>
  );
}
