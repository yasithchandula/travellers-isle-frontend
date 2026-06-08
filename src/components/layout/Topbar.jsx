import { Link } from "react-router-dom";
import logo from "/logo.png";

import { Bell, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { logoutAuth } from "@/api/auth";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Travellers Isle" className="h-10" />
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1">
                <Badge className="h-2.5 w-2.5 rounded-full bg-destructive p-0" />
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              Notifications
            </DropdownMenuLabel>

            <Separator />

            <div className="max-h-64 overflow-auto py-2 space-y-2">
              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                New inquiry received from <b>George</b>
              </div>

              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                Quotation <b>#Q-102</b> marked as Urgent
              </div>

              <div className="rounded-md bg-muted px-3 py-2 text-sm">
                Follow-up due for <b>Family Tour</b>
              </div>
            </div>

            <Separator />

            <DropdownMenuItem asChild>
              <Link to="/notifications" className="w-full justify-center">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full">
              <Avatar className="h-10 w-10 bg-accent">
                <AvatarFallback className="font-semibold text-primary">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuItem
              onClick={() => logoutAuth()}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
