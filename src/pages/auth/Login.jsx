import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import logo from "/logo.png";

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
      window.location.href = "/dashboard";
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-ti-sand flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-ti-sky shadow-md animate-fadeIn">
        {/* HEADER */}
        <CardHeader className="flex flex-col items-center gap-2 pt-8">
          <img src={logo} alt="Logo" className="h-14 mb-2" />
          <h2 className="text-2xl font-serif text-ti-forest">
            Welcome to Travellers Isle
          </h2>
          <p className="text-sm text-ti-forest/70">
            Login to continue
          </p>
        </CardHeader>

        {/* CONTENT */}
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-ti-forest">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-ti-forest">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-sm text-ti-forest/70 hover:text-ti-teal"
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
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
