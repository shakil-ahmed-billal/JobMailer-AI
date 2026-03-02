"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils";
import { Job } from "@/types";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface JobTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onApply: (job: Job) => void;
  onEdit: (job: Job) => void;
  onAddTask: (job: Job) => void;
  onStatusChange: (jobId: string, status: string) => void;
}

/* ── Status styling map ── */
const statusMap: Record<
  string,
  { label: string; dot: string; pill: string; selectBg: string }
> = {
  DRAFT: {
    label: "Draft",
    dot: "bg-slate-400",
    pill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/40",
    selectBg: "",
  },
  APPLIED: {
    label: "Applied",
    dot: "bg-violet-500",
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40",
    selectBg: "",
  },
  INTERVIEW: {
    label: "Interview",
    dot: "bg-sky-500",
    pill: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/40",
    selectBg: "",
  },
  OFFER: {
    label: "Offer",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40",
    selectBg: "",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40",
    selectBg: "",
  },
};

function StatusPill({ status }: { status: string }) {
  const cfg = statusMap[status] ?? statusMap.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${cfg.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── Company avatar initials ── */
function CompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const hues = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-violet-600",
  ];
  const idx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length;

  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${hues[idx]} text-white text-xs font-bold shadow-sm`}
    >
      {initials}
    </div>
  );
}

export function JobTable({
  jobs,
  onDelete,
  onApply,
  onEdit,
  onAddTask,
  onStatusChange,
}: JobTableProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/30">
              <TableHead className="pl-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 w-[220px]">
                Company
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Position
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 hidden md:table-cell">
                Role
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Status
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 hidden lg:table-cell">
                Applied
              </TableHead>
              <TableHead className="py-3.5 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {jobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
                      <Briefcase className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No jobs found
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Add your first job application to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job, idx) => (
                <TableRow
                  key={job.id}
                  className="group border-b border-border/30 last:border-0 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors duration-150"
                >
                  {/* Company */}
                  <TableCell className="pl-5 py-2">
                    <div className="flex items-center gap-3">
                      <CompanyAvatar name={job.companyName} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate max-w-[130px]">
                          {job.companyName}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Job Title */}
                  <TableCell className="py-2">
                    <p className="text-sm font-medium text-foreground/90 truncate max-w-[180px]">
                      {job.jobTitle}
                    </p>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-2 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      {formatJobRole(job.jobRole)}
                    </span>
                  </TableCell>

                  {/* Status — inline select with styled trigger */}
                  <TableCell className="py-2">
                    {(() => {
                      const cfg = statusMap[job.status] ?? statusMap.DRAFT;
                      return (
                        <Select
                          defaultValue={job.status}
                          onValueChange={(value) =>
                            onStatusChange(job.id, value)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "flex h-7 w-auto min-w-[100px] items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide shadow-sm transition-all hover:opacity-80 active:scale-95 group/status",
                              cfg.pill,
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0 transition-transform group-hover/status:scale-125",
                                cfg.dot,
                              )}
                            />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/60 shadow-xl min-w-[140px]">
                            {Object.entries(statusMap).map(([val, cfg]) => (
                              <SelectItem
                                key={val}
                                value={val}
                                className="rounded-lg text-sm cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      "h-2 w-2 rounded-full",
                                      cfg.dot,
                                    )}
                                  />
                                  {cfg.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    })()}
                  </TableCell>

                  {/* Applied date */}
                  <TableCell className="py-2 hidden lg:table-cell">
                    {job.applyDate &&
                    !isNaN(new Date(job.applyDate).getTime()) ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {format(new Date(job.applyDate), "MMM d, yyyy")}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">
                        —
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-2 pr-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Add task */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAddTask(job)}
                        title="Add Task"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent  transition-all duration-150"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>

                      {/* Apply */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onApply(job)}
                        title="Apply"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30  transition-all duration-150"
                      >
                        <Zap className="h-3.5 w-3.5" />
                      </Button>

                      {/* View */}
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="View Details"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all duration-150"
                      >
                        <Link href={`/jobs/${job.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(job.id)}
                        title="Delete"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-150"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>

                      {/* More */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-border/60 shadow-xl p-1.5"
                        >
                          <DropdownMenuItem
                            onClick={() => onEdit(job)}
                            className="rounded-lg gap-2.5 cursor-pointer h-9 text-sm"
                          >
                            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="rounded-lg gap-2.5 cursor-pointer h-9 text-sm"
                          >
                            <Link href={`/jobs/${job.id}`}>
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAddTask(job)}
                            className="rounded-lg gap-2.5 cursor-pointer h-9 text-sm"
                          >
                            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                            Add Task
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onApply(job)}
                            className="rounded-lg gap-2.5 cursor-pointer h-9 text-sm"
                          >
                            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                            Apply Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-border/40" />
                          <DropdownMenuItem
                            onClick={() => onDelete(job.id)}
                            className="rounded-lg gap-2.5 cursor-pointer h-9 text-sm text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-900/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Job
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

      {/* ── Subtle footer row count ── */}
      {jobs.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/30 bg-muted/20">
          <p className="text-xs text-muted-foreground/60">
            {jobs.length} {jobs.length === 1 ? "application" : "applications"}{" "}
            on this page
          </p>
          <div className="flex items-center gap-1">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="h-1.5 w-5 rounded-full bg-violet-500/30"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
