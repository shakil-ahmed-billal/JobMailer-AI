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
import { Job } from "@/types";
import { format } from "date-fns";
import { Edit, Eye, MoreHorizontal, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatJobRole } from "@/lib/job-roles";

interface JobTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onApply: (job: Job) => void;
}

export function JobTable({ jobs, onDelete, onApply }: JobTableProps) {
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
                <TableCell className="font-medium">{job.companyName}</TableCell>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {job.applyStatus === "NOT_APPLIED" && (
                        <DropdownMenuItem onClick={() => onApply(job)}>
                          <Send className="mr-2 h-4 w-4" />
                          Apply Now
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
