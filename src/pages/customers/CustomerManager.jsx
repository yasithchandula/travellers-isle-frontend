import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import CustomerForm from "../../components/forms/CustomerForm";
import {
  fetchCustomers,
  setCustomerQuery,
  addCustomer,
  editCustomer,
  deactivate
} from "../../app/slices/customerSlice";

export default function CustomerManager() {
  const dispatch = useDispatch();
  const { items, loading, query } = useSelector((s) => s.customers);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers(query));
  }, [dispatch, query]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }
  function openEdit(cust) {
    setEditItem(cust);
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    if (editItem) {
      await dispatch(editCustomer({ id: editItem.id, patch: form }));
    } else {
      await dispatch(addCustomer(form));
    }
    setModalOpen(false);
  }

  async function handleDeactivate(id) {
    await dispatch(deactivate(id));
    setConfirmId(null);
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Customer Management</h2>
        <Button onClick={openCreate}>+ New Customer</Button>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setCustomerQuery(v))}
            placeholder="name, email, phone..."
          />
          <Button variant="outline" onClick={() => dispatch(fetchCustomers(query))}>
            Refresh
          </Button>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b w-48">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(c)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setConfirmId(c.id)}
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Customer" : "New Customer"}
      >
        <CustomerForm
          initial={editItem}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Confirm */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Confirm Deactivation"
      >
        <p className="mb-4">Deactivate this customer?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDeactivate(confirmId)}>
            Deactivate
          </Button>
        </div>
      </Modal>
    </div>
  );
}
