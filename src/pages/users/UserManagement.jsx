import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import UserForm from "../../components/forms/UserForm";
import { fetchUsers, setQuery, addUser, editUser, removeUser } from "../../app/slices/userSlice";

export default function UserManagement() {
  const dispatch = useDispatch();
  const { items, loading, error, query } = useSelector((s) => s.users);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(query));
  }, [dispatch, query]);

  const visibleUsers = useMemo(() => items, [items]);

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
    setOpen(false);
  }

  async function handleDelete(id) {
    await dispatch(removeUser(id));
    setConfirmId(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Button onClick={startCreate}>+ New User</Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Input label="Search" value={query} onChange={(v) => dispatch(setQuery(v))} placeholder="name, email, role..." />
            <Button variant="outline" onClick={() => dispatch(fetchUsers(query))}>Refresh</Button>
          </div>

          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}

          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-[var(--gray-100)]">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-[#fafafa]">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button variant="secondary" onClick={() => startEdit(u)}>Edit</Button>
                      <Button variant="danger" onClick={() => setConfirmId(u.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
                {!loading && visibleUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-600">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal open={open} onClose={closeModal} title={editing ? "Edit User" : "Create User"}>
        <UserForm initial={editing} onSubmit={handleSubmit} onCancel={closeModal} submitting={loading} />
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Confirm Delete">
        <p className="mb-4">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(confirmId)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
