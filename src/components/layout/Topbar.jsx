import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.png"; // put your logo in public/logo.svg or change path
import Button from "../../components/common/Button";

export default function Topbar() {
  const [openUser, setOpenUser] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  return (
    <div className="
      h-16 bg-white shadow-sm border-b border-ti-sky px-6
      flex items-center justify-between relative z-50
    ">
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Travellers Isle" className="h-10" />
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center gap-6 text-ti-forest relative">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenUser(false);
            }}
            className="
              text-2xl hover:text-ti-teal transition relative
            "
          >
            🔔
            {/* Small highlight circle */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ti-red rounded-full"></span>
          </button>

          {openNotif && (
            <div
              className="
                absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl
                border border-ti-sky p-3 animate-fadeIn
              "
            >
              <h4 className="font-serif text-lg mb-2 text-ti-forest">Notifications</h4>

              <div className="flex flex-col gap-2 max-h-64 overflow-auto">

                {/* Replace hardcoded items with dynamic data later */}
                <div className="p-3 bg-ti-sky/50 rounded-lg">
                  New inquiry received from *George*.
                </div>

                <div className="p-3 bg-ti-sky/50 rounded-lg">
                  Quotation #Q-102 marked as *Urgent*.
                </div>

                <div className="p-3 bg-ti-sky/50 rounded-lg">
                  Follow-up due for *Family Tour*.
                </div>

              </div>

              <div className="text-right mt-3">
                <Button size="sm" variant="secondary">
                  View All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenUser(!openUser);
              setOpenNotif(false);
            }}
            className="
              w-10 h-10 rounded-full bg-ti-mint flex items-center justify-center
              text-ti-forest font-semibold hover:ring-2 hover:ring-ti-teal transition
            "
          >
            U
          </button>

          {openUser && (
            <div
              className="
                absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl
                border border-ti-sky p-3 animate-fadeIn
              "
            >
              <div className="pb-3 mb-3 border-b border-ti-sky">
                <div className="font-serif text-lg">User Name</div>
                <div className="text-sm text-ti-forest/70">user@example.com</div>
              </div>

              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    to="/profile"
                    className="block p-2 rounded-lg hover:bg-ti-sky/60"
                  >
                    Profile Settings
                  </Link>
                </li>

                <li>
                  <Link
                    to="/preferences"
                    className="block p-2 rounded-lg hover:bg-ti-sky/60"
                  >
                    Preferences
                  </Link>
                </li>

                <li>
                  <button
                    className="w-full text-left p-2 rounded-lg hover:bg-ti-sky/60"
                    onClick={() => console.log("Logout")}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
