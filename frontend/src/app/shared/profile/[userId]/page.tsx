"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  MapPin,
  Briefcase,
  Share2,
  Building2,
  Target,
  Clock,
  Layers,
  ChevronDown,
  Mail,
  RotateCcw
} from "lucide-react";

import { jobsApi, JobFilters } from "@/lib/api/jobs";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/theme/ModeToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusMap: Record<
  string,
  { label: string; dot: string; pill: string }
> = {
  DRAFT: {
    label: "Draft",
    dot: "bg-slate-400",
    pill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/40",
  },
  APPLIED: {
    label: "Applied",
    dot: "bg-violet-500",
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40",
  },
  INTERVIEW: {
    label: "Interview",
    dot: "bg-sky-500",
    pill: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/40",
  },
  OFFER: {
    label: "Offer",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/40",
  },
};

function StatusPill({ status }: { status: string }) {
  const cfg = statusMap[status] ?? statusMap.DRAFT;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider",
        cfg.pill
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

function CompanyAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const hues = [
    "from-violet-500 to-purple-600",
    "from-sky-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-violet-600",
  ];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length;

  return (
    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white text-xs font-bold shadow-sm", hues[idx])}>
      {initials}
    </div>
  );
}

export default function SharedProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ user: any; data: Job[]; meta: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const filters: JobFilters = {};
      if (currentSearch) filters.search = currentSearch;
      if (currentStatus !== "all") filters.status = currentStatus;

      const result = (await jobsApi.getPublicJobs(userId, filters, currentPage, 10)) as any;
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchJobs();
  }, [userId, currentPage, currentSearch, currentStatus]);

  const updateFilters = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "") newParams.delete(key);
      else newParams.set(key, String(value));
    });
    if (!updates.page) newParams.delete("page");
    router.push(`?${newParams.toString()}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-background">
        <div className="rounded-2xl border border-border bg-card p-8 max-w-md w-full shadow-2xl text-center">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <RotateCcw className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold mb-2">Profile Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 text-white" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-violet-500/25">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{data?.user.name || "User"}'s Pipeline</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Professional job application tracking status</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button onClick={copyLink} className="rounded-xl gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-violet-500/20 border-0 h-10 px-5">
              <Share2 className="h-4 w-4" /> Share link
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Applications", value: data?.meta.total || 0, icon: Target, color: "text-violet-500", bg: "bg-violet-500/10" },
            { label: "Interviews", value: data?.data.filter(j => j.status === 'INTERVIEW').length || 0, icon: Clock, color: "text-sky-500", bg: "bg-sky-500/10" },
            { label: "Offers Received", value: data?.data.filter(j => j.status === 'OFFER').length || 0, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Recent Activity", value: data?.data.length || 0, icon: Layers, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Table Container */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-border/40 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search applications..." 
                  className="pl-9 h-10 rounded-xl"
                  value={currentSearch}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                />
              </div>
              <Select value={currentStatus} onValueChange={(v) => updateFilters({ status: v })}>
                <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.keys(statusMap).map(s => (
                    <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Company</TableHead>
                  <TableHead className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Position</TableHead>
                  <TableHead className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 hidden md:table-cell">Role</TableHead>
                  <TableHead className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 text-center">Status</TableHead>
                  <TableHead className="py-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 hidden lg:table-cell">Applied Date</TableHead>
                  <TableHead className="py-3.5 pr-5 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border/30">
                      <TableCell colSpan={6} className="py-4 px-4"><Skeleton className="h-8 w-full rounded-lg" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center">
                      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                        <Briefcase className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No applications found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((job) => (
                    <TableRow key={job.id} className="group border-b border-border/30 last:border-0 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors">
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-3">
                          <CompanyAvatar name={job.companyName} />
                          <span className="font-bold text-sm">{job.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm font-medium">{job.jobTitle}</div>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {job.jobRole.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <StatusPill status={job.status} />
                      </TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {job.applyDate ? format(new Date(job.applyDate), "MMM d, yyyy") : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 pr-5 text-right">
                        {job.companyWebsite ? (
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-lg hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/30">
                            <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Info */}
          {data && data.meta.total > 0 && (
            <div className="p-4 border-t border-border/30 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground font-medium">
                Showing <span className="text-foreground">{(data.meta.page - 1) * data.meta.limit + 1}-{Math.min(data.meta.page * data.meta.limit, data.meta.total)}</span> of <span className="text-foreground">{data.meta.total}</span> applications
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" size="sm" className="h-8 rounded-lg border-border/60 hover:border-violet-500/30"
                  disabled={currentPage === 1}
                  onClick={() => updateFilters({ page: currentPage - 1 })}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map(p => (
                    <Button 
                      key={p} size="sm" 
                      variant={p === currentPage ? "default" : "ghost"}
                      className={cn("h-8 w-8 rounded-lg p-0 text-xs font-bold", p === currentPage ? "bg-violet-600 text-white shadow-sm" : "text-muted-foreground")}
                      onClick={() => updateFilters({ page: p })}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" size="sm" className="h-8 rounded-lg border-border/60 hover:border-violet-500/30"
                  disabled={currentPage === data.meta.totalPages}
                  onClick={() => updateFilters({ page: currentPage + 1 })}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <div className="text-center pt-8 pb-12">
          <p className="text-[10px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase">
            Professional Job Pipeline · Powered by JobMailer AI
          </p>
        </div>
      </div>
    </div>
  );
}
