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
import Button from "@/components/common/Button";
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
    else if (!isValidEmail(email)) e.email = "Invalid email address";

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

      dispatch(
        loginSuccess({
          token: data.access_token,
          user: data,
        })
      );

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
  className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
  style={{
    backgroundImage: `
      linear-gradient(
        rgba(0,0,0,0.45),
        rgba(0,0,0,0.45)
      ),
      url('https://travellersisle.com/wp-content/uploads/2023/06/Travel-agent-in-Sri-Lanka-7.jpg')
    `,
  }}
>
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white">
        <CardHeader className="text-center space-y-3">
          <img src={logo} alt="Logo" className="h-14 mx-auto" />

          <CardTitle className="text-2xl font-semibold text-ti-forest">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to continue to Travellers Isle
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10"
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
