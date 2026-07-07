"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/types";
import { format } from "date-fns";
import {
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

interface TaskViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const statusConfig: Record<
  string,
  { color: string; bg: string; dot: string; label: string }
> = {
  PENDING: {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    dot: "bg-amber-500",
    label: "Pending",
  },
  SUBMITTED: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    dot: "bg-emerald-500",
    label: "Submitted",
  },
  OVERDUE: {
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/30",
    dot: "bg-rose-500",
    label: "Overdue",
  },
};

export function TaskViewModal({
  open,
  onOpenChange,
  task,
}: TaskViewModalProps) {
  if (!task) return null;

  const status = statusConfig[task.submitStatus] || statusConfig.PENDING;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 rounded-2xl border-border/60 shadow-2xl overflow-hidden">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-violet-500 to-purple-500" />
          <div className="flex items-center gap-4 px-6 py-5 bg-muted/20 border-b border-border/40">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-500/10 border border-emerald-200/50 dark:border-emerald-800/40">
              <CheckSquare className="h-5.5 w-5.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight truncate">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${status.bg} ${status.color}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                {task.job && (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    for {task.job.companyName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/40">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                <Clock className="h-3.5 w-3.5" />
                Deadline
              </div>
              <p className="text-sm font-medium">
                {format(new Date(task.deadline), "MMMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                <LinkIcon className="h-3.5 w-3.5" />
                Task Link
              </div>
              {task.taskLink ? (
                <a
                  href={task.taskLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1.5 truncate"
                >
                  Visit Link
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground/60 italic">
                  No link provided
                </p>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              <FileText className="h-3.5 w-3.5" />
              Description
            </div>
            <div className="bg-muted/10 rounded-2xl border border-border/40 p-4 min-h-[100px]">
              {task.description ? (
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                  <FileText className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs italic">No description provided</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/20 border-t border-border/40 flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-10 px-6 text-sm font-medium border-border/60 hover:bg-background"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
