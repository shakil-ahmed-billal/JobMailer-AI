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
      toast.success(`Email generated successfully using ${aiProvider === "OPENAI" ? "ChatGPT" : "Gemini"}!`);
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
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Recipient:</span>{" "}
              {job.companyEmail}
            </div>
            <div>
              <span className="font-semibold">Job Role:</span>{" "}
              {formatJobRole(job.jobRole)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="content">Email Content</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={aiProvider}
                  onValueChange={(value) => setAiProvider(value as AIProvider)}
                  disabled={isGenerating}
                >
                  <SelectTrigger className="w-[140px] h-8">
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
                  className="h-8"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-3 w-3" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Click 'Generate with AI' to create your application email..."
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
