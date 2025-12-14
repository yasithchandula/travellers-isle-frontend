import ChartCard from "./ChartCard";
import { Pie } from "react-chartjs-2";

export default function ConversionPie() {
  const data = {
    labels: ["Confirmed", "Pending", "Rejected"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#3A7E75", "#A7D3C4", "#E97171"],
      },
    ],
  };

  return (
    <ChartCard title="Quotation Conversion Rate">
      <Pie data={data} />
    </ChartCard>
  );
}
