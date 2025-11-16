import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const menu = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/inquiries", label: "Inquiries", icon: "📥" },
    { to: "/customers", label: "Customers", icon: "👤" },
    { to: "/quotations", label: "Quotations", icon: "📄" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-20"
        } transition-all duration-200 p-4 bg-white shadow-md`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="text-xl font-semibold text-[#0e4b5a]"
          >
            Travellers Isle
          </Link>
          <button onClick={() => setOpen(!open)} className="text-xl">
            {open ? "⟨" : "⟩"}
          </button>
        </div>

        <nav className="space-y-2">
          {menu.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl ${
                  isActive
                    ? "bg-[#0e4b5a] text-white"
                    : "hover:bg-gray-100 text-gray-800"
                }`
              }
            >
              <span>{m.icon}</span>
              {open && <span>{m.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 border-t pt-4">
          <button
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Front Desk</h1>
          <div className="w-10 h-10 rounded-full bg-[#0e4b5a] text-white grid place-items-center">
            TI
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
