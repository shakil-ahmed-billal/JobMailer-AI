"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Email } from "@/types";
import { format } from "date-fns";
import { Eye, Mail, Reply, Trash2 } from "lucide-react";

interface EmailTableProps {
  emails: Email[];
  onDelete: (id: string, e: React.MouseEvent) => void;
  onView: (email: Email) => void;
  deletingId: string | null;
}

export function EmailTable({
  emails,
  onDelete,
  onView,
  deletingId,
}: EmailTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            emails.map((email) => (
              <TableRow
                key={email.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onView(email)}
              >
                <TableCell>
                  <div
                    className={`p-2 w-fit rounded-full ${
                      email.emailType === "APPLICATION"
                        ? "bg-primary/10"
                        : "bg-secondary"
                    }`}
                  >
                    {email.emailType === "APPLICATION" ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <Reply className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-[250px] truncate">
                  {email.subject}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {(email as any).job?.companyName || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      email.status === "SENT" ? "default" : "destructive"
                    }
                  >
                    {email.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {email.createdAt &&
                  !isNaN(new Date(email.createdAt).getTime())
                    ? format(new Date(email.createdAt), "MMM d, h:mm a")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(email);
                      }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === email.id}
                      onClick={(e) => onDelete(email.id, e)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
