"use client";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export function ProfileMenu({ name = "Ananya Rao", email = "ananya@quickcore.app" }: { name?: string; email?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="flex items-center gap-1">
      <ThemeSwitcher />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="Open profile menu" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/45">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="normal-case">
            <p className="text-sm font-medium text-text-primary">{name}</p>
            <p className="text-xs font-normal text-text-muted">{email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile"><User className="h-4 w-4" /> Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings"><Settings className="h-4 w-4" /> Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help"><HelpCircle className="h-4 w-4" /> Help</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login"><LogOut className="h-4 w-4" /> Log out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
