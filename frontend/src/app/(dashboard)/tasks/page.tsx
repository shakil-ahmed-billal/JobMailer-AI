"use client";

import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { jobsApi } from "@/lib/api/jobs";
import { tasksApi } from "@/lib/api/tasks";
import { Job, Task } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getAll();
      setTasks(Array.isArray(data) ? data : ((data as any)?.data ?? []));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await jobsApi.getAll();
      setJobs(data || []);
    } catch (error) {
      console.error("Failed to load jobs for task form");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.delete(id);
        toast.success("Task deleted");
        fetchTasks();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (task: Task, status: string) => {
    try {
      await tasksApi.update(task.id, { submitStatus: status as any });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setSelectedTask(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={fetchTasks}
        task={selectedTask}
        jobs={jobs}
      />
    </div>
  );
}
