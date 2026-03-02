"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        {/*
          Override sidebar CSS variables to match brand purple palette.
          These cascade into all sidebar sub-components automatically.
        */}
        <style>{`
          :root {
            /* Brand-purple sidebar tokens */
            --sidebar: hsl(0 0% 98%);
            --sidebar-foreground: hsl(240 5.3% 26.1%);
            --sidebar-primary: hsl(262.1 83.3% 57.8%);
            --sidebar-primary-foreground: hsl(0 0% 100%);
            --sidebar-accent: hsl(262 30% 94%);
            --sidebar-accent-foreground: hsl(262 50% 25%);
            --sidebar-border: hsl(220 13% 91%);
            --sidebar-ring: hsl(262.1 83.3% 57.8%);
          }
          .dark {
            --sidebar: hsl(240 6% 9%);
            --sidebar-foreground: hsl(240 4.8% 90%);
            --sidebar-primary: hsl(262.1 70% 60%);
            --sidebar-primary-foreground: hsl(0 0% 100%);
            --sidebar-accent: hsl(262 20% 16%);
            --sidebar-accent-foreground: hsl(262 50% 85%);
            --sidebar-border: hsl(240 5% 14%);
            --sidebar-ring: hsl(262.1 70% 60%);
          }
        `}</style>

        <AppSidebar />

        <SidebarInset className="bg-background">
          <Header />
          <main className="flex flex-1 flex-col gap-4 min-h-[calc(100vh-4rem)]">
            {/* Subtle background texture */}
            <div
              className="pointer-events-none fixed inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(262.1 83.3% 57.8%) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}