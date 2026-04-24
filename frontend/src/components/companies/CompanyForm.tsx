"use client";

import { companiesApi } from "@/lib/api/companies";
import { TopCompany } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const COMPANY_TYPES = [
  "Product",
  "Service",
  "Software House",
  "IT Consultancy",
  "Outsourcing",
  "Startup",
  "E-Commerce",
  "Fintech",
  "Healthtech",
  "Edtech",
  "Agency",
  "Multinational",
  "Other",
] as const;

const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  webLink: z.string().url("Invalid web link").optional().or(z.literal("")),
  location: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  company?: TopCompany;
}

export function CompanyForm({
  open,
  onOpenChange,
  onSuccess,
  company,
}: CompanyFormProps) {
  const isEditing = !!company;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      company: "",
      webLink: "",
      location: "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        company: company.company || "",
        webLink: company.webLink || "",
        location: company.location || "",
      });
    } else {
      form.reset({
        name: "",
        company: "",
        webLink: "",
        location: "",
      });
    }
  }, [company, form, open]);

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      if (isEditing && company) {
        await companiesApi.update(company.id, values);
        toast.success("Company updated successfully");
      } else {
        await companiesApi.create(values);
        toast.success("Company added successfully");
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(isEditing ? "Failed to update company" : "Failed to add company");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company" : "Add Top Company"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the company."
              : "Add a new company to your top list."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Vivasoft" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Type — Dropdown */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Web Link */}
            <FormField
              control={form.control}
              name="webLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Web Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update Company" : "Add Company"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
