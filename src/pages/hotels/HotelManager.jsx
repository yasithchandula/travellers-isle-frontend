import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import HotelForm from "../../components/forms/hotelForm";

import {
  fetchHotels,
  setHotelQuery,
  addHotel,
  editHotel,
  disable
} from "../../app/slices/hotelSlice";

import { fetchCities } from "../../app/slices/citySlice";

export default function HotelManager() {
  const dispatch = useDispatch();

  const { items, loading, query } = useSelector((s) => s.hotels);
  const cities = useSelector((s) => s.cities.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchHotels(query));
    dispatch(fetchCities(""));
  }, [dispatch, query]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(hotel) {
    setEditItem(hotel);
    setModalOpen(true);
  }

  function handleSubmit(form) {
    if (editItem) {
      dispatch(editHotel({ id: editItem.id, patch: form }));
    } else {
      dispatch(addHotel(form));
    }
    setModalOpen(false);
  }

  function handleDisable(id) {
    dispatch(disable(id));
    setConfirmId(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hotel Management</h2>
        <Button onClick={openCreate}>+ Add Hotel</Button>
      </div>

      <Card>
        <div className="flex gap-3 mb-3 items-end">
          <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setHotelQuery(v))}
            placeholder="Hotel name or address..."
          />
          <Button variant="outline" onClick={() => dispatch(fetchHotels(query))}>Refresh</Button>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Hotel</th>
                <th className="p-3 border-b">City</th>
                <th className="p-3 border-b">Rooms</th>
                <th className="p-3 border-b">Meal Plans</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b w-48">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((h) => (
                <tr key={h.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{h.name}</td>
                  <td className="p-3">
                    {cities.find((c) => c.id === h.cityId)?.name || "-"}
                  </td>
                  <td className="p-3">{h.roomCategories.length} types</td>
                  <td className="p-3">{h.mealPlans.join(", ")}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        h.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(h)}>Edit</Button>
                    <Button variant="danger" onClick={() => setConfirmId(h.id)}>Disable</Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No hotels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Hotel" : "Add Hotel"}>
        <HotelForm
          initial={editItem}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Disable Confirm */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Disable Hotel">
        <p className="mb-4">Disable this hotel?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDisable(confirmId)}>Disable</Button>
        </div>
      </Modal>
    </div>
  );
}
