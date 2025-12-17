import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Inquiries", to: "/inquiries", icon: "📬" },
  { label: "Quotations", to: "/quotations", icon: "📝" },
  { label: "City", to: "/destinations", icon: "📍" },
  { label: "Standard Descriptions", to: "/standard-descriptions", icon: "📍" },
  { label: "Hotels", to: "/hotels", icon: "🏨" },
  { label: "Excursions", to: "/excursions", icon: "🌄" },
  { label: "Customers", to: "/customers", icon: "👥" },
  { label: "Users", to: "/users", icon: "⚙️" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="
      bg-white border-r border-ti-sky shadow-sm
      h-screen sticky top-0
      transition-all duration-300
      flex flex-col
      "
      style={{ width: collapsed ? "80px" : "240px" }}
    >
      {/* Collapse Button */}
      <div className="h-16 flex items-center justify-between px-4">
        {!collapsed && (
          <div className="text-ti-forest text-xl grow text-center">
            Menu
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-ti-forest hover:text-ti-teal text-xl leading-none transition"
        >
          {collapsed ? "›" : "‹"}
        </button>

      </div>

      {/* Nav Items */}
      <div className="flex-1 mt-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-5 py-3
              text-ti-forest
              hover:bg-ti-sky/70 hover:text-ti-teal
              transition rounded-lg mx-3 mb-1
              ${isActive ? "bg-ti-sky text-ti-teal font-semibold" : ""}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
