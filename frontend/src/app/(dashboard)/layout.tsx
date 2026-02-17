"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/lib/auth/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <div className="hidden border-r md:block md:w-64 lg:w-72 bg-muted/20">
          <Sidebar className="h-full" />
        </div>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
