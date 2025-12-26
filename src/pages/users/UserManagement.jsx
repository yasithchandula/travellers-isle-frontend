import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw, UserPlus } from "lucide-react";


import Button from "../../components/common/Button"; // keep your Button
import UserForm from "../../components/forms/UserForm";

import {
  fetchUsers,
  setQuery,
  addUser,
  editUser,
  removeUser,
} from "../../app/slices/userSlice";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";


export default function UserManagement() {
  const dispatch = useDispatch();
  const { items, loading, error, query } = useSelector((s) => s.users);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers(query));
  }, [dispatch, query]);

  const visibleUsers = useMemo(() => {
    if (roleFilter === "all") return items;
    return items.filter((u) => u.role === roleFilter);
  }, [items, roleFilter]);



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

  async function handleSubmit(form) {
    if (editing) {
      await dispatch(editUser({ id: editing.id, patch: form }));
    } else {
      await dispatch(addUser(form));
    }
    closeModal();
  }

  async function handleDelete(id) {
    await dispatch(removeUser(id));
    setConfirmId(null);
  }

  return (
    <div className="space-y-4">

      {/* Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <Button onClick={startCreate}><UserPlus size={20} /></Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, email, or role..."
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
              />
            </div>

            {/* Role Filter */}
            <div className="w-full md:w-44">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh */}
            <Button
              variant="outline"
              onClick={() => dispatch(fetchUsers(query))}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

          </div>


          {/* States */}
          {loading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">{error}</p>}

          {/* Table */}
          <div className="overflow-auto rounded-md border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-40">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${u.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startEdit(u)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
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

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
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
          />

          {error && <p className="text-destructive mt-2">{error}</p>}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
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
