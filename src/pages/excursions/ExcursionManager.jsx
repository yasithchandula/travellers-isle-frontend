import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import Button from "../../components/common/Button";
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

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { toast } from "sonner";

export default function ExcursionManager() {
  const dispatch = useDispatch();

  const { items, loading, search, page, limit, totalPages } = useSelector(
    (s) => s.excursions
  );
  const cities = useSelector((s) => s.cities.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // 🔹 NEW: local filter
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchExcursions({ search, page, limit }));
    dispatch(fetchCities(""));
  }, [dispatch, search, page, limit]);

  useEffect(() => {
    if (loading) {
      toast.loading("Loading more excursions...", {
        id: "excursion-pagination",
      });
    } else {
      toast.dismiss("excursion-pagination");
    }
  }, [loading, page]);


  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditItem(item);
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    const toastId = "excursion-save";

    try {
      toast.loading(
        editItem ? "Updating excursion..." : "Creating excursion...",
        { id: toastId }
      );

      if (editItem) {
        await dispatch(
          editExcursion({ id: editItem.id, payload: form })
        ).unwrap();
      } else {
        await dispatch(addExcursion(form)).unwrap();
      }

      toast.success(
        editItem
          ? "Excursion updated successfully"
          : "Excursion added successfully",
        { id: toastId }
      );
      await dispatch(fetchExcursions({ search, page, limit }));
      setModalOpen(false);
    } catch (err) {
      toast.error(
        err?.message || "Failed to save excursion. Please try again.",
        { id: toastId }
      );
    }
  }

  function handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (nearBottom && !loading && page < totalPages) {
      dispatch(fetchExcursions({ search, page: page + 1, limit }));
    }
  }


  const filteredItems = useMemo(() => {
    if (typeFilter === "ALL") return items;
    return items.filter((e) => e.pricing_type === typeFilter);
  }, [items, typeFilter]);

  const pricingTypes = useMemo(() => {
    return Array.from(
      new Set(items.map((e) => e.pricing_type).filter(Boolean))
    );
  }, [items]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Excursion Management</h2>
            <Button onClick={openCreate}>+ Add Excursion</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
            <div className="relative flex-1">
              <InputGroup className="border-black/20 focus:ring-2 focus:ring-black/20">
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
                  {filteredItems.length} results
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Excursion Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] border-black/20 focus:ring-2 focus:ring-black/20">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="ALL">All Types</SelectItem>

                {pricingTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          {loading && (
            <div className="text-sm text-gray-600 mb-3">
              Loading excursions...
            </div>
          )}

          {/* Table */}
          <div className="overflow-auto max-h-[65vh]" onScroll={handleScroll}>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Type</th>
                  <th className="p-3 border-b">Tags</th>
                  <th className="p-3 border-b">Optional</th>
                  <th className="p-3 border-b">Reminder</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((e) => (
                  <tr
                    key={`excursion-${e.id}`}
                    className="border-b hover:bg-gray-50 transition animate-excursion-row"
                  >

                    <td className="p-3">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {e.description || "-"}
                      </div>
                    </td>

                    <td className="p-3">{e.pricing_type}</td>

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

                    <td className="p-3">
                      {e.enable_reminder ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          Enabled
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

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

                    <td className="p-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEdit(e)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        className="hidden"
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmId(e.id)}
                      >
                        Disable
                      </Button> */}
                    </td>
                  </tr>
                ))}

                {!loading && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No excursions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="
      max-w-4xl
      h-[90vh]
      bg-white
      p-0
      flex flex-col
      overflow-hidden
    "
        >
          {/* ===== HEADER (STICKY) ===== */}
          <DialogHeader
            className="
        px-6 py-4 pb-2

        sticky top-0
        z-20
        bg-white
      "
          >
            <DialogTitle>
              {editItem ? "Edit Excursion" : "Add Excursion"}
            </DialogTitle>
          </DialogHeader>

          {/* ===== SCROLL AREA (ONLY THIS SCROLLS) ===== */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ExcursionForm
              initial={editItem}
              cities={cities}
              onSubmit={handleSubmit}
              hideActions
            />
          </div>

          {/* ===== FOOTER (STICKY) ===== */}
          <div
            className="
        px-6 py-4
        border-t
        sticky bottom-0
        z-20
        bg-white
        flex justify-end gap-2
      "
          >
            <Button
              variant="outline"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="excursion-form"
            >
              {editItem ? "Save Changes" : "Add Excursion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* Disable */}
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Disable Excursion</DialogTitle>
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
