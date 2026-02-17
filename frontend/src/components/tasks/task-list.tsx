"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types";
import { format, isPast, isToday } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (task: Task, status: string) => void;
}

export function TaskList({
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
}: TaskListProps) {
  const getDeadlineColor = (dateString: string, status: string) => {
    if (status === "SUBMITTED") return "text-green-600";
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return "text-red-600 font-bold";
    if (isToday(date)) return "text-orange-500 font-bold";
    return "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Job / Company</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {task.submitStatus === "SUBMITTED" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : task.submitStatus === "OVERDUE" ||
                      (isPast(new Date(task.deadline)) &&
                        task.submitStatus === "PENDING") ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : null}
                    {task.title}
                  </div>
                </TableCell>
                <TableCell>
                  {task.job?.companyName || "General"}
                  <div className="text-xs text-muted-foreground">
                    {task.job?.jobTitle}
                  </div>
                </TableCell>
                <TableCell
                  className={getDeadlineColor(task.deadline, task.submitStatus)}
                >
                  {format(new Date(task.deadline), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      task.submitStatus === "SUBMITTED"
                        ? "default"
                        : task.submitStatus === "OVERDUE"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {task.submitStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(task, "SUBMITTED")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
