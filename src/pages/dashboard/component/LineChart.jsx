import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function LineChart({ showData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  let labels = [ ];

    showData?.map((item) => {
      return(
        labels.push(item.date)
      )
    });

    let datas = [];

    showData?.map((item) => {
      return(
        datas.push(item.price)
      )
    });


  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "line",
        data: datas,
        borderColor: "#09BBDC",
        backgroundColor: "#9FF0FF70",
      },
    ],
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
}
