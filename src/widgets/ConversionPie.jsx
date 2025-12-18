import { Pie } from "react-chartjs-2";

export default function ConversionPie() {
  const data = {
    labels: ["Confirmed", "Pending", "Rejected"],
    datasets: [
      {
        data: [45, 35, 20],
      },
    ],
  };

  return (
    <div className="flex items-center justify-center h-[280px]">
      <Pie data={data} />
    </div>
  );
}
