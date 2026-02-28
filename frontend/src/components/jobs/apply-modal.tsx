"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export function ApplyModal({
  open,
  onOpenChange,
  job,
  onSuccess,
}: ApplyModalProps) {
  const { user } = useAuthContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>("OPENAI");

  const [subject, setSubject] = useState(
    `Application for ${job.jobTitle} - ${user?.name}`,
  );
  const [content, setContent] = useState("");

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const response = await emailsApi.generate(job.id, aiProvider);
      setSubject(response.subject);
      setContent(response.content);
      toast.success(
        `Email generated successfully using ${aiProvider === "OPENAI" ? "ChatGPT" : "Gemini"}!`,
      );
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await emailsApi.send({
        jobId: job.id,
        subject,
        content,
        emailType: "APPLICATION",
        aiProvider,
      });
      toast.success("Application sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to {job.companyName}</DialogTitle>
          <DialogDescription>
            Generate and send an AI-powered application email for the{" "}
            {job.jobTitle} position.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs uppercase font-semibold">
                Recipient:
              </span>
              <span className="font-medium truncate">{job.companyEmail}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs uppercase font-semibold">
                Job Role:
              </span>
              <span className="font-medium">{formatJobRole(job.jobRole)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Label htmlFor="content">Email Content</Label>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  value={aiProvider}
                  onValueChange={(value) => setAiProvider(value as AIProvider)}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="flex-1 sm:w-[120px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPENAI">ChatGPT</SelectItem>
                    <SelectItem value="GEMINI">Gemini</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateEmail}
                  disabled={isGenerating}
                  className="h-9 flex-1 sm:flex-none px-3"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[250px] sm:min-h-[300px] font-mono text-sm leading-relaxed"
              placeholder="Click 'Generate' to create your application email..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending || !content}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isSending && <Send className="mr-2 h-4 w-4" />}
            Send Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
