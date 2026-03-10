import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserPlus,
  Search,
  Loader2,
  MoreHorizontalIcon,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { items, loading, error, query } = useSelector((s) => s.users);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [createSuccess, setCreateSuccess] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

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

  /* ------------------ PAGINATION ------------------ */

  const totalPages = Math.ceil(visibleUsers.length / limit);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return visibleUsers.slice(start, start + limit);
  }, [visibleUsers, page]);

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
        await dispatch(editUser({ id: editing.id, ...form })).unwrap();

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
    <div className="space-y-4 b-main-cont">

      {/* TEMP PASSWORD ALERT */}

      {createSuccess && (
        <Alert className="border-blue-200 bg-blue-50 text-blue-900">
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

      {/* TABLE CARD */}

      <Card>
        <CardHeader>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">User Management</h2>

            <Button variant="outline" onClick={startCreate} disabled={loading}>
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

          {/* TOOLBAR */}

          <div className="flex flex-col md:flex-row md:items-center gap-3">

            <InputGroup className="border-black/20">
              <InputGroupInput
                onChange={(e) => dispatch(setQuery(e.target.value))}
                placeholder="Search by name, email, or role..."
              />

              <InputGroupAddon>
                <Search />
              </InputGroupAddon>

              <InputGroupAddon align="inline-end">
                {visibleUsers.length} Results
              </InputGroupAddon>

            </InputGroup>

            <div className="w-full md:w-44">

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="FRONT_DESK">FRONT_DESK</SelectItem>
                  <SelectItem value="EXECUTIVE">EXECUTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-auto rounded-md">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {paginatedUsers
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map((u) => (

                    <TableRow
                      key={u.id}
                      className="hover:bg-muted/50 transition-colors"
                    >

                      <TableCell>{u.id}</TableCell>

                      <TableCell className="font-medium">
                        {u.display_name}
                      </TableCell>

                      <TableCell>{u.email}</TableCell>

                      <TableCell>{u.role}</TableCell>

                      <TableCell>

                        <span
                          className={`px-2 py-1 rounded text-xs ${u.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {u.status}
                        </span>

                      </TableCell>

                      <TableCell className="text-right">

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                            </Button>

                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() => startEdit(u)}
                            >
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setConfirmId(u.id)}
                            >
                              Delete
                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </TableCell>

                    </TableRow>
                  ))}

                {!loading && visibleUsers.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No users found.
                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (

            <Pagination className="pt-4">

              <PaginationContent>

                <PaginationItem>

                  <PaginationPrevious
                    onClick={() =>
                      setPage((p) => Math.max(p - 1, 1))
                    }
                  />

                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (

                  <PaginationItem key={i}>

                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>

                  </PaginationItem>

                ))}

                <PaginationItem>

                  <PaginationNext
                    onClick={() =>
                      setPage((p) =>
                        Math.min(p + 1, totalPages)
                      )
                    }
                  />

                </PaginationItem>

              </PaginationContent>

            </Pagination>

          )}

        </CardContent>

      </Card>

      {/* CREATE / EDIT MODAL */}

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent
          className="sm:max-w-lg bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >

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

        <DialogContent
          className="bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >

          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this user?</p>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setConfirmId(null)}
            >
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