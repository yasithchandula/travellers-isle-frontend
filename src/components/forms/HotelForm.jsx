import { useState } from "react";
import { toast } from "sonner";
import Input from "../common/Input";
import Button from "../common/Button";
import { Circle, CircleX, CircleXIcon, Delete, DeleteIcon, Trash } from "lucide-react";

export default function HotelForm({ cities, initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [cityId, setCityId] = useState(initial?.city_id || "");
  const [vatNumber, setVatNumber] = useState(initial?.vat_number || "");
  const [sltdaReg, setSltdaReg] = useState(initial?.sltda_registration || "");

  /* ======================
     Contact
  ====================== */
  const [contactName, setContactName] = useState(
    initial?.contact_name || ""
  );
  const [contactPhone, setContactPhone] = useState(
    initial?.contact_phone || ""
  );

  /* ======================
     Room Categories
  ====================== */
  const [roomCategories, setRoomCategories] = useState(
    initial?.room_categories || []
  );
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [phoneNumber, setPhone] = useState("");

  /* ======================
     Driver Accommodation
  ====================== */
  const [hasDriverAccommodation, setHasDriverAccommodation] = useState(
    !!initial?.driver_accommodation
  );

  const [errors, setErrors] = useState({});

  /* ======================
     VALIDATION
  ====================== */
  function validate() {
    const e = {};

    if (!name.trim()) e.name = "Hotel name is required";
    if (!address.trim()) e.address = "Address is required";
    if (!cityId) e.cityId = "City is required";
    if (!phoneNumber.trim()) e.phoneNumber = "Phone number is required";

    // if (!contactName.trim()) e.contactName = "Contact name is required";
    // if (!contactPhone.trim()) e.contactPhone = "Contact phone is required";

    if (!roomCategories.length) {
      e.roomCategories = "At least one room category is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ======================
     Add Room
  ====================== */
  function addRoom() {
    if (!roomName.trim() || !roomCount) return;

    setRoomCategories([
      ...roomCategories,
      {
        name: roomName.trim(),
        pax: Number(roomCount),
        price: Number(roomPrice || 0),
      },
    ]);

    setRoomName("");
    setRoomPrice("");
    setRoomCount("");

    if (errors.roomCategories) {
      setErrors((p) => ({ ...p, roomCategories: null }));
    }
  }

  /* ======================
     Submit
  ====================== */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    onSubmit({
      name: name.trim(),
      address: address.trim(),
      city_id: Number(cityId),
      vat_number: vatNumber.trim(),
      sltda_registration: sltdaReg.trim(),
      driver_accommodation: hasDriverAccommodation,
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      room_categories: roomCategories,
      phone_number: phoneNumber.trim(),
    });
  }

  function removeRoom(index) {
    setRoomCategories(roomCategories.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            label="Hotel Name"
            value={name}
            onChange={(v) => {
              setName(v);
              if (errors.name) setErrors((p) => ({ ...p, name: null }));
            }}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Input
            label="Address"
            value={address}
            onChange={(v) => {
              setAddress(v);
              if (errors.address)
                setErrors((p) => ({ ...p, address: null }));
            }}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="text-sm text-ti-forest">
          City (Destination)
        </label>
        <select
          className={`w-full border rounded px-2 py-1.5 text-sm ${errors.cityId ? "border-red-500" : ""
            }`}
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            if (errors.cityId)
              setErrors((p) => ({ ...p, cityId: null }));
          }}
        >
          <option value="">Select City</option>
          {cities
            .filter((c) => c.isDestination)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
        </select>
        {errors.cityId && (
          <p className="text-xs text-red-500 mt-1">{errors.cityId}</p>
        )}
      </div>

      <div>
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChange={(v) => {
            setPhone(v);
            if (errors.phoneNumber)
              setErrors((p) => ({ ...p, phoneNumber: null }));
          }}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-500 mt-1">
            {errors.phoneNumber}
          </p>
        )}
      </div>

      {/* Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="VAT Number (Optional)"
          value={vatNumber}
          onChange={setVatNumber}
        />
        <Input
          label="SLTDA Registration (Optional)"
          value={sltdaReg}
          onChange={setSltdaReg}
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Input
            label="Contact Name"
            value={contactName}
            onChange={(v) => {
              setContactName(v);
              if (errors.contactName)
                setErrors((p) => ({ ...p, contactName: null }));
            }}
            className={errors.contactName ? "border-red-500" : ""}
          />
          {errors.contactName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.contactName}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Contact Phone"
            value={contactPhone}
            onChange={(v) => {
              setContactPhone(v);
              if (errors.contactPhone)
                setErrors((p) => ({ ...p, contactPhone: null }));
            }}
            className={errors.contactPhone ? "border-red-500" : ""}
          />
          {errors.contactPhone && (
            <p className="text-xs text-red-500 mt-1">
              {errors.contactPhone}
            </p>
          )}
        </div>
      </div>

      {/* Room Categories */}
      <div className="p-3 border rounded space-y-2">
        <h3 className="text-sm font-semibold">Room Categories</h3>

        <table>
          {roomCategories.map((r, i) => (
            <tr key={i} className="text-sm hover:bg-gray-50 transition">
              <td className="pr-3"><CircleXIcon onClick={() => removeRoom(i)} className="w-4 h-4 mt-1 hover:text-red-400 text-gray-500 cursor-pointer" /></td>
              <td>{r.name}</td>
              <td className="pl-3">{r.pax} pax</td>
            </tr>
          ))}
        </table>

        {/* {roomCategories.map((r, i) => (
          <div key={i} className="flex gap-5 text-sm">
            <span>{r.name}</span>
            <span>{r.pax} pax</span>
            <span><CircleXIcon onClick={() => removeRoom(i)} className="w-4 h-4 mt-1 hover:text-red-400 text-gray-500 cursor-pointer" /></span>
          </div>
        ))} */}

        {errors.roomCategories && (
          <p className="text-xs text-red-500">
            {errors.roomCategories}
          </p>
        )}

        <div className="grid grid-cols-12 gap-2 pt-2">
          <input
            className="col-span-4 border px-2 py-1 rounded text-sm"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            className="col-span-3 border px-2 py-1 rounded text-sm"
            placeholder="Pax"
            type="number"
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
          />
          <input
            className="col-span-3 border px-2 py-1 rounded text-sm hidden"
            placeholder="Amount"
            type="number"
            value={roomPrice}
            onChange={(e) => setRoomPrice(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="col-span-2"
            onClick={addRoom}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Driver Accommodation */}
      <div className="p-3 border rounded space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={hasDriverAccommodation}
            onChange={(e) => setHasDriverAccommodation(e.target.checked)}
          />
          Driver Accommodation Available
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" >
          {initial ? "Save Changes" : "Add Hotel"}
        </Button>
      </div>
    </form>
  );
}
