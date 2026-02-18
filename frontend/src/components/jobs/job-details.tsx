"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Job } from "@/types";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface JobDetailsProps {
  job: Job;
  onDelete: () => void;
  onEdit: () => void;
  onReply: () => void;
}

export function JobDetails({
  job,
  onDelete,
  onEdit,
  onReply,
}: JobDetailsProps) {
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
          <Button onClick={onReply} className="gap-2">
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
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {job.notes || "No notes added."}
              </p>
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

import { Send } from "lucide-react";
