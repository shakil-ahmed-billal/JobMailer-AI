"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  onStatusChange: (jobId: string, status: string) => void;
}

export function JobTable({
  jobs,
  onDelete,
  onApply,
  onEdit,
  onAddTask,
  onStatusChange,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="font-medium max-w-[150px] truncate">
                  {job.companyName}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {job.jobTitle}
                </TableCell>
                <TableCell>{formatJobRole(job.jobRole)}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={job.status}
                    onValueChange={(value) => onStatusChange(job.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="INTERVIEW">Interview</SelectItem>
                      <SelectItem value="OFFER">Offer</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {job.applyDate && !isNaN(new Date(job.applyDate).getTime())
                    ? format(new Date(job.applyDate), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAddTask(job)}
                      title="Add Task"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onApply(job)}
                      title="Apply"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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
                      onClick={() => onDelete(job.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(job)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onApply(job)}>
                          <Send className="mr-2 h-4 w-4" />
                          Apply Now (Alt)
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
  );
}
