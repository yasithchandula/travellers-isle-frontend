import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

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

  /* ======================
     Driver Accommodation
  ====================== */
  const [hasDriverAccommodation, setHasDriverAccommodation] = useState(
    !!initial?.driver_accommodation
  );

  /* ======================
     Add Room
  ====================== */
  function addRoom() {
    if (!roomName || !roomPrice || !roomCount) return;

    setRoomCategories([
      ...roomCategories,
      {
        name: roomName.trim(),
        pax: Number(roomCount),
        price: Number(roomPrice),
      },
    ]);

    setRoomName("");
    setRoomPrice("");
    setRoomCount("");
  }

  /* ======================
     Submit
  ====================== */
  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      address,
      city_id: Number(cityId),
      vat_number: vatNumber,
      sltda_registration: sltdaReg,
      driver_accommodation: hasDriverAccommodation,
      contact_name: contactName,
      contact_phone: contactPhone,
      room_categories: roomCategories,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input label="Hotel Name" value={name} onChange={setName} />
        <Input label="Address" value={address} onChange={setAddress} />
      </div>

      {/* City */}
      <div>
        <label className="block mb-1 text-xs font-medium">
          City (Destination)
        </label>
        <select
          className="w-full border rounded px-2 py-1.5 text-sm"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
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
      </div>

      {/* Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="VAT Number"
          value={vatNumber}
          onChange={setVatNumber}
        />
        <Input
          label="SLTDA Registration"
          value={sltdaReg}
          onChange={setSltdaReg}
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Contact Name"
          value={contactName}
          onChange={setContactName}
        />
        <Input
          label="Contact Phone"
          value={contactPhone}
          onChange={setContactPhone}
        />
      </div>

      {/* Room Categories */}
      <div className="p-3 border rounded space-y-2">
        <h3 className="text-sm font-semibold">Room Categories</h3>

        {roomCategories.map((r, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{r.name}</span>
            <span>
              {r.pax} pax – LKR {r.price}
            </span>
          </div>
        ))}

        <div className="grid grid-cols-12 gap-2 pt-2">
          <input
            className="col-span-4 border px-2 py-1 rounded text-sm"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            className="col-span-3 border px-2 py-1 rounded text-sm"
            placeholder="Max Occupancy"
            type="number"
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
          />
          <input
            className="col-span-3 border px-2 py-1 rounded text-sm"
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
          size="md"
        >
          Cancel
        </Button>
        <Button type="submit" size="md">
          {initial ? "Save Changes" : "Add Hotel"}
        </Button>
      </div>
    </form>
  );
}
