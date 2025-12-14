import ChartCard from "./ChartCard";
import { Line } from "react-chartjs-2";

export default function InquiriesChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Inquiries",
        data: [10, 14, 8, 20, 18, 12, 16],
        borderColor: "#3A7E75",
        backgroundColor: "rgba(58, 126, 117, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <ChartCard title="Weekly Inquiries">
      <Line data={data} />
    </ChartCard>
  );
}
