"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

function UserAvatar() {
  const { user } = useUser();
  const initials = user.avatarInitials || user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
      {initials}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  return (
    <nav className="flex h-16 items-center justify-between border-b bg-background/50 px-8 backdrop-blur-xl">
      <div className="flex w-full max-w-sm items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search incidents, logs, services..."
            className="w-full bg-accent/50 pl-9 focus-visible:ring-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <DropdownMenu>
          
          <DropdownMenuTrigger>
              <div className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent cursor-pointer">
                <User className="h-5 w-5" />
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
