"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { jobsApi } from "@/lib/api/jobs";
import { formatJobRole } from "@/lib/job-roles";
import { Job } from "@/types";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  DollarSign,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmailList } from "./email-list";
import { TaskList } from "./task-list";

interface JobDetailsProps {
  job: Job;
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
  onRefresh: () => void;
}

export function JobDetails({
  job,
  onDelete,
  onEdit,
  onReply,
  onRefresh,
}: JobDetailsProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(job.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(job.notes || "");
  }, [job.notes]);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await jobsApi.update(job.id, { notes });
      toast.success("Notes updated");
      setIsEditingNotes(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to update notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight wrap-break-word">
              {job.jobTitle}
            </h2>
            <div className="flex flex-wrap items-center text-muted-foreground mt-1 gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center">
                <Building2 className="mr-1 h-3.5 w-3.5" />
                <span>{job.companyName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                <span>{job.location || "Remote"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onReply} className="gap-2 flex-1 sm:flex-none">
            <Mail className="h-4 w-4" />
            Reply Email
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex-1 sm:flex-none"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="flex-1 sm:flex-none"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {job.jobDescription}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Notes</CardTitle>
              {!isEditingNotes ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNotes(job.notes || "");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                  >
                    {isSavingNotes ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {job.notes || "No notes added."}
                </p>
              )}
            </CardContent>
          </Card>

          <TaskList
            jobId={job.id}
            initialTasks={job.tasks || []}
            onRefresh={onRefresh}
          />

          <EmailList emails={job.emails || []} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Job Role
                  </span>
                  <Badge variant="secondary" className="mt-1">
                    {formatJobRole(job.jobRole)}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Status
                  </span>
                  <Badge variant="outline" className="mt-1">
                    {job.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Application
                  </span>
                  <Badge
                    variant={
                      job.applyStatus === "APPLIED" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {job.applyStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Salary
                  </span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="font-medium truncate">
                      {job.salary || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Posted:</span>
                  <span className="font-medium">
                    {job.createdAt && !isNaN(new Date(job.createdAt).getTime())
                      ? format(new Date(job.createdAt), "MMM d, yyyy")
                      : "—"}
                  </span>
                </div>
                {job.applyDate && (
                  <div className="flex items-center text-xs">
                    <Send className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Applied:</span>
                    <span className="font-medium">
                      {format(new Date(job.applyDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-xs">
                    Email
                  </span>
                  <a
                    href={`mailto:${job.companyEmail}`}
                    className="hover:underline text-primary font-medium truncate block text-sm"
                  >
                    {job.companyEmail}
                  </a>
                </div>
              </div>
              {job.companyWebsite && (
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-muted-foreground block text-xs">
                      Website
                    </span>
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium truncate block text-sm"
                    >
                      {new URL(job.companyWebsite).hostname}
                    </a>
                  </div>
                </div>
              )}
              {job.companyLinkedin && (
                <div className="flex items-start gap-3">
                  <Linkedin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-muted-foreground block text-xs">
                      LinkedIn
                    </span>
                    <a
                      href={job.companyLinkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium truncate block text-sm"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";
