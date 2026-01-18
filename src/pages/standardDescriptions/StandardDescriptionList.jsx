import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Standard Descriptions
            </h1>

            <Link to="/standard-descriptions/new">
              <Button>+ New Description</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-5">
            <InputGroup className="border-black/20 focus:ring-2 focus:ring-black/20">
              <InputGroupInput onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or role..." className="color-black/20" />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">{filtered.length} Results</InputGroupAddon>
            </InputGroup>
          </div>

          <div className="overflow-auto rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3 border-b">Route</th>
                  <th className="p-3 border-b">Stops</th>
                  <th className="p-3 border-b">Tags</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-40">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Route */}
                    <td className="p-3">
                      <div className="font-medium">
                        {d.start} → {d.end}
                      </div>
                    </td>

                    {/* Stops */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {d.stops?.length ? (
                          d.stops.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {s}
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
                        {d.tags?.length ? (
                          d.tags.map((t, i) => (
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

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${d.isDraft
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {d.isDraft ? "Draft" : "Approved"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex gap-2">
                      <Link to={`/standard-descriptions/${d.id}`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-gray-500"
                    >
                      No standard descriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
