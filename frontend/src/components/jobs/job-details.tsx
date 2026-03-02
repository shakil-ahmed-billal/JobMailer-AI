"use client";

import { EmailPreview } from "@/components/emails/email-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatJobRole } from "@/lib/job-roles";
import { Email, Job, Task } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Plus,
  Save,
  Send,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  onNotesUpdate: (notes: string) => Promise<void>;
}

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  DRAFT:      { color: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-100 dark:bg-slate-800",   dot: "bg-slate-400" },
  APPLIED:    { color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30", dot: "bg-violet-500" },
  INTERVIEW:  { color: "text-sky-700 dark:text-sky-400",       bg: "bg-sky-50 dark:bg-sky-900/30",     dot: "bg-sky-500" },
  OFFER:      { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", dot: "bg-emerald-500" },
  REJECTED:   { color: "text-rose-700 dark:text-rose-400",     bg: "bg-rose-50 dark:bg-rose-900/30",   dot: "bg-rose-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, action }: { icon?: any; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 bg-muted/20">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="h-4 w-4 text-violet-500" />}
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function JobDetails({
  job, tasks, emails,
  onDelete, onEdit, onReply, onApply,
  onAddTask, onEditTask, onDeleteTask, onNotesUpdate,
}: JobDetailsProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(job.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  const descriptionLimit = 500;
  const isLongDescription = job.jobDescription.length > descriptionLimit;
  const displayedDescription =
    isLongDescription && !isDescriptionExpanded
      ? job.jobDescription.slice(0, descriptionLimit) + "..."
      : job.jobDescription;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onNotesUpdate(editedNotes);
      setIsEditingNotes(false);
    } catch {}
    finally { setIsSavingNotes(false); }
  };

  const getTaskStatusIcon = (status: string) => {
    if (status === "SUBMITTED") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "OVERDUE")   return <AlertCircle  className="h-4 w-4 text-rose-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-0">

      {/* ── Top action bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <Button variant="ghost" size="sm" asChild
          className="w-fit gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/60 -ml-2">
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onApply}
            size="sm"
            className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 h-9"
          >
            <Zap className="h-3.5 w-3.5" />
            Apply Now
          </Button>
          <Button onClick={onReply} variant="outline" size="sm"
            className="gap-2 h-9 border-border/60 hover:border-violet-500/40 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all duration-200">
            <Mail className="h-3.5 w-3.5" />
            Reply
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}
            className="gap-2 h-9 border-border/60 hover:border-border transition-all">
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}
            className="gap-2 h-9 border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* ── Job identity hero card ── */}
      <SectionCard className="mb-6">
        <div className="relative overflow-hidden">
          {/* Gradient top strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
            {/* Company avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-500/10 border border-violet-200/60 dark:border-violet-800/40 shadow-sm">
              <Building2 className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {job.jobTitle}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                  <Building2 className="h-3.5 w-3.5 text-violet-500" />
                  {job.companyName}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.salary}
                  </span>
                )}
              </div>

              {/* Status badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {job.status     && <StatusBadge status={job.status} />}
                {job.applyStatus && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
                    {job.applyStatus}
                  </span>
                )}
                {job.responseStatus && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                    {job.responseStatus}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground">
                  {formatJobRole(job.jobRole)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Job Description */}
          <SectionCard>
            <SectionHeader icon={Eye} title="Job Description" />
            <div className="p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                {displayedDescription}
              </p>
              {isLongDescription && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors"
                >
                  {isDescriptionExpanded ? (
                    <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
                  ) : (
                    <><ChevronDown className="h-3.5 w-3.5" /> Show More</>
                  )}
                </button>
              )}
            </div>
          </SectionCard>

          {/* Notes */}
          <SectionCard>
            <SectionHeader
              icon={Edit2}
              title="Notes"
              action={
                !isEditingNotes && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-accent"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                )
              }
            />
            <div className="p-5">
              {isEditingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add your private notes here..."
                    className="min-h-[140px] text-sm resize-none border-border/60 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 bg-muted/30 rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditedNotes(job.notes || ""); setIsEditingNotes(false); }}
                      className="h-8 gap-1.5 text-xs">
                      <X className="h-3 w-3" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveNotes} disabled={isSavingNotes}
                      className="h-8 gap-1.5 text-xs bg-violet-600 hover:bg-violet-700">
                      {isSavingNotes ? <Clock className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-6 min-h-[40px]">
                  {job.notes || "No notes yet. Click edit to add your thoughts about this opportunity."}
                </p>
              )}
            </div>
          </SectionCard>

          {/* Tasks */}
          <SectionCard>
            <SectionHeader
              icon={CheckCircle2}
              title={`Tasks ${tasks.length > 0 ? `(${tasks.length})` : ""}`}
              action={
                <button
                  onClick={onAddTask}
                  className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 px-2.5 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-all border border-violet-200/60 dark:border-violet-800/40"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </button>
              }
            />
            <div className="p-4">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Add tasks to track your progress</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task: Task) => (
                    <div key={task.id}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all duration-150">
                      <div className="flex items-center gap-3 min-w-0">
                        {getTaskStatusIcon(task.submitStatus)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Due {format(new Date(task.deadline), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        {task.taskLink && (
                          <a href={task.taskLink} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button onClick={() => onEditTask(task)}
                          className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDeleteTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-muted-foreground hover:text-rose-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Sent Emails */}
          <SectionCard>
            <SectionHeader
              icon={Mail}
              title={`Sent Emails ${emails.length > 0 ? `(${emails.length})` : ""}`}
            />
            <div className="p-4">
              {emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                    <Mail className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">No emails sent</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Send your application to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {emails.map((email: Email) => (
                    <div key={email.id}
                      onClick={() => { setSelectedEmail(email); setIsEmailPreviewOpen(true); }}
                      className="group flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-violet-300/40 dark:hover:border-violet-700/40 transition-all duration-150 cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/30 border border-violet-200/50 dark:border-violet-800/40">
                          <Mail className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{email.subject}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(email.createdAt), "MMM d, h:mm a")} · {email.emailType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold
                          ${email.status === "SENT" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                          {email.status}
                        </span>
                        <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Details card */}
          <SectionCard>
            <SectionHeader title="Job Details" />
            <div className="p-5 space-y-4">
              {[
                { label: "Job Role",    value: <span className="text-sm font-medium">{formatJobRole(job.jobRole)}</span> },
                { label: "Status",      value: <StatusBadge status={job.status} /> },
                { label: "Application", value: (
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${job.applyStatus === "APPLIED" ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-muted text-muted-foreground"}`}>
                    {job.applyStatus}
                  </span>
                )},
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5">{label}</p>
                  {value}
                </div>
              ))}

              <div className="h-px bg-border/50" />

              <div className="space-y-3">
                {job.salary && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.createdAt && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Posted {!isNaN(new Date(job.createdAt).getTime()) ? format(new Date(job.createdAt), "MMM d, yyyy") : "—"}</span>
                  </div>
                )}
                {job.applyDate && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Send className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Applied {!isNaN(new Date(job.applyDate).getTime()) ? format(new Date(job.applyDate), "MMM d, yyyy") : "—"}</span>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Contact card */}
          <SectionCard>
            <SectionHeader title="Contact Info" />
            <div className="p-5 space-y-3">
              <a href={`mailto:${job.companyEmail}`}
                className="flex items-center gap-2.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 group transition-colors">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/30 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">{job.companyEmail}</span>
              </a>
              {job.companyWebsite && (
                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground group transition-colors">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <span>Company Website</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {job.companyLinkedin && (
                <a href={job.companyLinkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-sky-600 group transition-colors">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted group-hover:bg-sky-50 dark:group-hover:bg-sky-900/30 transition-colors">
                    <Linkedin className="h-3.5 w-3.5" />
                  </div>
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </SectionCard>

          {/* Quick actions card */}
          <SectionCard>
            <SectionHeader title="Quick Actions" />
            <div className="p-4 space-y-2">
              <button onClick={onApply}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 hover:shadow-violet-500/30">
                <Zap className="h-4 w-4" />
                Apply with AI
              </button>
              <button onClick={onReply}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 hover:bg-muted/50 hover:border-border text-sm font-medium transition-all">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Reply to Email
              </button>
              <button onClick={onAddTask}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 hover:bg-muted/50 hover:border-border text-sm font-medium transition-all">
                <Plus className="h-4 w-4 text-muted-foreground" />
                Add Task
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <EmailPreview
        open={isEmailPreviewOpen}
        onOpenChange={setIsEmailPreviewOpen}
        email={selectedEmail}
      />
    </div>
  );
}