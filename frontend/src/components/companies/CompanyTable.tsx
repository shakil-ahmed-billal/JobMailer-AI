"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { companiesApi } from "@/lib/api/companies";
import { TopCompany } from "@/types";
import { ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CompanyTableProps {
  companies: TopCompany[];
  onEdit: (company: TopCompany) => void;
  onDeleted: () => void;
  startIndex?: number;
}

export function CompanyTable({
  companies,
  onEdit,
  onDeleted,
  startIndex = 0,
}: CompanyTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await companiesApi.delete(deletingId);
      toast.success("Company deleted successfully");
      onDeleted();
    } catch {
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-700/10 mb-4 border border-violet-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No companies yet
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Start building your list of top companies to target in your job
          search.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground w-[50px]">
                #
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground hidden sm:table-cell">
                Company Type
              </TableHead>
              <TableHead className="font-semibold text-foreground hidden md:table-cell">
                Web Link
              </TableHead>
              <TableHead className="font-semibold text-foreground hidden lg:table-cell">
                Location
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow
                key={company.id}
                className="group transition-colors hover:bg-muted/20"
              >
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-violet-500/20 shrink-0">
                      <span className="text-xs font-bold text-violet-400">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {company.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {company.company ? (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {company.company}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {company.webLink ? (
                    <a
                      href={company.webLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {company.webLink.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {company.location ? (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                      {company.location}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-violet-500/10 hover:text-violet-400"
                      onClick={() => onEdit(company)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => setDeletingId(company.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
