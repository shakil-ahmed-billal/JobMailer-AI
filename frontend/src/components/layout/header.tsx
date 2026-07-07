"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthContext } from "@/lib/auth/auth-context";
import { ModeToggle } from "@/theme/ModeToggle";
import { Bell, LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuthContext();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <header className="relative flex h-16 shrink-0 items-center gap-2 border-b border-border/60 px-4 bg-background/80 backdrop-blur-xl">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200" />

      {/* Vertical separator */}
      <div className="h-5 w-px bg-border/70 mx-1" />

      {/* Breadcrumb / Page context - optional slot */}
      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-2">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-background" />
        </Button>

        <ModeToggle />

        {/* Divider */}
        <div className="h-5 w-px bg-border/70 mx-1" />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-violet-500/30 transition-all duration-200 p-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-700 text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 p-2 shadow-xl border-border/60"
            align="end"
            forceMount
            sideOffset={8}
          >
            {/* User info card */}
            <div className="flex items-center gap-3 p-2 mb-1 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/10">
              <Avatar className="h-10 w-10 ring-2 ring-violet-500/30">
                <AvatarImage src="/avatars/user.jpg" alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-700 text-white text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-semibold leading-none truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge
                  variant="secondary"
                  className="mt-1 w-fit text-[10px] py-0 px-1.5 h-4 bg-violet-500/15 text-violet-600 dark:text-violet-400 border-0"
                >
                  Pro Plan
                </Badge>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-border/50" />

            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer h-9 px-2 gap-2 hover:bg-accent/80 focus:bg-accent/80 transition-colors"
            >
              <Link href="/profile">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">View Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer h-9 px-2 gap-2 hover:bg-accent/80 focus:bg-accent/80 transition-colors"
            >
              <Link href="/settings">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border/50" />

            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg cursor-pointer h-9 px-2 gap-2 text-rose-500 hover:text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}