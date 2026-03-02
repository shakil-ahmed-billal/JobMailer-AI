"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tasksApi } from "@/lib/api/tasks";
import { Task } from "@/types";

const taskSchema = z.object({
  title:        z.string().min(1, "Title is required"),
  description:  z.string().optional(),
  deadline:     z.string().min(1, "Deadline is required"),
  submitStatus: z.enum(["PENDING","SUBMITTED","OVERDUE"]),
  taskLink:     z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  task?: Task;
  onSuccess: () => void;
}

const inputCls = "h-10 rounded-xl border-border/60 bg-muted/30 text-sm focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70";

const statusOptions = [
  { value: "PENDING",   label: "Pending",   dot: "bg-amber-400" },
  { value: "SUBMITTED", label: "Submitted", dot: "bg-emerald-500" },
  { value: "OVERDUE",   label: "Overdue",   dot: "bg-rose-500" },
];

export function TaskModal({ open, onOpenChange, jobId, task, onSuccess }: TaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!task;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", deadline: "", submitStatus: "PENDING", taskLink: "" },
  });

  useEffect(() => {
    if (task && open) {
      form.reset({
        title: task.title, description: task.description || "",
        deadline: task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
        submitStatus: task.submitStatus, taskLink: task.taskLink || "",
      });
    } else if (!task && open) {
      form.reset({
        title: "", description: "",
        deadline: new Date().toISOString().split("T")[0],
        submitStatus: "PENDING", taskLink: "",
      });
    }
  }, [task, open, form]);

  async function onSubmit(data: TaskFormValues) {
    setIsLoading(true);
    try {
      if (isEditing && task) {
        await tasksApi.update(task.id, data);
        toast.success("Task updated");
      } else {
        await tasksApi.create({ ...data, jobId, deadline: new Date(data.deadline).toISOString() });
        toast.success("Task created");
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Failed to save task");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-2xl border-border/60 shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-violet-500 to-purple-500" />
          <div className="flex items-center gap-3 px-6 py-5 bg-muted/20 border-b border-border/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/10 border border-emerald-200/50 dark:border-emerald-800/40">
              <CheckSquare className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight">
                {isEditing ? "Edit Task" : "Add Task"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing ? "Update this task's details." : "Create a new task to track for this job."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

            {/* Title */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Task Title</FormLabel>
                <FormControl><Input placeholder="e.g. Technical Assessment" className={inputCls} {...field} /></FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Deadline + Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
              <FormField control={form.control} name="submitStatus" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/30 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {statusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value} className="rounded-lg text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                            {s.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
            </div>

            {/* Task Link */}
            <FormField control={form.control} name="taskLink" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Task Link <span className="normal-case font-normal text-muted-foreground/50">(optional)</span></FormLabel>
                <FormControl><Input placeholder="https://..." className={inputCls} {...field} /></FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Description <span className="normal-case font-normal text-muted-foreground/50">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what needs to be done…"
                    className="rounded-xl border-border/60 bg-muted/30 text-sm resize-none focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button type="button" variant="ghost" size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-sm rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} size="sm"
                className="h-9 px-5 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20 gap-2">
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isEditing ? "Update Task" : "Add Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}