import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw, Search } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";

import ExcursionForm from "../../components/forms/ExcursionForm";
import {
  fetchExcursions,
  setExcursionQuery,
  addExcursion,
  editExcursion,
  disableExc,
} from "../../app/slices/excursionSlice";
import { fetchCities } from "../../app/slices/citySlice";

export default function ExcursionManager() {
  const dispatch = useDispatch();

  const { items, loading, query } = useSelector((s) => s.excursions);
  const cities = useSelector((s) => s.cities.items);

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

  const cityName = (id) =>
    cities.find((c) => c.id === id)?.name || "-";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Excursions</h2>
        <Button onClick={openCreate}>+ Add Excursion</Button>
      </div>

      {/* Main Card */}
      <Card>
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          {/* Search */}
          <div className="relative flex-1">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search name, description, tags..."
              value={query}
              onChange={(e) => dispatch(setExcursionQuery(e.target.value))}
            /> */}

            <InputGroup>
              <InputGroupInput placeholder="Search name, description, tags..."
                value={query}
                onChange={(e) => dispatch(setExcursionQuery(e.target.value))} />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
            </InputGroup>
          </div>

          {/* Refresh */}
          <Button
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={() => dispatch(fetchExcursions(query))}
            className="flex items-center gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-sm text-gray-600 mb-3">
            Loading excursions...
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto rounded-md border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left">
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
              {items.map((e) => (
                <tr
                  key={e.id}
                  className="border-b hover:bg-gray-50 transition justify-center"
                >
                  {/* Name */}
                  <td className="p-3 justify-center">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {e.description}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="p-3">{e.pricingType}</td>

                  {/* Cities */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {e.assignedCityIds?.length ? (
                        e.assignedCityIds.map((id) => (
                          <span
                            key={id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {cityName(id)}
                          </span>
                        ))
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {e.tags?.length ? (
                        e.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>

                  {/* Optional */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${e.isOptionalSupplement
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {e.isOptionalSupplement ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Reminder */}
                  <td className="p-3">
                    {e.reminder?.enabled ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {`D-${e.reminder.daysBefore}${e.reminder.nextDayAlso ? " & D+1" : ""
                          }`}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${e.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {e.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(e)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setConfirmId(e.id)}
                    >
                      Disable
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && items.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-6 text-center text-gray-500"
                  >
                    No excursions found.
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
        title={editItem ? "Edit Excursion" : "Add Excursion"}
      >
        <ExcursionForm
          initial={editItem}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Disable Confirmation */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Disable Excursion"
      >
        <p className="mb-4">Disable this excursion?</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfirmId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDisable(confirmId)}
          >
            Disable
          </Button>
        </div>
      </Modal>
    </div>
  );
}
