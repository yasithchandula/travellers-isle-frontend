import { NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Mail,
  FileText,
  MapPin,
  BookOpen,
  Hotel,
  Mountain,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { logoutAuth } from "@/api/auth";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inquiries", to: "/inquiries", icon: Mail },
  { label: "Quotations", to: "/quotations", icon: FileText },

  { divider: true, label: "Content" },

  { label: "Cities", to: "/destinations", icon: MapPin },
  { label: "Standard Descriptions", to: "/standard-descriptions", icon: BookOpen },
  { label: "Hotels", to: "/hotels", icon: Hotel },
  { label: "Excursions", to: "/excursions", icon: Mountain },

  { divider: true, label: "Management" },

  { label: "Customers", to: "/customers", icon: Users },
  { label: "Users", to: "/users", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutAuth();
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[78px]" : "w-[270px]"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              TI
            </div>
            Travellers Isle
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 transition hover:bg-muted"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item, i) => {
          if (item.divider) {
            return !collapsed ? (
              <div
                key={i}
                className="px-3 pb-1 pt-4 text-xs font-semibold uppercase text-muted-foreground"
              >
                {item.label}
              </div>
            ) : null;
          }

          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive &&
                    "bg-primary/10 text-primary"
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
