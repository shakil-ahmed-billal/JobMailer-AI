"use client";

import { format } from "date-fns";
import { Mail, Reply, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EmailPreview } from "@/components/emails/email-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { emailsApi } from "@/lib/api/emails";
import { Email } from "@/types";

export default function MessagesPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const data = await emailsApi.getAll();
        const emailList = Array.isArray(data)
          ? data
          : ((data as any)?.data ?? []);
        setEmails(emailList);
        setFilteredEmails(emailList);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    let result = emails;

    if (search) {
      result = result.filter(
        (email) =>
          email.subject.toLowerCase().includes(search.toLowerCase()) ||
          email.content.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter((email) => email.emailType === typeFilter);
    }

    setFilteredEmails(result);
  }, [search, typeFilter, emails]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subjects or content..."
              className="pl-8 w-full md:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="APPLICATION">Applications</SelectItem>
            <SelectItem value="REPLY">Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-10">Loading messages...</div>
        ) : filteredEmails.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No messages found.
          </div>
        ) : (
          filteredEmails.map((email) => (
            <Card
              key={email.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleEmailClick(email)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div
                    className={`p-2 rounded-full ${email.emailType === "APPLICATION" ? "bg-primary/10" : "bg-secondary"}`}
                  >
                    {email.emailType === "APPLICATION" ? (
                      <Mail className="h-4 w-4 text-primary" />
                    ) : (
                      <Reply className="h-4 w-4 text-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {email.subject}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[500px]">
                      {email.content.substring(0, 100)}...
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant="outline">{email.status}</Badge>
                  <div className="text-xs text-muted-foreground">
                    {email.createdAt &&
                    !isNaN(new Date(email.createdAt).getTime())
                      ? format(new Date(email.createdAt), "MMM d, h:mm a")
                      : "—"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EmailPreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        email={selectedEmail}
      />
    </div>
  );
}
