import { Link } from "react-router-dom";
import logo from "/logo.png";

import { Bell, LogOut, Settings, User } from "lucide-react";

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

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-ti-sky px-6 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Travellers Isle" className="h-10" />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔔 Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-ti-forest" />
              <span className="absolute -top-1 -right-1">
                <Badge className="h-2.5 w-2.5 p-0 bg-ti-red rounded-full" />
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-serif text-ti-forest">
              Notifications
            </DropdownMenuLabel>

            <Separator />

            <div className="max-h-64 overflow-auto py-2 space-y-2">
              <div className="px-3 py-2 rounded-lg bg-ti-sky/40 text-sm">
                New inquiry received from <b>George</b>
              </div>

              <div className="px-3 py-2 rounded-lg bg-ti-sky/40 text-sm">
                Quotation <b>#Q-102</b> marked as Urgent
              </div>

              <div className="px-3 py-2 rounded-lg bg-ti-sky/40 text-sm">
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

        {/* 👤 User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full">
              <Avatar className="h-10 w-10 bg-ti-mint">
                <AvatarFallback className="text-ti-forest font-semibold">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-serif">User Name</div>
              <div className="text-xs text-muted-foreground">
                user@example.com
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex gap-2">
                <User className="w-4 h-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/preferences" className="flex gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("Logout")}
              className="text-ti-red focus:text-ti-red"
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
