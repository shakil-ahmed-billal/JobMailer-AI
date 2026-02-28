"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Email } from "@/types";
import { format } from "date-fns";
import { Mail, Send } from "lucide-react";

interface EmailListProps {
  emails: Email[];
}

export function EmailList({ emails }: EmailListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Sent
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Sent Emails</CardTitle>
            <CardDescription>
              History of communications for this job.
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Mail className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No emails sent yet.
            </p>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-1">
                      {email.subject}
                    </p>
                    <div className="shrink-0">
                      {getStatusBadge(email.status)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs text-muted-foreground mt-1 gap-1">
                    <div className="flex items-center">
                      <Send className="mr-1 h-3 w-3 shrink-0" />
                      {email.emailType === "APPLICATION"
                        ? "Initial Application"
                        : "Reply"}
                    </div>
                    <span>
                      {format(new Date(email.createdAt), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2 bg-muted/30 p-2 rounded italic">
                    {email.content.substring(0, 150)}...
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
