"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilters as FilterType } from "@/lib/api/jobs";

interface JobFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const handleChange = (key: keyof FilterType, value: string) => {
    onFilterChange({ ...filters, [key]: value === "ALL" ? undefined : value });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Search jobs..."
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filters.status || "ALL"}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.applyStatus || "ALL"}
          onValueChange={(value) => handleChange("applyStatus", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Apply Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Application</SelectItem>
            <SelectItem value="NOT_APPLIED">Not Applied</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
