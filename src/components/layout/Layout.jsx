import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Topbar />
        <div className="pt-4 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
