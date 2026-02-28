"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { formatJobRole } from "@/lib/job-roles";
import { Job } from "@/types";
import { format } from "date-fns";
import { Edit, Eye, MoreHorizontal, Plus, Send, Trash2 } from "lucide-react";
import Link from "next/link";

interface JobTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onApply: (job: Job) => void;
  onEdit: (job: Job) => void;
  onAddTask: (job: Job) => void;
  onAddJob: () => void;
}

export function JobTable({
  jobs,
  onDelete,
  onApply,
  onEdit,
  onAddTask,
  onAddJob,
}: JobTableProps) {
  const getStatusColor = (
    status: string,
  ): "default" | "outline" | "secondary" | "destructive" => {
    switch (status) {
      case "APPLIED":
        return "default"; // Primary color
      case "INTERVIEW":
        return "outline"; // Or custom color class
      case "OFFER":
        return "secondary"; // Green-ish usually
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile View: Card Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {jobs.length === 0 ? (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            No jobs found.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {job.companyName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {job.jobTitle}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium block text-foreground">
                      Role
                    </span>
                    {formatJobRole(job.jobRole)}
                  </div>
                  <div>
                    <span className="font-medium block text-foreground">
                      Applied
                    </span>
                    {job.applyDate && !isNaN(new Date(job.applyDate).getTime())
                      ? format(new Date(job.applyDate), "MMM d, yyyy")
                      : "-"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 flex-1 gap-2 text-primary hover:text-primary hover:bg-primary/10 border"
                    onClick={() => onApply(job)}
                  >
                    <Send className="h-4 w-4" />
                    Apply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 flex-1 gap-2 border"
                    asChild
                  >
                    <Link href={`/jobs/${job.id}`}>
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 flex-1 gap-2 border"
                    onClick={() => onEdit(job)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 flex-1 gap-2 border"
                    onClick={() => onAddTask(job)}
                  >
                    <Plus className="h-4 w-4" />
                    Task
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border"
                    onClick={() => onDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table Layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Job Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span>Actions</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onAddJob}
                    title="Add New Job"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {job.companyName}
                  </TableCell>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>{formatJobRole(job.jobRole)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.applyDate && !isNaN(new Date(job.applyDate).getTime())
                      ? format(new Date(job.applyDate), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onApply(job)}
                        title="Apply Now"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="View Details"
                      >
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(job)}
                        title="Edit Job"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAddTask(job)}
                        title="Add Task"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(job.id)}
                        title="Delete Job"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onApply(job)}>
                            <Send className="mr-2 h-4 w-4" />
                            Apply Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/jobs/${job.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(job)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(job.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
