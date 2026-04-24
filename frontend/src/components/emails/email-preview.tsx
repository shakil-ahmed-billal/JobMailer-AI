import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Email } from "@/types";
import { format } from "date-fns";
import { Building2, ExternalLink, Mail, MapPin } from "lucide-react";
import Link from "next/link";

interface EmailPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: Email | null;
}

export function EmailPreview({ open, onOpenChange, email }: EmailPreviewProps) {
  if (!email) return null;

  const job = (email as any).job;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between mr-8">
            <DialogTitle className="text-xl font-bold">
              {email.subject}
            </DialogTitle>
            <Badge
              variant={
                email.emailType === "APPLICATION" ? "default" : "secondary"
              }
              className="ml-2 capitalize"
            >
              {email.emailType.toLowerCase()}
            </Badge>
          </div>
          <DialogDescription>
            Sent on {format(new Date(email.createdAt), "PPpp")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
          {/* Email Content */}
          <div className="p-4 border rounded-lg bg-muted/30 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
            {email.content}
          </div>

          {/* Job/Recipient Info Context */}
          {job && (
            <div className="p-4 border rounded-lg bg-secondary/10 space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5" /> Job Context
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Company:
                  </span>
                  <span className="font-semibold">{job.companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{job.companyEmail}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Status:
                  </span>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {email.status}
                  </Badge>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link href={`/jobs/${job.id}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Full Job Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
