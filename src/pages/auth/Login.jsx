import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

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

import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginAuth } from "@/api/auth";
import { loginSuccess } from "@/app/slices/authSlice";
import ChangePasswordModal from "./ChangePasswordModal";

import logo from "/logo.png";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showChangePw, setShowChangePw] = useState(false);

  function validate() {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Invalid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Fix the errors to continue");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing in…");

    try {
      const res = await loginAuth(email, password);
      const { status, message, data } = res || {};

      if (status !== 200 || !data?.access_token) {
        throw new Error(message || "Invalid credentials");
      }

      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data));

      dispatch(loginSuccess({
        token: data.access_token,
        user: data,
      }));

      toast.success("Welcome back 👋", { id: toastId });

      if (Number(data.must_change_password) === 1) {
        toast.info("Please update your password");
        setShowChangePw(true);
        return;
      }

      navigate(from, { replace: true });

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePasswordChanged() {
    toast.success("Password updated");
    setShowChangePw(false);
    navigate(from, { replace: true });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url('https://travellersisle.com/wp-content/uploads/2023/06/Travel-agent-in-Sri-Lanka-7.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* subtle overlay glow */}
      <div className="absolute inset-0 bg-background/25" />

      {/* CARD */}
      <Card className="relative w-full max-w-md border bg-card/95 shadow-xl backdrop-blur animate-in fade-in-0 zoom-in-95">

        <CardHeader className="text-center space-y-4 pb-2">

          <img
            src={logo}
            alt="Travellers Isle"
            className="h-14 mx-auto drop-shadow-sm"
          />

          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Welcome back
            </CardTitle>

            <CardDescription className="text-sm">
              Sign in to your dashboard
            </CardDescription>
          </div>

        </CardHeader>

        <CardContent className="space-y-5">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label>Email</Label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-11 pl-10 focus-visible:ring-1 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <Label>Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-11 pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-primary hover:bg-primary/90"
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? "Signing in…" : "Login"}
            </Button>

          </form>

          {showChangePw && (
            <ChangePasswordModal onSuccess={handlePasswordChanged} />
          )}

        </CardContent>

      </Card>
    </div>
  );
}
