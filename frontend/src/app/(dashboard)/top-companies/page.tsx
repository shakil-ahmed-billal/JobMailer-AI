"use client";

import { COMPANY_TYPES, CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyTable } from "@/components/companies/CompanyTable";
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
import { TopCompany, PaginatedResponse } from "@/types";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

const PAGE_SIZE = 10;

export default function TopCompaniesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<TopCompany | undefined>(undefined);

  // ── Filters & Pagination ──
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Build the SWR key — changes when any filter/page changes → triggers a new API request
  const swrKey = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(PAGE_SIZE));
    if (search) params.set("search", search);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (locationFilter) params.set("location", locationFilter);
    return `/companies?${params.toString()}`;
  }, [currentPage, search, typeFilter, locationFilter]);

  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR<PaginatedResponse<TopCompany>>(swrKey, swrFetcher, {
    keepPreviousData: true,
  });

  const companies = response?.data ?? [];
  const meta = response?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const hasActiveFilters = search || typeFilter !== "all" || locationFilter;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setLocationFilter("");
    setCurrentPage(1);
  };

  const handleSearchChange = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleTypeChange = (v: string) => { setTypeFilter(v); setCurrentPage(1); };
  const handleLocationChange = (v: string) => { setLocationFilter(v); setCurrentPage(1); };

  const handleEdit = (company: TopCompany) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };
  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingCompany(undefined);
  };

  return (
    <div className="flex-1 space-y-3 p-3 md:p-5">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-500/25">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Top Companies
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your curated list of top companies to target
            </p>
          </div>
        </div>
        <Button
          onClick={() => { setEditingCompany(undefined); setIsFormOpen(true); }}
          className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200 border-0"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* ── Stats Row ── */}
      {meta && meta.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 shrink-0">
              <Building2 className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{meta.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{meta.total}</p>
              <p className="text-xs text-muted-foreground">Matched</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {companies.filter((c) => c.webLink).length}
              </p>
              <p className="text-xs text-muted-foreground">With Links</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
              <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {companies.filter((c) => c.location).length}
              </p>
              <p className="text-xs text-muted-foreground">With Location</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">

        {/* ── Filters Bar ── */}
        <div className="p-4 border-b border-border/50 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, type or location…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {COMPANY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter by location…"
              value={locationFilter}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full sm:w-[180px]"
            />
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={resetFilters}
                className="shrink-0 border-border/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          {meta && (
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{meta.total}</span> companies
            </p>
          )}
        </div>

        {/* Table */}
        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="h-12 w-full rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <CompanyTable
              companies={companies}
              onEdit={handleEdit}
              onDeleted={() => mutate()}
              startIndex={(currentPage - 1) * PAGE_SIZE}
            />
          )}

          {/* ── Pagination Controls ── */}
          {!isLoading && meta && meta.totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-medium text-foreground">{meta.page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{meta.totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="gap-1.5 h-8 px-3 border-border/60 hover:bg-accent/70 hover:border-violet-500/30 disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                {/* Smart page pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "…" ? (
                        <span key={`el-${idx}`} className="px-1 text-muted-foreground text-xs">…</span>
                      ) : (
                        <Button
                          key={item}
                          variant={currentPage === item ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(item as number)}
                          className={`h-8 w-8 p-0 text-xs font-semibold transition-all ${
                            currentPage === item
                              ? "bg-gradient-to-r from-violet-600 to-purple-600 border-0 text-white shadow-sm"
                              : "border-border/60 hover:bg-accent/70 hover:border-violet-500/30"
                          }`}
                        >
                          {item}
                        </Button>
                      )
                    )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="gap-1.5 h-8 px-3 border-border/60 hover:bg-accent/70 hover:border-violet-500/30 disabled:opacity-40 transition-all"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Form Modal ── */}
      <CompanyForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSuccess={() => mutate()}
        company={editingCompany}
      />
    </div>
  );
}
