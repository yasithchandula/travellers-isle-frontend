"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ROLES, USER_STATUSES } from "../../utils/constants";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { User, Mail, ShieldCheck } from "lucide-react";

export default function UserForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    setName(initial?.display_name || "");
    setEmail(initial?.email || "");
    setRole(initial?.role || "");
    setStatus(initial?.status || "ACTIVE");
    setErrors({});
  }, [initial]);

  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Display name is required";
    else if (name.trim().length < 3)
      e.name = "Display name must be at least 3 characters";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email address";

    if (!role) e.role = "Role is required";
    if (!status) e.status = "Status is required";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please fix the highlighted fields");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    await onSubmit({
      display_name: name.trim(),
      email: email.trim(),
      role,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ================= BASIC INFO ================= */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Define the user’s display name and email identity.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Name */}
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`h-11 ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-11 ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

        </CardContent>
      </Card>

      {/* ================= ACCESS CONTROL ================= */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4" />
            Access & Status
          </CardTitle>
          <CardDescription>
            Assign user role and control account status.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Role */}
          <div className="space-y-2">
            <Label>User Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className={`h-11 ${errors.role ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.role && (
              <p className="text-xs text-destructive">{errors.role}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Account Status</Label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className={`h-11 ${errors.status ? "border-destructive" : ""}`}>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {USER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.status && (
              <p className="text-xs text-destructive">{errors.status}</p>
            )}
          </div>

        </CardContent>
      </Card>

      {/* ================= ACTIONS ================= */}
      <div className="sticky bottom-0 z-10 border-t bg-background/95 px-1 py-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          
          <div className="text-sm text-muted-foreground">
            Review details before saving user account.
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button disabled={submitting} className="min-w-[160px]">
              {submitting
                ? "Please wait..."
                : isEdit
                ? "Save Changes"
                : "Create User"}
            </Button>
          </div>

        </div>
      </div>

    </form>
  );
}