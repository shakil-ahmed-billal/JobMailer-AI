"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { EmailPreview } from "@/components/emails/email-preview";
import { EmailTable } from "@/components/emails/email-table";
import { EmailTableSkeleton } from "@/components/emails/email-table-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { swrFetcher } from "@/lib/api/client";
import { emailsApi } from "@/lib/api/emails";
import { Email, PaginatedResponse } from "@/types";

export default function MessagesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    if (typeFilter !== "ALL") params.append("emailType", typeFilter);
    // Note: Search might be better handled client-side if the API doesn't support it,
    // but the backend support for it in getEmails wasn't added yet.
    // However, the user asked for pagination, so we should fetch by page.
    params.append("page", String(currentPage));
    params.append("limit", "10");
    return `/emails?${params.toString()}`;
  }, [currentPage, typeFilter]);

  const {
    data: rawResponse,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<Email>>(swrKey, swrFetcher, {
    keepPreviousData: true,
  });

  const emails = useMemo(() => {
    if (!rawResponse) return [];
    const baseData = Array.isArray(rawResponse)
      ? rawResponse
      : rawResponse.data;

    if (search) {
      return baseData.filter(
        (email) =>
          email.subject.toLowerCase().includes(search.toLowerCase()) ||
          email.content.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return baseData;
  }, [rawResponse, search]);

  const totalPages =
    rawResponse && !Array.isArray(rawResponse)
      ? rawResponse.meta?.totalPages || 1
      : 1;

  const totalItems =
    rawResponse && !Array.isArray(rawResponse)
      ? rawResponse.meta?.total || 0
      : emails.length;

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsPreviewOpen(true);
  };

  const handleDeleteEmail = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);
    try {
      await emailsApi.delete(id);
      toast.success("Message deleted successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
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
        <Select
          value={typeFilter}
          onValueChange={(val) => {
            setTypeFilter(val);
            setCurrentPage(1);
          }}
        >
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

      {isLoading && !emails.length ? (
        <EmailTableSkeleton />
      ) : (
        <div className="space-y-4">
          <EmailTable
            emails={emails}
            onDelete={handleDeleteEmail}
            onView={handleEmailClick}
            deletingId={deletingId}
          />

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {emails.length} of {totalItems} messages
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <EmailPreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        email={selectedEmail}
      />
    </div>
  );
}
