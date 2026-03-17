import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, MoreHorizontal, Users, Shield, Briefcase } from "lucide-react";
import { toast } from "sonner";

import UserForm from "../../components/forms/UserForm";

import {
  fetchUsers,
  setQuery,
  addUser,
  editUser,
  removeUser,
} from "../../app/slices/userSlice";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../../components/ui/card";

/* REUSABLE COMPONENTS */

import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";
import CardGrid from "@/components/common/CardGrid";
import StatCard from "@/components/common/StatCard";

/* ------------------------------------------------ */

export default function UserManagement() {
  const dispatch = useDispatch();

  const { items = [], loading, error, query } = useSelector((s) => s.users);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  const [tagFilter, setTagFilter] = useState("all");
  const [view, setView] = useState("table");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const tags = ["ADMIN", "FRONT_DESK", "EXECUTIVE"];

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit }));
  }, [dispatch]);

  /* ---------------- FILTER ---------------- */

  const visibleUsers = useMemo(() => {
    let list = items;

    if (query) {
      const q = query.toLowerCase();

      list = list.filter(
        (u) =>
          u.display_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      );
    }

    if (tagFilter !== "all") {
      list = list.filter((u) => u.role === tagFilter);
    }

    return list;
  }, [items, query, tagFilter]);

  useEffect(() => {
    setPage(1);
  }, [query, tagFilter]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.max(1, Math.ceil(visibleUsers.length / limit));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return visibleUsers.slice(start, start + limit);
  }, [visibleUsers, page, limit]);

  /* ---------------- MODALS ---------------- */

  function startCreate() {
    setEditing(null);
    setOpen(true);
  }

  function startEdit(user) {
    setEditing(user);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
  }

  /* ---------------- CLIPBOARD ---------------- */

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Temporary password copied"))
      .catch(() => toast.error("Failed to copy password"));
  }

  /* ---------------- CREATE / EDIT ---------------- */

  async function handleSubmit(form) {
    const loadingToast = toast.loading(
      editing ? "Saving changes..." : "Creating user..."
    );

    try {
      if (editing) {
        await dispatch(editUser({ id: editing.id, ...form })).unwrap();
        toast.success("User updated successfully", { id: loadingToast });
      } else {
        const res = await dispatch(addUser(form)).unwrap();
        setCreateSuccess(res?.temp_password || null);
        toast.success("User created successfully", { id: loadingToast });
      }

      await dispatch(fetchUsers({ page: 1, limit })).unwrap();

      closeModal();
    } catch (e) {
      toast.error(e?.message || "Action failed", { id: loadingToast });
    }
  }

  /* ---------------- DELETE ---------------- */

  async function handleDelete(id) {
    const loadingToast = toast.loading("Deleting user...");

    try {
      await dispatch(removeUser(id)).unwrap();

      toast.success("User deleted successfully", {
        id: loadingToast,
      });

      setConfirmId(null);

      await dispatch(fetchUsers({ page: 1, limit }));
    } catch (e) {
      toast.error("Failed to delete user", { id: loadingToast });
    }
  }

  return (
    <div className="space-y-6 b-main-cont">

      {/* HERO HEADER */}

      <EntityHeroHeader
        title="User Management"
        description="Create and manage system users."
        buttonText="New User"
        onCreate={startCreate}
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={items.length}
          icon={Users}
        />

        <StatCard
          title="Admins"
          value={items.filter((u) => u.role === "ADMIN").length}
          icon={Shield}
        />

        <StatCard
          title="Front Desk"
          value={items.filter((u) => u.role === "FRONT_DESK").length}
          icon={Users}
        />

        <StatCard
          title="Executives"
          value={items.filter((u) => u.role === "EXECUTIVE").length}
          icon={Briefcase}
        />
      </div>

      {/* PASSWORD ALERT */}

      {createSuccess && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
          <AlertTitle>User Created</AlertTitle>

          <AlertDescription className="space-y-2">
            <p className="text-sm">
              Temporary password (copy and share securely)
            </p>

            <div className="flex gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm select-all">
                {createSuccess}
              </code>

              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(createSuccess)}
              >
                Copy
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCreateSuccess(null)}
              >
                Close
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* TOOLBAR */}

      <ManagerToolbar
        title="Browse users"
        description="Search, filter and manage users."

        search={query}
        onSearchChange={(v) => dispatch(setQuery(v))}

        tagFilter={tagFilter}
        onTagChange={setTagFilter}
        tags={tags}

        limit={limit}
        onLimitChange={setLimit}

        view={view}
        setView={setView}

        loading={loading}
        resultCount={visibleUsers.length}
      />

      {/* VIEW SWITCH */}

      {view === "card" ? (
        <CardGrid>
          {paginatedUsers.map((u, index) => (
            <Card
              key={u.id}
              className={cn(
                "group overflow-hidden rounded-3xl border bg-background shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg",
                "animate-in fade-in-0 slide-in-from-bottom-2"
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Header / Avatar Section */}
              <div className="relative flex items-center gap-4 p-5 pb-3">
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                  {u.display_name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Name + Email */}
                <div className="flex-1">
                  <h3 className="line-clamp-1 text-base font-semibold">
                    {u.display_name || "Unnamed User"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {u.email}
                  </p>
                </div>

                {/* Status badge (top right feel) */}
                <Badge
                  className={cn(
                    "rounded-full",
                    u.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {u.status}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="space-y-4 p-5 pt-2">
                {/* Role */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {u.role}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    className="flex-1 rounded-xl"
                    onClick={() => startEdit(u)}
                  >
                    Edit
                  </Button>

                  {/* Future ready */}
                  {/*
          <Button variant="outline" className="rounded-xl">
            View
          </Button>
          */}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardGrid>
      ) : (
        <EntityTable
          header={
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          }
          body={
            loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : paginatedUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>

                <TableCell className="font-medium">
                  {u.display_name}
                </TableCell>

                <TableCell>{u.email}</TableCell>

                <TableCell>
                  <Badge>{u.role}</Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={u.status === "ACTIVE" ? "default" : "outline"}
                  >
                    {u.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEdit(u)}>
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setConfirmId(u.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          }
        />
      )}

      {/* PAGINATION */}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setPage}
      />

      {/* CREATE / EDIT MODAL */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit User" : "Create User"}
            </DialogTitle>
          </DialogHeader>

          <UserForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={loading}
            error={error}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this user?</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}