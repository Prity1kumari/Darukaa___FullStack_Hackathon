import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: {
          family: 'Inter, sans-serif',
          size: 11,
        },
      },
    },
    tooltip: {
      backgroundColor: '#121e21',
      titleColor: '#ffffff',
      bodyColor: '#cbd5e1',
      borderColor: '#1e3237',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(30, 50, 55, 0.6)',
      },
      ticks: {
        color: '#64748b',
        font: { size: 10 },
      },
    },
    y: {
      grid: {
        color: 'rgba(30, 50, 55, 0.6)',
      },
      ticks: {
        color: '#64748b',
        font: { size: 10 },
      },
    },
  },
};
