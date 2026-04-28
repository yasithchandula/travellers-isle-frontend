import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar (optional) */}
        {/* <Topbar /> */}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
