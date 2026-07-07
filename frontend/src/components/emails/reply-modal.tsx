"use client";

import { Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
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
import { AIProvider } from "@/types";

interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailId?: string;
  jobId: string;
  companyEmail: string;
  companyName: string;
  onSuccess: () => void;
}

const inputCls = "h-10 rounded-xl border-border/60 bg-muted/30 text-sm focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/50";
const labelCls = "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70";

export function ReplyModal({
  open, onOpenChange, jobId, emailId, companyEmail, companyName, onSuccess,
}: ReplyModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending]       = useState(false);
  const [aiProvider, setAiProvider]     = useState<AIProvider>("OPENAI");
  const [instruction, setInstruction]   = useState("");
  const [subject, setSubject]           = useState(`Re: Application for ${companyName}`);
  const [content, setContent]           = useState("");

  const handleGenerateReply = async () => {
    if (!instruction) { toast.error("Please enter instructions for the AI"); return; }
    if (!emailId)     { toast.error("Email ID is required"); return; }
    setIsGenerating(true);
    try {
      const response = await emailsApi.generateReply(emailId, instruction, aiProvider);
      if (response.subject) setSubject(response.subject);
      setContent(response.content);
      toast.success(`Reply generated with ${aiProvider === "OPENAI" ? "ChatGPT" : "Gemini"}!`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to generate reply");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    setIsSending(true);
    try {
      await emailsApi.send({ jobId, subject, content, emailType: "REPLY", aiProvider });
      toast.success("Reply sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-border/60 shadow-2xl">

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-purple-500" />
          <div className="flex items-center gap-3 px-6 py-5 bg-muted/20 border-b border-border/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/10 border border-sky-200/50 dark:border-sky-800/40">
              <MessageSquare className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold tracking-tight">
                Reply to {companyName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Generate an AI-powered response · sending to {companyEmail}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* AI instruction block */}
          <div className="rounded-xl border border-violet-200/50 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-900/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">AI Instruction</p>
            </div>

            <Input
              placeholder="E.g., Accept the interview offer for next Tuesday at 10 AM…"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="h-10 rounded-xl border-violet-200/60 dark:border-violet-800/40 bg-white dark:bg-background/50 text-sm focus-visible:ring-violet-500/30 placeholder:text-muted-foreground/50"
            />

            <div className="flex items-center gap-2">
              <Select value={aiProvider} onValueChange={(v) => setAiProvider(v as AIProvider)} disabled={isGenerating}>
                <SelectTrigger className="flex-1 h-9 rounded-xl border-violet-200/60 dark:border-violet-800/40 bg-white dark:bg-background/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="OPENAI" className="text-sm rounded-lg">ChatGPT</SelectItem>
                  <SelectItem value="GEMINI" className="text-sm rounded-lg">Gemini</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerateReply}
                disabled={isGenerating || !instruction}
                className="flex-1 h-9 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20 gap-2"
              >
                {isGenerating ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Generate Reply</>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                Email Preview
              </span>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label className={labelCls}>Email Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={9}
              placeholder="Your generated reply will appear here. You can edit it before sending…"
              className="rounded-xl border-border/60 bg-muted/30 text-sm resize-none focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 placeholder:text-muted-foreground/40 leading-6"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-sm rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={isSending || !content} size="sm"
              className="h-9 px-5 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-md shadow-violet-500/20 gap-2">
              {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}