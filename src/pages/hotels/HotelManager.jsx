import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw, Search } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import HotelForm from "../../components/forms/HotelForm";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

import {
  fetchHotels,
  setHotelQuery,
  addHotel,
  editHotel,
  disable,
} from "../../app/slices/hotelSlice";

import { fetchCities } from "../../app/slices/citySlice";

export default function HotelManager() {
  const dispatch = useDispatch();

  const { items = [], loading, query } = useSelector((s) => s.hotels);
  const cities = useSelector((s) => s.cities.items || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  /* =======================
     Initial Load
  ======================= */
  useEffect(() => {
    dispatch(fetchHotels(query));
    dispatch(fetchCities(""));
  }, [dispatch, query]);

  /* =======================
     Actions
  ======================= */
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
    setEditItem(null);
    dispatch(fetchHotels(query));
  }

  function handleDisable(id) {
    dispatch(disable(id));
    setConfirmId(null);
    dispatch(fetchHotels(query));
  }

  function getCityName(cityId) {
    return cities.find((c) => c.id === cityId)?.name || "-";
  }

  function renderStatus(status) {
    const isActive = status === "active" || status === 1 || status === true;

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${isActive
          ? "bg-green-100 text-green-700"
          : "bg-gray-200 text-gray-700"
          }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hotel Management</h2>
        <Button onClick={openCreate}>+ Add Hotel</Button>
      </div>

      {/* Table */}
      <Card>
        <div className="flex gap-3 mb-3 items-end">
          {/* <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setHotelQuery(v))}
            placeholder="Hotel name or address..."
          /> */}
          <InputGroup>
            <InputGroupInput placeholder="Search name, description, tags..."
              value={query}
              onChange={(e) => dispatch(setHotelQuery(e.target.value))} />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => dispatch(fetchHotels(query))}
          >
            Refresh
          </Button>
        </div>


        <div className="overflow-auto rounded-md border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left">
                <th className="p-3 border-b">Hotel</th>
                <th className="p-3 border-b">City</th>
                <th className="p-3 border-b">Room Categories</th>
                <th className="p-3 border-b">Meal Plans</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b w-48">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((h) => (
                <tr
                  key={h.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Hotel */}
                  <td className="p-3">
                    <div className="font-medium">{h.name}</div>
                  </td>

                  {/* City */}
                  <td className="p-3">
                    {getCityName(h.cityId) || "-"}
                  </td>

                  {/* Room Categories */}
                  <td className="p-3">
                    {h.roomCategories?.length ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {h.roomCategories.length} types
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Meal Plans */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {h.mealPlans?.length ? (
                        h.mealPlans.map((m, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {m}
                          </span>
                        ))
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${h.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {h.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(h)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirmId(h.id)}
                    >
                      Disable
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    No hotels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


        </div>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Hotel" : "Add Hotel"}
      >
        <HotelForm
          initial={editItem}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Disable Confirm Modal */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Disable Hotel"
      >
        <p className="mb-4 text-sm">
          Are you sure you want to disable this hotel?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setConfirmId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDisable(confirmId)}
          >
            Disable
          </Button>
        </div>
      </Modal>
    </div>
  );
}
