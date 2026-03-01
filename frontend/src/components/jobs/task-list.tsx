"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tasksApi } from "@/lib/api/tasks";
import { Task } from "@/types";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Edit2,
  Link2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TaskForm } from "./task-form";

interface TaskListProps {
  jobId: string;
  initialTasks: Task[];
  onRefresh: () => void;
}

export function TaskList({ jobId, initialTasks, onRefresh }: TaskListProps) {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleUpdateStatus = async (task: Task) => {
    try {
      const nextStatus =
        task.submitStatus === "SUBMITTED" ? "PENDING" : "SUBMITTED";
      await tasksApi.update(task.id, { submitStatus: nextStatus as any });
      toast.success("Task status updated");
      onRefresh();
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.delete(id);
        toast.success("Task deleted");
        onRefresh();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Submitted
          </Badge>
        );
      case "OVERDUE":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Assessments & Tasks</CardTitle>
          <CardDescription>
            Track take-home tests, technical tests, etc.
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingTask(undefined);
            setIsTaskFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {initialTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks added yet.
            </p>
          ) : (
            initialTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 border rounded-lg group hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 h-6 w-6"
                    onClick={() => handleUpdateStatus(task)}
                  >
                    {task.submitStatus === "SUBMITTED" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`font-medium text-sm sm:text-base ${task.submitStatus === "SUBMITTED" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      {getStatusBadge(task.submitStatus)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3 shrink-0" />
                        <span>
                          Due: {format(new Date(task.deadline), "MMM d, yyyy")}
                        </span>
                      </div>
                      {task.taskLink && (
                        <a
                          href={task.taskLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <Link2 className="mr-1 h-3 w-3 shrink-0" />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 italic">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={(open) => {
          setIsTaskFormOpen(open);
          if (!open) setEditingTask(undefined);
        }}
        onSuccess={onRefresh}
        jobId={jobId}
        task={editingTask}
      />
    </Card>
  );
}
