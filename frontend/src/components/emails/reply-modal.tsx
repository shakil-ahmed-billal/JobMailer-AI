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
import { AIProvider } from "@/types";

interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // We need the ID of the email we are replying to, OR the job ID if it's a new thread
  // For simplicity based on requirements, assuming replying within a job context
  emailId?: string;
  jobId: string;
  companyEmail: string;
  companyName: string;
  onSuccess: () => void;
}

export function ReplyModal({
  open,
  onOpenChange,
  jobId,
  companyEmail,
  companyName,
  onSuccess,
}: ReplyModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>("OPENAI");

  const [instruction, setInstruction] = useState("");
  const [subject, setSubject] = useState(`Re: Application for ${companyName}`);
  const [content, setContent] = useState("");

  const handleGenerateReply = async () => {
    if (!instruction) {
      toast.error("Please enter instructions for the AI");
      return;
    }
    if (!emailId) {
      toast.error("Email ID is required");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await emailsApi.generateReply(
        emailId,
        instruction,
        aiProvider,
      );
      if (response.subject) setSubject(response.subject);
      setContent(response.content);
      toast.success(`Reply generated successfully using ${aiProvider === "OPENAI" ? "ChatGPT" : "Gemini"}!`);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to generate reply");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    setIsSending(true);
    try {
      await emailsApi.send({
        jobId,
        subject,
        content,
        emailType: "REPLY",
        aiProvider,
      });
      toast.success("Reply sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reply to {companyName}</DialogTitle>
          <DialogDescription>
            Generate an AI response based on your instructions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="instruction">AI Instruction</Label>
            <div className="flex gap-2">
              <Input
                id="instruction"
                placeholder="E.g., Accept the interview for next Tuesday at 10 AM..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <Select
                value={aiProvider}
                onValueChange={(value) => setAiProvider(value as AIProvider)}
                disabled={isGenerating}
              >
                <SelectTrigger className="w-[140px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPENAI">ChatGPT</SelectItem>
                  <SelectItem value="GEMINI">Gemini</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerateReply}
                disabled={isGenerating || !instruction}
                className="shrink-0"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendReply} disabled={isSending || !content}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Separator } from "@/components/ui/separator";
