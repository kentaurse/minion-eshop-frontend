import React from 'react'
import {
    Chart as ChartJS,
    Filler,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Doughnut } from 'react-chartjs-2';

  ChartJS.register(ArcElement, Tooltip, Legend,
    Tooltip,
    Filler,
    Legend);

export default function CircleChart({ showData }) {
  
  
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      };
      
      let labels = [];
      showData?.map((item) => {
        return(
          labels.push(item?._id?.title)
        )
      });
      
      let datas = [];
      showData?.map((item) => {
        return(
          datas.push(item?.categoryProfit)
        )
      });
      
      const data = {
        labels,
        datasets: [
            {
                label: 'Monthly',
                data: datas,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                ],
                borderColor: [
                  '#ffffff',
                  '#ffffff',
                  '#ffffff',
                  '#ffffff',
                  '#ffffff',
                  '#ffffff',
                ],
                borderWidth: 2,
                borderRadius: 10,
              }
        ],
      };
    return (
    <div>
             <Doughnut options={options} data={data} />
    </div>
  )
}
