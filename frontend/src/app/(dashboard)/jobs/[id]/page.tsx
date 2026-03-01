"use client";

import { ReplyModal } from "@/components/emails/reply-modal";
import { ApplyModal } from "@/components/jobs/apply-modal";
import { JobDetails } from "@/components/jobs/job-details";
import { JobForm } from "@/components/jobs/job-form";
import { TaskModal } from "@/components/jobs/task-modal";
import { emailsApi } from "@/lib/api/emails";
import { jobsApi } from "@/lib/api/jobs";
import { tasksApi } from "@/lib/api/tasks";
import { Email, Job, Task } from "@/types";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const id = resolvedParams.id;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobData, tasksData, emailsData] = await Promise.all([
        jobsApi.getById(id),
        tasksApi.getAll(id),
        emailsApi.getAll({ jobId: id }),
      ]);
      setJob(jobData);
      setTasks(tasksData || []);
      setEmails(emailsData || []);
    } catch (error) {
      toast.error("Failed to load job details");
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        fetchData();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8">Job not found</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <JobDetails
        job={job}
        tasks={tasks}
        emails={emails}
        onDelete={handleDelete}
        onEdit={() => setIsEditOpen(true)}
        onReply={() => setIsReplyOpen(true)}
        onApply={() => setIsApplyOpen(true)}
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
        job={job}
        onSuccess={fetchData}
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

      <ApplyModal
        open={isApplyOpen}
        onOpenChange={setIsApplyOpen}
        job={job}
        onSuccess={fetchData}
      />

      <TaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        jobId={job.id}
        task={selectedTask}
        onSuccess={fetchData}
      />
    </div>
  );
}
