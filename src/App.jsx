import AppRoutes from "./routes/AppRoutes";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
export default function App() {
  return (
    <div className="compact">
      <>
        {/* Global Toast Provider */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
        />

        <Outlet />
      </>
      <AppRoutes />
    </div>
  );
}

