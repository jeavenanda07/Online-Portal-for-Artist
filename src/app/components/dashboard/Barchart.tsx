"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  values: number[];
}

export default function BarChart({ labels, values }: BarChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: "Logins",
        data: values,
        backgroundColor: "rgba(57, 255, 106, 0.15)",
        borderColor: "rgba(57, 255, 106, 0.8)",
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(57, 255, 106, 0.3)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0a130a",
        borderColor: "#1a3a1a",
        borderWidth: 1,
        titleColor: "#c8e6c8",
        bodyColor: "#39ff6a",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4a6a4a", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(26, 46, 26, 0.8)" },
        ticks: { color: "#4a6a4a", font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} />;
}