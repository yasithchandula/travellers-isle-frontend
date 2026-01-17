import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { loginAuth } from "@/api/auth";
import ChangePasswordModal from "./ChangePasswordModal";
import logo from "/logo.png";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showChangePw, setShowChangePw] = useState(false);

  function validate() {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email))
      e.email = "Please enter a valid email address";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Minimum 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Signing you in...");

    try {
      const res = await loginAuth(email, password);
      const { status, message, data } = res || {};

      if (status !== 200 || !data?.access_token) {
        throw new Error(message || "Invalid credentials");
      }

      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data));

      toast.success("Login successful", {
        id: loadingToast,
      });

      if (Number(data.must_change_password) === 1) {
        toast.info("Please change your password to continue");
        setShowChangePw(true);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed",
        {
          id: loadingToast,
        }
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePasswordChanged() {
    toast.success("Password updated successfully");
    setShowChangePw(false);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ti-sand px-4">
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader className="space-y-2 text-center">
          <img src={logo} alt="Logo" className="h-14 mx-auto" />
          <CardTitle className="text-2xl font-serif text-ti-forest">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Login to continue to Travellers Isle
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-xs text-muted-foreground"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-ti-forest hover:bg-ti-forest/90 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-ti-teal hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {/* 🔐 Force Change Password */}
          {showChangePw && (
            <ChangePasswordModal onSuccess={handlePasswordChanged} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
