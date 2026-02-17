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
import { Textarea } from "@/components/ui/textarea";
import { emailsApi } from "@/lib/api/emails";

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

  const [instruction, setInstruction] = useState("");
  const [subject, setSubject] = useState(`Re: Application for ${companyName}`);
  const [content, setContent] = useState("");

  const handleGenerateReply = async () => {
    if (!instruction) {
      toast.error("Please enter instructions for the AI");
      return;
    }
    setIsGenerating(true);
    try {
      // Mock call or real API
      const response = await emailsApi.generateReply(
        "mock-email-id",
        instruction,
      );
      if (response.subject) setSubject(response.subject);
      setContent(response.content);
      toast.success("Reply generated successfully!");
    } catch (error) {
      toast.error("Failed to generate reply");
      setContent(
        `Dear Hiring Manager,\n\nThank you for your response. regarding "${instruction}"...\n\nSincerely,\n[Your Name]`,
      );
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
        to: companyEmail,
      });
      toast.success("Reply sent successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to send reply");
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
