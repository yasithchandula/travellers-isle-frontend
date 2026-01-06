import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAuth } from "@/api/auth";
import logo from "/logo.png";
import ChangePasswordModal from "./ChangePasswordModal";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");


  const [showChangePw, setShowChangePw] = useState(false);

  function validate() {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Invalid email address";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Minimum 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await loginAuth(email, password);

      const { status, message, data } = res || {};

      if (status !== 200 || !data?.access_token) {
        throw new Error(message || "Invalid credentials");
      }

      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data));

      console.log("Login successful:", data);

      if (Number(data.must_change_password) === 1) {
        setShowChangePw(true);
        return;
      }

      navigate("/dashboard");

    } catch (err) {
      setServerError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePasswordChanged() {
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
                name="email"
                autoComplete="username"
                placeholder="you@example.ocm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="placeholder:text-sm placeholder:opacity-50 w-full border rounded-lg px-3 py-2"
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
                  className={`pr-10 placeholder:text-sm placeholder:opacity-50 ${errors.password && "border-red-500"
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

            {/* Server error */}
            {serverError && (
              <p className="text-sm text-red-600 text-center">
                {serverError}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full bg-ti-forest hover:bg-ti-forest/90 text-white" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Forgot password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-ti-teal hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
          {/* 🔐 Change Password Modal */}
          {showChangePw && (
            <ChangePasswordModal onSuccess={handlePasswordChanged} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
