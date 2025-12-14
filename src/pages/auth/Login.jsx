import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import logo from "/logo.png"; // put your logo into public/logo.svg

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // mock redirect
      window.location.href = "/dashboard";
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-ti-sand flex items-center justify-center px-4">
      <div
        className="
          bg-white w-full max-w-md p-8 rounded-2xl shadow-md 
          border border-ti-sky animate-fadeIn
        "
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-14 mb-3" />
          <h2 className="text-2xl font-serif text-ti-forest">
            Welcome to Travellers Isle
          </h2>
          <p className="text-ti-forest/70 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          />

          <div>
            <label className="text-sm text-ti-forest">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full rounded-lg border border-ti-mint bg-white 
                  px-3 py-2 outline-none transition 
                  focus:ring-2 focus:ring-ti-teal
                "
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-2 text-ti-forest/70 hover:text-ti-teal"
              >
                {showPw ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-ti-teal hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login button */}
          <Button type="submit" full loading={loading}>
            Login
          </Button>

        </form>
      </div>
    </div>
  );
}
