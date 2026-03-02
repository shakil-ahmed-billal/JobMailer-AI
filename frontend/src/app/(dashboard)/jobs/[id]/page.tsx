"use client";

import { ReplyModal } from "@/components/emails/reply-modal";
import { ApplyModal } from "@/components/jobs/apply-modal";
import { JobDetails } from "@/components/jobs/job-details";
import { JobForm } from "@/components/jobs/job-form";
import { TaskModal } from "@/components/jobs/task-modal";
import { JobDetailsSkeleton } from "@/components/shared/skeletons";
import { swrFetcher } from "@/lib/api/client";
import { jobsApi } from "@/lib/api/jobs";
import { tasksApi } from "@/lib/api/tasks";
import { Job, Task } from "@/types";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Parallel fetching with SWR
  const {
    data: job,
    error: jobError,
    isLoading: isJobLoading,
    mutate: mutateJob,
  } = useSWR<Job>(`/jobs/${id}`, swrFetcher);

  const { data: rawTasks, mutate: mutateTasks } = useSWR<any>(
    `/tasks/job/${id}`,
    swrFetcher,
  );

  const { data: rawEmails, mutate: mutateEmails } = useSWR<any>(
    `/emails?jobId=${id}`,
    swrFetcher,
  );

  const tasks = rawTasks
    ? Array.isArray(rawTasks)
      ? rawTasks
      : rawTasks.data
    : [];
  const emails = rawEmails
    ? Array.isArray(rawEmails)
      ? rawEmails
      : rawEmails.data
    : [];

  const mutateAll = () => {
    mutateJob();
    mutateTasks();
    mutateEmails();
  };

  useEffect(() => {
    if (jobError) {
      toast.error("Failed to load job details");
      router.push("/jobs");
    }
  }, [jobError, router]);

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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.delete(taskId);
        toast.success("Task deleted");
        mutateTasks();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleUpdateNotes = async (notes: string) => {
    try {
      await jobsApi.update(id, { notes });
      mutateJob();
      toast.success("Notes updated");
    } catch (error) {
      toast.error("Failed to update notes");
      throw error;
    }
  };

  if (isJobLoading && !job)
    return (
      <div className="p-8">
        <JobDetailsSkeleton />
      </div>
    );

  if (!job && !isJobLoading) return <div className="p-8">Job not found</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <JobDetails
        job={job!}
        tasks={tasks || []}
        emails={emails || []}
        onDelete={handleDelete}
        onEdit={() => setIsEditOpen(true)}
        onReply={() => setIsReplyOpen(true)}
        onApply={() => setIsApplyOpen(true)}
        onNotesUpdate={handleUpdateNotes}
        onAddTask={() => {
          setSelectedTask(undefined);
          setIsTaskModalOpen(true);
        }}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <JobForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        job={job!}
        onSuccess={mutateJob}
      />

      <ReplyModal
        open={isReplyOpen}
        onOpenChange={setIsReplyOpen}
        jobId={job!.id}
        companyEmail={job!.companyEmail}
        companyName={job!.companyName}
        onSuccess={() => {
          toast.success("Reply generated and sent!");
          mutateEmails();
        }}
      />

      <ApplyModal
        open={isApplyOpen}
        onOpenChange={setIsApplyOpen}
        job={job!}
        onSuccess={mutateAll}
      />

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        jobId={job!.id}
        task={selectedTask}
        onSuccess={mutateTasks}
      />
    </div>
  );
}
