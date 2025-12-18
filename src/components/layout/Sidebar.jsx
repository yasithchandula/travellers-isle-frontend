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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inquiries", to: "/inquiries", icon: Mail },
  { label: "Quotations", to: "/quotations", icon: FileText },
  { label: "City", to: "/destinations", icon: MapPin },
  { label: "Standard Descriptions", to: "/standard-descriptions", icon: BookOpen },
  { label: "Hotels", to: "/hotels", icon: Hotel },
  { label: "Excursions", to: "/excursions", icon: Mountain },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Users", to: "/users", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <span className="text-lg font-semibold text-ti-forest">
            Travellers Isle
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 hover:bg-ti-sky transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-ti-forest" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-ti-forest" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                  "text-ti-forest hover:bg-ti-sky hover:text-ti-teal",
                  isActive && "bg-ti-sky text-ti-teal"
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
    </aside>
  );
}
