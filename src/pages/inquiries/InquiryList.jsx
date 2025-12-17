import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import InquiryForm from "../../components/forms/InquiryForm";

import {
  fetchInquiries,
  setInquiryQuery,
  setInquiryLabel,
  addInquiry,
  spamInquiry,
  assignToExecutive,
  convertToTour
} from "../../app/slices/inquirySlice";

import { ROLES } from "../../utils/constants";
import { useSelector as useUserSelector } from "react-redux";

export default function InquiryList() {
  const dispatch = useDispatch();
  const { items, loading, query, labelFilter } = useSelector((s) => s.inquiries);
  const users = useUserSelector((s) => s.users.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null); // inquiry id

  useEffect(() => {
    dispatch(fetchInquiries({ q: query, label: labelFilter }));
  }, [dispatch, query, labelFilter]);

  function handleCreate(form) {
    dispatch(addInquiry(form));
    setModalOpen(false);
  }

  function applyLabelFilter(label) {
    dispatch(setInquiryLabel(label));
  }

  function startAssign(id) {
    setAssignModal(id);
  }

  function assignExec(userId) {
    dispatch(assignToExecutive({ id: assignModal, userId }));
    setAssignModal(null);
  }

  function convert(id) {
    dispatch(convertToTour(id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Inquiries</h2>
        <Button onClick={() => setModalOpen(true)}>+ New Inquiry</Button>
      </div>

      <Card>
        <div className="flex gap-3 mb-3">
          <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setInquiryQuery(v))}
            placeholder="Name, email, phone..."
          />

          <div>
            <label className="block mb-1 text-sm">Label Filter</label>
            <select
              className="border rounded px-3 py-2"
              value={labelFilter}
              onChange={(e) => applyLabelFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="spam">Spam</option>
            </select>
          </div>

          <Button variant="outline" onClick={() => dispatch(fetchInquiries({ q: query, label: labelFilter }))}>
            Refresh
          </Button>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Source</th>
                <th className="p-3 border-b">Label</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Assigned To</th>
                <th className="p-3 border-b w-64">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i.name}</td>
                  <td className="p-3">{i.email}</td>
                  <td className="p-3">{i.phone}</td>
                  <td className="p-3">{i.source}</td>
                  <td className="p-3">
                    {i.label ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        {i.label}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        i.status === "new"
                          ? "bg-blue-100 text-blue-700"
                          : i.status === "assigned"
                          ? "bg-purple-100 text-purple-700"
                          : i.status === "converted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {i.assignedTo
                      ? users.find((u) => u.id === i.assignedTo)?.name || "Unknown"
                      : "-"}
                  </td>

                  <td className="p-3 flex gap-2">
                    <Button variant="primary" onClick={() => startAssign(i.id)}>Assign</Button>
                    <Button variant="secondary" onClick={() => convert(i.id)}>Convert</Button>
                    <Button variant="danger" onClick={() => dispatch(spamInquiry(i.id))}>Spam</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Inquiry */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Inquiry">
        <InquiryForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} />
      </Modal>

      {/* Assign Modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign to Executive">
        <div className="flex flex-col gap-2">
          {users
            .filter((u) => u.role !== "INTERN")
            .map((u) => (
              <Button key={u.id} onClick={() => assignExec(u.id)}>
                {u.name} — {u.role}
              </Button>
            ))}
        </div>
      </Modal>
    </div>
  );
}
