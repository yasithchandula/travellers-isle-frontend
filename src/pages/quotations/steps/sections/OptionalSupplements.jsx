import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../../../../components/common/Card";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

export default function OptionalSupplements({ supplements, onChange }) {
  const allExcursions = useSelector((s) => s.excursions.items);

  const [search, setSearch] = useState("");
  const [local, setLocal] = useState(supplements || []);

  function update(list) {
    setLocal(list);
    onChange(list);
  }

  const results = useMemo(() => {
    const q = search.toLowerCase();
    return allExcursions.filter(
      (ex) =>
        ex.isOptional && // from your backend flag
        (!q ||
          ex.name.toLowerCase().includes(q) ||
          (ex.tags || []).some((t) => t.toLowerCase().includes(q)))
    );
  }, [search, allExcursions]);

  function addSupplement(ex) {
    if (local.find((s) => s.id === ex.id)) return; // avoid duplicates
    update([
      ...local,
      {
        id: ex.id,
        title: ex.name,
        price: ex.defaultOptionalPrice || 0,
        notes: "",
      },
    ]);
  }

  function updateItem(i, patch) {
    const list = [...local];
    list[i] = { ...list[i], ...patch };
    update(list);
  }

  function removeItem(i) {
    const list = [...local];
    list.splice(i, 1);
    update(list);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Search + Available Optional Items */}
      <Card>
        <h2 className="text-xl font-semibold mb-3">Add Optional Supplements</h2>

        <Input
          placeholder="Search excursions..."
          value={search}
          onChange={setSearch}
        />

        <div className="max-h-60 overflow-auto mt-3 flex flex-col gap-2">
          {results.map((ex) => (
            <div
              key={ex.id}
              className="border rounded p-3 flex justify-between items-center bg-gray-50"
            >
              <div className="font-medium">{ex.name}</div>
              <Button
                variant="outline"
                onClick={() => addSupplement(ex)}
                disabled={!!local.find((s) => s.id === ex.id)}
              >
                Add
              </Button>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No optional excursions found.
            </div>
          )}
        </div>
      </Card>

      {/* Selected Supplements */}
      <Card>
        <h2 className="text-xl font-semibold mb-3">Your Optional Supplements</h2>

        {local.length === 0 && (
          <div className="text-gray-500">No supplements added.</div>
        )}

        <div className="flex flex-col gap-4">
          {local.map((s, i) => (
            <div key={i} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <input
                  className="font-medium w-2/3 border px-2 py-1 rounded"
                  value={s.title}
                  onChange={(e) =>
                    updateItem(i, { title: e.target.value })
                  }
                />

                <Button
                  variant="danger"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input
                  label="Price (USD)"
                  type="number"
                  value={s.price}
                  onChange={(v) => updateItem(i, { price: Number(v) })}
                />

                <Input
                  label="Notes"
                  value={s.notes}
                  onChange={(v) => updateItem(i, { notes: v })}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
