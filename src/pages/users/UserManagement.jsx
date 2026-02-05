import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw, UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Button from "../../components/common/Button";
import UserForm from "../../components/forms/UserForm";

import {
  fetchUsers,
  setQuery,
  addUser,
  editUser,
  removeUser,
} from "../../app/slices/userSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { items, loading, error, query } = useSelector((s) => s.users);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [createSuccess, setCreateSuccess] = useState(null);

  /* ------------------ FETCH USERS ------------------ */
  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  /* ------------------ FILTER ------------------ */
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

    if (roleFilter !== "ALL") {
      list = list.filter((u) => u.role === roleFilter);
    }

    return list;
  }, [items, query, roleFilter]);

  /* ------------------ MODAL ------------------ */
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

  /* ------------------ CLIPBOARD ------------------ */
  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Temporary password copied"))
      .catch(() => toast.error("Failed to copy password"));
  }

  /* ------------------ CREATE / EDIT ------------------ */
  async function handleSubmit(form) {
    const loadingToast = toast.loading(
      editing ? "Saving changes..." : "Creating user..."
    );

    try {
      if (editing) {
        await dispatch(
          editUser({ id: editing.id, ...form })
        ).unwrap();

        toast.success("User updated successfully", {
          id: loadingToast,
        });
      } else {
        const res = await dispatch(addUser(form)).unwrap();
        setCreateSuccess(res?.temp_password || null);

        toast.success("User created successfully", {
          id: loadingToast,
        });
      }

      await dispatch(fetchUsers({ page: 1, limit: 10 })).unwrap();
      closeModal();
    } catch (e) {
      toast.error(
        e?.message || "Action failed. Please try again.",
        { id: loadingToast }
      );
      throw e;
    }
  }

  /* ------------------ DELETE ------------------ */
  async function handleDelete(id) {
    const loadingToast = toast.loading("Deleting user...");

    try {
      await dispatch(removeUser(id)).unwrap();

      toast.success("User deleted successfully", {
        id: loadingToast,
      });

      setConfirmId(null);
      await dispatch(fetchUsers({ page: 1, limit: 10 }));
    } catch (e) {
      toast.error(
        e?.message || "Failed to delete user",
        { id: loadingToast }
      );
    }
  }

  return (
    <div className="space-y-4">

      {/* 🔐 TEMP PASSWORD ALERT */}
      {createSuccess && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600">
          <AlertTitle>User Created</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              Temporary password (copy and share securely):
            </p>

            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded bg-muted font-mono text-sm select-all">
                {createSuccess}
              </code>

              <Button
                size="sm"
                variant="primary"
                onClick={() => copyToClipboard(createSuccess)}
                className="text-xs"
              >
                Copy
              </Button>

              <Button
                className="text-xs"
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

      {/* ------------------ TABLE CARD ------------------ */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <Button
              onClick={async () => {

             startCreate();

              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  New User
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, email, or role..."
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
              />
            </div> */}

            <InputGroup className="border-black/20 focus:ring-2 focus:ring-black/20">
              <InputGroupInput onChange={(e) => dispatch(setQuery(e.target.value))} placeholder="Search by name, email, or role..." className="color-black/20" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">{visibleUsers.length} Results</InputGroupAddon>
            </InputGroup>

            <div className="w-full md:w-44">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="border-black/20 focus:ring-2 focus:ring-black/20">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="FRONT_DESK">FRONT_DESK</SelectItem>
                  <SelectItem value="EXECUTIVE">EXECUTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <Button
              variant="outline"
              onClick={() =>
                dispatch(fetchUsers({ page: 1, limit: 10 }))
              }
              disabled={loading}
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button> */}
          </div>

          {/* Table (UNCHANGED) */}
          <div className="overflow-auto rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.slice().sort((a, b) => a.id - b.id).map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3 font-medium">{u.display_name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${u.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button size="sm" onClick={() => startEdit(u)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirmId(u.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {!loading && visibleUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE / EDIT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
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
        <DialogContent className="bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this user?</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
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
