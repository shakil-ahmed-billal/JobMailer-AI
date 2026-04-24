"use client";

import { TaskModal } from "@/components/jobs/task-modal";
import { Button } from "@/components/ui/button";
import { tasksApi } from "@/lib/api/tasks";
import { Task } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Clock,
  Edit2,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchTask = async () => {
    try {
      const data = await tasksApi.getById(id);
      setTask(data);
    } catch (error) {
      toast.error("Failed to load task details");
      router.push("/tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.delete(id);
        toast.success("Task deleted");
        router.push("/tasks");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading task details...
      </div>
    );
  if (!task)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Task not found
      </div>
    );

  const isOverdue =
    task.submitStatus === "PENDING" && new Date(task.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/tasks">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="relative rounded-3xl border border-border/50 bg-card shadow-xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-violet-500 to-purple-500" />

        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-200/50 dark:border-emerald-800/40 shadow-sm">
            <CheckSquare className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {task.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider 
                  ${
                    task.submitStatus === "SUBMITTED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : isOverdue
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${task.submitStatus === "SUBMITTED" ? "bg-emerald-500" : isOverdue ? "bg-rose-500" : "bg-amber-500"}`}
                  />
                  {task.submitStatus}
                </span>

                {task.job && (
                  <Link
                    href={`/jobs/${task.jobId}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-600 transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    {task.job.companyName} — {task.job.jobTitle}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={() => setIsEditOpen(true)}
                size="sm"
                className="gap-2 bg-violet-600 hover:bg-violet-700"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Task
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-500" />
              Description
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {task.description ? (
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                  {task.description}
                </p>
              ) : (
                <p className="italic text-muted-foreground/60">
                  No description provided for this task.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">
              Meta Information
            </h3>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Due Date
                </div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  {format(new Date(task.deadline), "PPP")}
                  {isOverdue && (
                    <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                  )}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Resources
                </div>
                {task.taskLink ? (
                  <a
                    href={task.taskLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-violet-600 hover:underline flex items-center gap-1.5"
                  >
                    Task Link
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm italic text-muted-foreground/60 leading-6">
                    No links attached
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
                  <span>Created</span>
                  <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        jobId={task.jobId}
        task={task}
        onSuccess={fetchTask}
      />
    </div>
  );
}

// Simple Icon for the hero
function CheckSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11 3 3L22 4" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}
