import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";

import ExcursionForm from "../../components/forms/ExcursionForm";
import { fetchExcursions, setExcursionQuery, addExcursion, editExcursion, disableExc } from "../../app/slices/excursionSlice";
import { fetchCities } from "../../app/slices/citySlice";

export default function ExcursionManager() {
  const dispatch = useDispatch();

  const { items, loading, query } = useSelector(s => s.excursions);
  const cities = useSelector(s => s.cities.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchExcursions(query));
    dispatch(fetchCities(""));
  }, [dispatch, query]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }
  function openEdit(item) {
    setEditItem(item);
    setModalOpen(true);
  }

  function handleSubmit(form) {
    if (editItem) {
      dispatch(editExcursion({ id: editItem.id, patch: form }));
    } else {
      dispatch(addExcursion(form));
    }
    setModalOpen(false);
  }

  function handleDisable(id) {
    dispatch(disableExc(id));
    setConfirmId(null);
  }

  const cityName = (id) => cities.find(c => c.id === id)?.name || "-";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Excursions</h2>
        <Button onClick={openCreate}>+ Add Excursion</Button>
      </div>

      <Card>
        <div className="flex gap-3 mb-3 items-end">
          <Input
            label="Search"
            value={query}
            onChange={(v) => dispatch(setExcursionQuery(v))}
            placeholder="name, description, tags..."
          />
          <Button variant="outline" onClick={() => dispatch(fetchExcursions(query))}>Refresh</Button>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}

        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">Cities</th>
                <th className="p-3 border-b">Tags</th>
                <th className="p-3 border-b">Optional</th>
                <th className="p-3 border-b">Reminder</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b w-56">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-sm text-gray-600 line-clamp-1">{e.description}</div>
                  </td>
                  <td className="p-3">{e.pricingType}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {e.assignedCityIds?.map(id => (
                        <span key={id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {cityName(id)}
                        </span>
                      ))}
                      {(!e.assignedCityIds || e.assignedCityIds.length === 0) && "-"}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {(e.tags || []).map((t,i) => (
                        <span key={i} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">{t}</span>
                      ))}
                      {(!e.tags || e.tags.length === 0) && "-"}
                    </div>
                  </td>
                  <td className="p-3">
                    {e.isOptionalSupplement
                      ? <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Yes</span>
                      : <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">No</span>}
                  </td>
                  <td className="p-3">
                    {e.reminder?.enabled
                      ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">{`D-${e.reminder.daysBefore}${e.reminder.nextDayAlso ? " & D+1" : ""}`}</span>
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${e.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(e)}>Edit</Button>
                    <Button variant="danger" onClick={() => setConfirmId(e.id)}>Disable</Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">No excursions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Excursion" : "Add Excursion"}>
        <ExcursionForm
          initial={editItem}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Disable confirm */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Disable Excursion">
        <p className="mb-4">Disable this excursion?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDisable(confirmId)}>Disable</Button>
        </div>
      </Modal>
    </div>
  );
}
