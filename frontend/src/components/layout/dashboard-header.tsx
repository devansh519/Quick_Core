"use client";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/layout/notification-center";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Breadcrumb, type BreadcrumbSegment } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

export function DashboardHeader({
  breadcrumbs,
  searchPlaceholder = "Search",
}: {
  breadcrumbs: BreadcrumbSegment[];
  searchPlaceholder?: string;
}) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border-default bg-bg-canvas px-4 md:px-6">
      <Breadcrumb segments={breadcrumbs} />
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <Input placeholder={searchPlaceholder} className="w-56 pl-8" aria-label={searchPlaceholder} />
        </div>
        <NotificationCenter />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Open AI assistant">
                <Sparkles className="h-4 w-4 text-insight-amber" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>AI Assistant (coming soon)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ProfileMenu />
      </div>
    </header>
  );
}
