"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jobsApi } from "@/lib/api/jobs";
import { JOB_ROLE_OPTIONS } from "@/lib/job-roles";
import { Job } from "@/types";

const jobSchema = z.object({
  companyName:    z.string().min(1, "Company name is required"),
  jobTitle:       z.string().min(1, "Job title is required"),
  companyEmail:   z.string().email("Valid email is required"),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  jobRole: z.enum([
    "FRONTEND_DEVELOPER","FRONTEND_ENGINEER","BACKEND_DEVELOPER","BACKEND_ENGINEER",
    "MERN_STACK_DEVELOPER","FULL_STACK_DEVELOPER","SOFTWARE_ENGINEER","CMS_DEVELOPER",
  ]),
  status:   z.enum(["DRAFT","APPLIED","INTERVIEW","REJECTED","OFFER"]),
  salary:   z.string().optional(),
  location: z.string().optional(),
  notes:    z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  job?: Job;
}

const inputCls = "h-10 rounded-xl border-border/60 bg-muted/30 text-sm focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all placeholder:text-muted-foreground/50";
const selectTriggerCls = "h-10 rounded-xl border-border/60 bg-muted/30 text-sm focus:ring-violet-500/30 focus:border-violet-500/50";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70";

export function JobForm({ open, onOpenChange, onSuccess, job }: JobFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!job;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyName: job?.companyName || "", jobTitle: job?.jobTitle || "",
      companyEmail: job?.companyEmail || "", jobDescription: job?.jobDescription || "",
      jobRole: job?.jobRole || "SOFTWARE_ENGINEER", status: (job?.status as any) || "DRAFT",
      salary: job?.salary || "", location: job?.location || "", notes: job?.notes || "",
    },
  });

  useEffect(() => {
    if (job && open) {
      form.reset({
        companyName: job.companyName, jobTitle: job.jobTitle,
        companyEmail: job.companyEmail, jobDescription: job.jobDescription,
        jobRole: job.jobRole, status: job.status as any,
        salary: job.salary || "", location: job.location || "", notes: job.notes || "",
      });
    } else if (!job && open) {
      form.reset({
        companyName: "", jobTitle: "", companyEmail: "", jobDescription: "",
        jobRole: "SOFTWARE_ENGINEER", status: "DRAFT",
        salary: "", location: "", notes: "",
      });
    }
  }, [job, open, form]);

  async function onSubmit(data: JobFormValues) {
    setIsLoading(true);
    try {
      if (isEditing && job) {
        await jobsApi.update(job.id, data);
        toast.success("Job updated successfully");
      } else {
        await jobsApi.create({ ...data, applyStatus: "NOT_APPLIED", responseStatus: "NO_RESPONSE", emailSendStatus: "NOT_SENT" });
        toast.success("Job created successfully");
      }
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error("Failed to save job");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border/60 shadow-2xl">

        {/* Modal header with gradient accent */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
          <div className="flex items-center gap-3 px-6 py-5 bg-muted/20 border-b border-border/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/40">
              <Briefcase className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight">
                {isEditing ? "Edit Job" : "Add New Job"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing ? "Update the details for this job application." : "Fill in the details to start tracking this opportunity."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">

            {/* Row 1: Company + Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Company Name</FormLabel>
                  <FormControl><Input placeholder="Acme Inc." className={inputCls} {...field} /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
              <FormField control={form.control} name="jobTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Job Title</FormLabel>
                  <FormControl><Input placeholder="Frontend Developer" className={inputCls} {...field} /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
            </div>

            {/* Row 2: Role */}
            <FormField control={form.control} name="jobRole" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Job Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={selectTriggerCls}>
                      <SelectValue placeholder="Select job role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/60">
                    {JOB_ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="rounded-lg text-sm">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Row 3: Email */}
            <FormField control={form.control} name="companyEmail" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Company Email</FormLabel>
                <FormControl><Input placeholder="hr@acme.com" className={inputCls} {...field} /></FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Row 4: Status + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/60">
                      {["DRAFT","APPLIED","INTERVIEW","OFFER","REJECTED"].map(s => (
                        <SelectItem key={s} value={s} className="rounded-lg text-sm capitalize">{s.charAt(0)+s.slice(1).toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Location</FormLabel>
                  <FormControl><Input placeholder="Remote / New York" className={inputCls} {...field} /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
            </div>

            {/* Row 5: Salary */}
            <FormField control={form.control} name="salary" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Salary Range <span className="normal-case font-normal text-muted-foreground/50">(optional)</span></FormLabel>
                <FormControl><Input placeholder="$80k – $100k" className={inputCls} {...field} /></FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Row 6: Description */}
            <FormField control={form.control} name="jobDescription" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Job Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Paste the full job description here..." rows={5}
                    className="rounded-xl border-border/60 bg-muted/30 text-sm resize-none focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Row 7: Notes */}
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Notes <span className="normal-case font-normal text-muted-foreground/50">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Your private notes about this opportunity..."
                    className="rounded-xl border-border/60 bg-muted/30 text-sm resize-none focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )} />

            {/* Footer actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button type="button" variant="ghost" size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-sm rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} size="sm"
                className="h-9 px-5 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20">
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                {isEditing ? "Update Job" : "Create Job"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}