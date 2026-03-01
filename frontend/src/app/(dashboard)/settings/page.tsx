"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/lib/auth/auth-context";
import {
  Bell,
  Settings as SettingsIcon,
  Shield,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-3 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card
          className="hover:bg-accent/50 transition-colors cursor-pointer"
          asChild
        >
          <Link href="/profile">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <UserCircle className="size-6" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and bio
                </CardDescription>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <Bell className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive alerts
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <Shield className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and sessions
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <SettingsIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customization and theme settings
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <p>
          Your account is managed by <strong>JobMailer AI</strong>. For any
          security or subscription concerns, please contact support.
        </p>
      </div>
    </div>
  );
}
