import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCcw, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

import ExcursionForm from "../../components/forms/ExcursionForm";
import {
  fetchExcursions,
  setExcursionSearch,
  addExcursion,
  editExcursion,
} from "../../app/slices/excursionSlice";
import { fetchCities } from "../../app/slices/citySlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function ExcursionManager() {
  const dispatch = useDispatch();

  const { items, loading, search, page, limit } = useSelector(
    (s) => s.excursions
  );
  const cities = useSelector((s) => s.cities.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchExcursions({ search, page, limit }));
    dispatch(fetchCities(""));
  }, [dispatch, search, page, limit]);

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
      dispatch(editExcursion({ id: editItem.id, payload: form }));
    } else {
      dispatch(addExcursion(form));
    }
    setModalOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Excursions</h2>
        <Button onClick={openCreate}>+ Add Excursion</Button>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          <div className="relative flex-1">
            <InputGroup>
              <InputGroupInput
                placeholder="Search name, description, tags..."
                value={search}
                onChange={(e) =>
                  dispatch(setExcursionSearch(e.target.value))
                }
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {items.length} results
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={() =>
              dispatch(fetchExcursions({ search, page, limit }))
            }
            className="flex items-center gap-2"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

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
                  key={`excursion-${e.id}`}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Name */}
                  <td className="p-3">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {e.description || "-"}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="p-3">{e.pricing_type}</td>

                  {/* Tags */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {e.tags ? (
                        e.tags.split(",").filter(Boolean).map((t) => (
                          <span
                            key={`${e.id}-tag-${t.trim()}`}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                          >
                            {t.trim()}
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
                      className={`px-2 py-1 rounded text-xs ${e.is_optional_supplement
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {e.is_optional_supplement ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Reminder */}
                  <td className="p-3">
                    {e.enable_reminder ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        Enabled
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${e.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {e.is_active ? "Active" : "Inactive"}
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
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No excursions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Excursion */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Excursion" : "Add Excursion"}
            </DialogTitle>
          </DialogHeader>

          <ExcursionForm
            initial={editItem}
            cities={cities}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>


      {/* Disable Excursion Confirmation */}
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>
              Disable Excursion
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Disable functionality is not available via API yet.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmId(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
