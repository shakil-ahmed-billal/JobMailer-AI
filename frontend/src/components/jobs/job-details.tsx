"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatJobRole } from "@/lib/job-roles";
import { Job } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Email, Task } from "@/types";

interface JobDetailsProps {
  job: Job;
  tasks: Task[];
  emails: Email[];
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
  onApply: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function JobDetails({
  job,
  tasks,
  emails,
  onDelete,
  onEdit,
  onReply,
  onApply,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: JobDetailsProps) {
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {job.jobTitle}
            </h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <Building2 className="mr-1 h-4 w-4" />
              <span className="mr-4">{job.companyName}</span>
              <MapPin className="mr-1 h-4 w-4" />
              <span>{job.location || "Remote"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={onApply} className="gap-2">
            <Send className="h-4 w-4" />
            Apply Now
          </Button>
          <Button onClick={onReply} variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Reply Email
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {job.jobDescription}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Notes</CardTitle>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.notes || "No notes added yet."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm" onClick={onAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No tasks added yet.
                  </p>
                ) : (
                  tasks.map((task: Task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getTaskStatusIcon(task.submitStatus)}
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Deadline:{" "}
                            {format(new Date(task.deadline), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {task.taskLink && (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={task.taskLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditTask(task)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteTask(task.id)}
                          className="hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sent Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emails.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    No emails sent yet.
                  </p>
                ) : (
                  emails.map((email: Email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{email.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(email.createdAt), "MMM d, h:mm a")}{" "}
                            • {email.emailType}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{email.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Job Role
                </span>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {formatJobRole(job.jobRole)}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                <div className="mt-1">
                  <Badge variant="outline">{job.status}</Badge>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Application
                </span>
                <div className="mt-1">
                  <Badge
                    variant={
                      job.applyStatus === "APPLIED" ? "default" : "secondary"
                    }
                  >
                    {job.applyStatus}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center text-sm">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                {job.salary || "Not specified"}
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                Posted:{" "}
                {job.createdAt && !isNaN(new Date(job.createdAt).getTime())
                  ? format(new Date(job.createdAt), "MMM d, yyyy")
                  : "—"}
              </div>
              {job.applyDate && (
                <div className="flex items-center text-sm">
                  <Send className="mr-2 h-4 w-4 text-muted-foreground" />
                  Applied:{" "}
                  {job.applyDate && !isNaN(new Date(job.applyDate).getTime())
                    ? format(new Date(job.applyDate), "MMM d, yyyy")
                    : "—"}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${job.companyEmail}`}
                  className="hover:underline text-primary"
                >
                  {job.companyEmail}
                </a>
              </div>
              {job.companyWebsite && (
                <div className="flex items-center text-sm">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Website
                  </a>
                </div>
              )}
              {job.companyLinkedin && (
                <div className="flex items-center text-sm">
                  <Linkedin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <a
                    href={job.companyLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
