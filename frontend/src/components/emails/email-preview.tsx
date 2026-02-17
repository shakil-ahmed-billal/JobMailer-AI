"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Email } from "@/types";
import { format } from "date-fns";

interface EmailPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: Email | null;
}

export function EmailPreview({ open, onOpenChange, email }: EmailPreviewProps) {
  if (!email) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle>{email.subject}</DialogTitle>
            <Badge
              variant={
                email.emailType === "APPLICATION" ? "default" : "secondary"
              }
            >
              {email.emailType}
            </Badge>
          </div>
          <DialogDescription>
            Sent on {format(new Date(email.createdAt), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 border rounded-md bg-muted/20 whitespace-pre-wrap font-sans text-sm">
          {email.content}
        </div>

        <div className="mt-2 text-xs text-muted-foreground flex justify-end">
          Status: {email.status}
        </div>
      </DialogContent>
    </Dialog>
  );
}
