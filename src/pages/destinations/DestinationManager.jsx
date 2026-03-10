import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import CityForm from "../../components/forms/CityForm";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  fetchCities,
  setCitySearch,
  addCity,
  editCity,
  deactivate,
} from "../../app/slices/citySlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import { Loader, Search } from "lucide-react";

export default function DestinationManager() {
  const dispatch = useDispatch();
  const { items, loading, search, page, limit } = useSelector(
    (s) => s.cities
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchCities({ search, page, limit }))
      .unwrap()
      .catch(() => {
        toast.error("Failed to load cities");
      });
  }, [dispatch, search, page, limit]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(city) {
    setEditItem(city);
    setModalOpen(true);
  }

  /* =========================
     ADD / EDIT CITY
  ========================== */
  async function handleSubmit(form) {
    const toastId = "city-save";

    try {
      toast.loading(
        editItem ? "Updating city..." : "Adding city...",
        { id: toastId }
      );

      if (editItem) {
        await dispatch(
          editCity({
            id: editItem.id,
            payload: form,
          })
        ).unwrap();

      } else {
        await dispatch(addCity(form)).unwrap();
      }
      dispatch(fetchCities({ search, page, limit }))
        .unwrap()
        .catch(() => {
          toast.error("Failed to load cities");
        });
      toast.success(
        editItem
          ? "City updated successfully"
          : "City added successfully",
        { id: toastId }
      );

      setModalOpen(false);
    } catch (err) {
      console.log(err.message);
      toast.error(
        err?.message || "Failed to save city. Please try again.",
        { id: toastId }
      );
    }
  }

  /* =========================
     DEACTIVATE CITY
  ========================== */
  async function handleDeactivate(id) {
    const toastId = "city-deactivate";

    try {
      toast.loading("Disabling city...", { id: toastId });

      await dispatch(deactivate(id)).unwrap();

      toast.success("City disabled successfully", { id: toastId });
      setConfirmId(null);
    } catch (err) {
      toast.error(
        err?.message || "Failed to disable city",
        { id: toastId }
      );
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Destinations & Stops</h2>
            <Button onClick={openCreate}>+ Add City</Button>
          </div>
          <div className="flex gap-3 mb-3 items-end">
            {/* <Input
            label="Search"
            value={search}
            onChange={(v) => dispatch(setCitySearch(v))}
            placeholder="City or region..."
          /> */}

            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search city name..."
                value={search}
                onChange={(e) => dispatch(setCitySearch(e.target.value))}
              />
              <InputGroupAddon align="inline-end">
                {items.length} results
              </InputGroupAddon>
            </InputGroup>

            {/* <Button
            variant="outline"
            onClick={() =>
              dispatch(
                fetchCities({
                  search,
                  page: 1,
                  limit,
                })
              )
            }
          >
            Refresh
          </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">City</th>
                  <th className="p-3 border-b">Code</th>
                  <th className="p-3 border-b">Country</th>
                  <th className="p-3 border-b">Type</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.filter(Boolean).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <div className="font-medium">{c.city}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{c.code}</div>
                    </td>

                    <td className="p-3">{c.country}</td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {c.isDestination === 1 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            Destination
                          </span>
                        )}
                        {c.isStop === 1 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Stop
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${c.status
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {c.status ? "active" : "inactive"}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openEdit(c)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmId(c.id)}
                      >
                        Disable
                      </Button> */}
                    </td>
                  </tr>
                ))}

                {loading == false && items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No cities found.
                    </td>
                  </tr>
                )}
                {loading == true && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Loading <Loader className="animate-spin mx-auto" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit City */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit City" : "Add City"}
            </DialogTitle>
          </DialogHeader>

          <CityForm
            initial={editItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Deactivate */}
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Disable City"
      >
        <p className="mb-4">
          Are you sure you want to disable this city?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeactivate(confirmId)}
          >
            Disable
          </Button>
        </div>
      </Modal>
    </div>
  );
}
