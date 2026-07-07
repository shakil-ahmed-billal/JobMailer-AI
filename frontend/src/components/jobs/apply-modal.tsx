"use client";

import { Loader2, Send, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { emailsApi } from "@/lib/api/emails";
import { useAuthContext } from "@/lib/auth/auth-context";
import { formatJobRole } from "@/lib/job-roles";
import { AIProvider, Job } from "@/types";

interface ApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onSuccess: () => void;
}

const inputCls = "h-10 rounded-xl border-border/60 bg-muted/30 text-sm focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70";

export function ApplyModal({ open, onOpenChange, job, onSuccess }: ApplyModalProps) {
  const { user } = useAuthContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending]       = useState(false);
  const [aiProvider, setAiProvider]     = useState<AIProvider>("OPENAI");
  const [subject, setSubject]           = useState(`Application for ${job.jobTitle} - ${user?.name}`);
  const [content, setContent]           = useState("");

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const response = await emailsApi.generate(job.id, aiProvider);
      setSubject(response.subject);
      setContent(response.content);
      toast.success(`Email generated with ${aiProvider === "OPENAI" ? "ChatGPT" : "Gemini"}!`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await emailsApi.send({ jobId: job.id, subject, content, emailType: "APPLICATION", aiProvider });
      toast.success("Application sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border/60 shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
          <div className="flex items-center gap-3 px-6 py-5 bg-muted/20 border-b border-border/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-200/50 dark:border-violet-800/40">
              <Zap className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight">
                Apply to {job.companyName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Generate an AI-powered email for the {job.jobTitle} position
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Job context strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">Recipient</p>
              <p className="text-sm font-medium truncate">{job.companyEmail}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">Job Role</p>
              <p className="text-sm font-medium truncate">{formatJobRole(job.jobRole)}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Subject Line</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>

          {/* AI provider + generate */}
          <div className="rounded-xl border border-violet-200/50 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-900/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">AI Email Generator</p>
              </div>
              <Select value={aiProvider} onValueChange={(v) => setAiProvider(v as AIProvider)} disabled={isGenerating}>
                <SelectTrigger className="w-[130px] h-8 rounded-lg border-violet-200/60 dark:border-violet-800/40 bg-white dark:bg-background text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="OPENAI" className="text-sm rounded-lg">ChatGPT</SelectItem>
                  <SelectItem value="GEMINI" className="text-sm rounded-lg">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerateEmail}
              disabled={isGenerating}
              className="w-full h-9 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20 gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="h-3.5 w-3.5" /> Generate Application Email</>
              )}
            </Button>
          </div>

          {/* Email content */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Email Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder={`Click "Generate Application Email" above to create your personalized email, or write your own here...`}
              className="rounded-xl border-border/60 bg-muted/30 text-sm font-mono resize-none focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/40 leading-6"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-sm rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending || !content} size="sm"
              className="h-9 px-5 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20 gap-2">
              {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}