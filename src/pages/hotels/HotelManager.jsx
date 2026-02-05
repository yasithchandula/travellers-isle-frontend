import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import HotelForm from "../../components/forms/HotelForm";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon
} from "@/components/ui/input-group";

import {
  fetchHotels,
  addHotel,
  editHotel,
  disableHotel,
} from "../../app/slices/hotelSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchCities } from "../../app/slices/citySlice";
import { toast } from "sonner";

export default function HotelManager() {
  const dispatch = useDispatch();

  const { items = [], loading, page, limit } = useSelector((s) => s.hotels);
  const cities = useSelector((s) => s.cities.items || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  /* =======================
     Search
  ======================= */
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  const filteredItems = Array.isArray(items)
    ? items.filter((h) => {
      const matchesName =
        h.name?.toLowerCase().includes(search.toLowerCase());

      const matchesCity =
        cityFilter === "ALL" ||
        Number(h.city_id) === Number(cityFilter);


      return matchesName && matchesCity;
    })
    : [];



  /* =======================
     Initial Load
  ======================= */
  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 10 }));
    dispatch(fetchCities(""));
  }, [dispatch]);

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(hotel) {
    setEditItem(hotel);
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    const toastId = "hotel-save";

    try {
      toast.loading(
        editItem ? "Updating hotel..." : "Adding hotel...",
        { id: toastId }
      );

      if (editItem) {
        await dispatch(
          editHotel({ id: editItem.id, payload: form })
        ).unwrap();
      } else {
        await dispatch(addHotel(form)).unwrap();
      }

      toast.success(
        editItem ? "Hotel updated successfully" : "Hotel added successfully",
        { id: toastId }
      );
      dispatch(fetchHotels({ page: 1, limit: 10 }));
      setModalOpen(false);
      setEditItem(null);
    } catch (err) {
      toast.error(
        err?.message || "Failed to save hotel. Please try again.",
        { id: toastId }
      );
    }
  }


  function handleDisable(id) {
    dispatch(disableHotel(id));
    setConfirmId(null);
  }

  function getCityName(cityId) {
    return cities.find((c) => c.id === Number(cityId))?.city || "-";
  }

  return (
    <div>
      {/* Table */}
      <Card>
        <CardHeader>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Hotel Management</h2>
            <Button onClick={openCreate}>+ Add Hotel</Button>
          </div>
          <div className="flex gap-3 mb-3 items-end">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search hotel name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon align="inline-end">
                {filteredItems.length} results
              </InputGroupAddon>
            </InputGroup>

            {/* Excursion Filter */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[180px] border-black/20">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="ALL">All Cities</SelectItem>

                {cities
                  .filter((c) => c.isDestination)
                  .map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>


          </div>

        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md ">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">Hotel</th>
                  <th className="p-3 border-b">City</th>
                  <th className="p-3 border-b">Contact</th>
                  <th className="p-3 border-b">Driver Stay</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-48">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Hotel */}
                    <td className="p-3">
                      <div className="font-medium">{h.name}</div>
                      <div className="text-xs text-gray-500">
                        {h.address}
                      </div>
                    </td>

                    {/* City */}
                    <td className="p-3">
                      {getCityName(h.city_id)}
                    </td>

                    {/* Contact */}
                    <td className="p-3">
                      <div className="text-sm">{h.contact_name || "-"}</div>
                      <div className="text-xs text-gray-500">
                        {h.contact_phone || "-"}
                      </div>
                    </td>

                    {/* Driver Accommodation */}
                    <td className="p-3">
                      {h.driver_accommodation ? "Yes" : "No"}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${h.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {h.is_active ? "Active" : "Inactive"}
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
                      {/* <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setConfirmId(h.id)}
                      >
                        Disable
                      </Button> */}
                    </td>
                  </tr>
                ))}

                {!loading && filteredItems.length === 0 && (
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
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit Hotel" : "Add Hotel"}
            </DialogTitle>
          </DialogHeader>

          <HotelForm
            initial={editItem}
            cities={cities}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>


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
