"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileDown, FileUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { resumesApi } from "@/lib/api/resumes";
import { JOB_ROLE_OPTIONS, formatJobRole } from "@/lib/job-roles";
import { Resume } from "@/types";

function ResumeUploadModal({
  open,
  onOpenChange,
  onSuccess,
  resume,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  resume?: Resume;
}) {
  const [jobRole, setJobRole] = useState<string>(resume?.jobRole || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setJobRole(resume?.jobRole || "");
    setFile(null);
  }, [resume, open]);

  const isReplace = !!resume;

  const handleSave = async () => {
    if (!jobRole) {
      toast.error("Please select a job role");
      return;
    }
    if (!file) {
      toast.error("Please choose a PDF file");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }

    setIsSaving(true);
    try {
      if (isReplace && resume) {
        await resumesApi.update(resume.id, { jobRole, file });
        toast.success("Resume replaced successfully");
      } else {
        await resumesApi.upload({ jobRole, file });
        toast.success("Resume uploaded successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isReplace ? "Replace Resume" : "Upload Resume"}</DialogTitle>
          <DialogDescription>
            Upload a PDF resume and assign it to a job role. One resume per role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Job Role</div>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select job role" />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">PDF File (max 5MB)</div>
            <Input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isReplace ? "Replace" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<Resume | undefined>(undefined);

  const missingRoles = useMemo(() => {
    const have = new Set(resumes.map((r) => r.jobRole));
    return JOB_ROLE_OPTIONS.filter((o) => !have.has(o.value)).map((o) => o.label);
  }, [resumes]);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await resumesApi.getAll();
      setResumes(data || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (r: Resume) => {
    if (!confirm(`Delete resume for ${formatJobRole(r.jobRole)}?`)) return;
    try {
      await resumesApi.delete(r.id);
      toast.success("Resume deleted");
      fetchResumes();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete resume");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resume Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload one resume per job role. The correct resume will be attached automatically when you apply.
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <FileUp className="mr-2 h-4 w-4" /> Upload Resume
        </Button>
      </div>

      {missingRoles.length > 0 && (
        <div className="rounded-md border p-3 text-sm">
          <span className="font-medium">Missing roles:</span>{" "}
          <span className="text-muted-foreground">{missingRoles.join(", ")}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading resumes...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Resume Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No resumes uploaded yet.
                  </TableCell>
                </TableRow>
              ) : (
                resumes.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{formatJobRole(r.jobRole)}</TableCell>
                    <TableCell className="font-medium">{r.fileName}</TableCell>
                    <TableCell>
                      {r.updatedAt && !isNaN(new Date(r.updatedAt).getTime())
                        ? format(new Date(r.updatedAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumesApi.download(r.id, r.fileName)}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplaceTarget(r)}
                      >
                        Replace
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(r)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ResumeUploadModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onSuccess={fetchResumes}
      />

      <ResumeUploadModal
        open={!!replaceTarget}
        onOpenChange={(open) => {
          if (!open) setReplaceTarget(undefined);
        }}
        onSuccess={fetchResumes}
        resume={replaceTarget}
      />
    </div>
  );
}

