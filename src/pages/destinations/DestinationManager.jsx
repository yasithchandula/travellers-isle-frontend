import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import CityForm from "../../components/forms/cityForm";

import {
  fetchCities,
  setCityQuery,
  addCity,
  editCity,
  deactivate
} from "../../app/slices/citySlice";

export default function DestinationManager() {
  const dispatch = useDispatch();
  const { items, loading, query } = useSelector((s) => s.cities);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchCities(query));
  }, [dispatch, query]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(city) {
    setEditItem(city);
    setModalOpen(true);
  }

  function handleSubmit(form) {
    if (editItem) {
      dispatch(editCity({ id: editItem.id, patch: form }));
    } else {
      dispatch(addCity(form));
    }
    setModalOpen(false);
  }

  function handleDeactivate(id) {
    dispatch(deactivate(id));
    setConfirmId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Destinations & Stops</h2>
        <Button onClick={openCreate}>+ Add City</Button>
      </div>

      <Card>
        <div className="flex gap-3 mb-3 items-end">
          <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setCityQuery(v))}
            placeholder="City or region..."
          />
          <Button variant="outline" onClick={() => dispatch(fetchCities(query))}>
            Refresh
          </Button>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">City</th>
                <th className="p-3 border-b">Country</th>
                <th className="p-3 border-b">Region</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b w-48">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.country}</td>
                  <td className="p-3">{c.region}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {c.isDestination && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">Destination</span>
                      )}
                      {c.isStop && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Stop</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(c)}>Edit</Button>
                    <Button variant="danger" onClick={() => setConfirmId(c.id)}>Disable</Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No cities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit City" : "Add City"}>
        <CityForm
          initial={editItem}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Confirm Deactivate */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Disable City">
        <p className="mb-4">Are you sure you want to disable this city?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDeactivate(confirmId)}>Disable</Button>
        </div>
      </Modal>
    </div>
  );
}
