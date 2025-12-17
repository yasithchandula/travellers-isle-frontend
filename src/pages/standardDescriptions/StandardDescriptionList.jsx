import { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Link } from "react-router-dom";

export default function StandardDescriptionList() {
  const [search, setSearch] = useState("");

  // SAMPLE DATA
  const sample = [
    {
      id: 1,
      start: "Colombo",
      end: "Kandy",
      stops: ["Pinnawala"],
      tags: ["family", "culture"],
      isDraft: false,
    },
    {
      id: 2,
      start: "Sigiriya",
      end: "Trincomalee",
      stops: ["Dambulla"],
      tags: ["beach"],
      isDraft: true,
    },
  ];

  const filtered = sample.filter(
    (d) =>
      d.start.toLowerCase().includes(search.toLowerCase()) ||
      d.end.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Standard Descriptions
        </h1>

        <Link to="/standard-descriptions/new">
          <Button>+ New Description</Button>
        </Link>
      </div>

      <Card>
        <div className="flex gap-3 mb-5">
          <Input
            label="Search"
            value={search}
            onChange={setSearch}
            placeholder="Start city, End city..."
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Route</th>
              <th className="py-2 text-left">Stops</th>
              <th className="py-2 text-left">Tags</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="py-3">{d.start} → {d.end}</td>
                <td>{d.stops.join(", ")}</td>
                <td>{d.tags.join(", ")}</td>
                <td>
                  {d.isDraft ? (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-sm">
                      Draft
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-ti-mint/30 text-ti-teal text-sm">
                      Approved
                    </span>
                  )}
                </td>
                <td>
                  <Link to={`/standard-descriptions/${d.id}`}>
                    <Button variant="secondary" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
