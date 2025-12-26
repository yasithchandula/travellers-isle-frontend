// Mock standard itinerary descriptions (day-wise templates)

const standardDescriptions = [
  {
    id: 101,
    title: "Colombo → Kandy Cultural Drive",
    start_city_id: 1,
    end_city_id: 2,
    description_html:
      "<h3>Colombo to Kandy</h3><p>Visit Pinnawala Elephant Orphanage and the Temple of the Tooth Relic.</p>",
    status: "active",
  },
  {
    id: 102,
    title: "Kandy → Nuwara Eliya Hill Country",
    start_city_id: 2,
    end_city_id: 3,
    description_html:
      "<h3>Kandy to Nuwara Eliya</h3><p>Tea plantations, waterfalls and cool climate experience.</p>",
    status: "active",
  },
  {
    id: 103,
    title: "Nuwara Eliya → Ella Scenic Journey",
    start_city_id: 3,
    end_city_id: 4,
    description_html:
      "<h3>Nuwara Eliya to Ella</h3><p>Scenic train journey and Nine Arch Bridge visit.</p>",
    status: "active",
  },
];

export async function getStandardDescriptions() {
  // simulate API delay
  await new Promise((r) => setTimeout(r, 300));
  return standardDescriptions.filter((d) => d.status === "active");
}
