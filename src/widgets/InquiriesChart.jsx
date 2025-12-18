import { Line } from "react-chartjs-2";

export default function InquiriesChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Inquiries",
        data: [10, 14, 8, 20, 18, 12, 16],
        borderWidth: 2,
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="h-[280px]">
      <Line data={data} />
    </div>
  );
}
