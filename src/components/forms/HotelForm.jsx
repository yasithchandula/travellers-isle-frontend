import { useEffect, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";


export default function HotelForm({ cities, initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [cityId, setCityId] = useState(initial?.cityId || "");
  const [vatNumber, setVatNumber] = useState(initial?.vatNumber || "");
  const [sltdaReg, setSltdaReg] = useState(initial?.sltdaReg || "");

  // Meal plans
  const [mealPlans, setMealPlans] = useState(initial?.mealPlans || ["BB", "HB", "FB"]);

  // Room categories
  const [roomCategories, setRoomCategories] = useState(initial?.roomCategories || []);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");

  // Driver accommodation
  const [driverPrice, setDriverPrice] = useState(initial?.driverAccommodation?.priceUSD || 0);
  const [driverNotes, setDriverNotes] = useState(initial?.driverAccommodation?.notes || "");

  // Special pricing contact
  const [contactName, setContactName] = useState(initial?.specialPricingContact?.name || "");
  const [contactPhone, setContactPhone] = useState(initial?.specialPricingContact?.phone || "");

  const [earlyCI, setEarlyCI] = useState(initial?.earlyCheckinUSD || 0);
  const [lateCO, setLateCO] = useState(initial?.lateCheckoutUSD || 0);

  function addRoom() {
    if (!roomName.trim()) return;
    setRoomCategories([
      ...roomCategories,
      { name: roomName.trim(), basePriceUSD: Number(roomPrice) || 0 }
    ]);
    setRoomName("");
    setRoomPrice("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name,
      address,
      cityId: Number(cityId),
      vatNumber,
      sltdaReg,
      mealPlans,
      roomCategories,

      driverAccommodation: {
        priceUSD: Number(driverPrice),
        notes: driverNotes,
      },

      specialPricingContact: {
        name: contactName,
        phone: contactPhone,
      },

      earlyCheckinUSD: Number(earlyCI),
      lateCheckoutUSD: Number(lateCO),
    });
  }

  return (
    <form onSubmit={handleSubmit}>

      <Input label="Hotel Name" value={name} onChange={setName} />

      <Input label="Address" value={address} onChange={setAddress} />

      <div className="mb-3">
        <label className="block mb-1 text-sm">City (Destination)</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
        >
          <option value="">Select City</option>
          {cities
            .filter((c) => c.isDestination)
            .map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
      </div>

      <Input label="VAT Number" value={vatNumber} onChange={setVatNumber} />
      <Input label="SLTDA Registration" value={sltdaReg} onChange={setSltdaReg} />

      {/* Room Categories */}
      <div className="my-4 p-3 border rounded">
        <h3 className="font-semibold mb-2">Room Categories</h3>

        {roomCategories.map((r, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{r.name}</span>
            <span className="text-gray-600">${r.basePriceUSD}</span>
          </div>
        ))}

        <div className="flex gap-2 mt-3">
          <input
            className="border px-2 py-1 rounded w-1/2"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            className="border px-2 py-1 rounded w-1/3"
            placeholder="Price USD"
            type="number"
            value={roomPrice}
            onChange={(e) => setRoomPrice(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={addRoom}>Add</Button>
        </div>
      </div>

      {/* Driver Accommodation */}
      <div className="my-4 p-3 border rounded">
        <h3 className="font-semibold mb-2">Driver Accommodation</h3>
        <Input label="Driver Price (USD)" value={driverPrice} onChange={setDriverPrice} />
        <Input label="Notes" value={driverNotes} onChange={setDriverNotes} />
      </div>

      {/* Special pricing contact */}
      <div className="my-4 p-3 border rounded">
        <h3 className="font-semibold mb-2">Special Pricing Contact</h3>
        <Input label="Contact Name" value={contactName} onChange={setContactName} />
        <Input label="Contact Phone" value={contactPhone} onChange={setContactPhone} />
      </div>

      {/* Early & Late */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Early Check-In (USD)" value={earlyCI} onChange={setEarlyCI} />
        <Input label="Late Check-Out (USD)" value={lateCO} onChange={setLateCO} />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? "Save Changes" : "Add Hotel"}</Button>
      </div>
    </form>
  );
}
