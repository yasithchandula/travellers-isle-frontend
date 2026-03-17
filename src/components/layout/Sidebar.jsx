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
        "h-screen sticky top-0 flex flex-col border-r bg-white/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[78px]" : "w-[270px]"
      )}
    >
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2 font-semibold text-ti-forest">
            <div className="h-8 w-8 rounded-lg bg-ti-teal text-white flex items-center justify-center text-sm font-bold">
              TI
            </div>
            Travellers Isle
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 hover:bg-muted transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item, i) => {
          if (item.divider) {
            return !collapsed ? (
              <div
                key={i}
                className="pt-4 pb-1 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
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
                    "bg-ti-sky text-ti-teal shadow-sm"
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* ACTIVE INDICATOR */}
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-ti-teal opacity-0 group-[.active]:opacity-100"></span>
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}