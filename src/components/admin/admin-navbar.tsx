"use client"

import Link from "next/link"
import { Bell, Search, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminNavbarProps {
  user: { name: string | null; email: string }
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-background">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            M4vx<span className="text-muted-foreground ml-1 text-sm font-normal">Admin</span>
          </Link>
          <div className="hidden md:flex relative max-w-xs" role="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." aria-label="Search admin" className="pl-10 h-9 text-sm w-64" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm">{user.name ?? user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <User className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Back to Store
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
