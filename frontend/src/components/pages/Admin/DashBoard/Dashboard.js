import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
// import 'tailwindcss/tailwind.css';
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
  Legend
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  // Sample data
  const teacherStats = [
    { name: 'Jan', active: 30, inactive: 10 },
    { name: 'Feb', active: 25, inactive: 15 },
    { name: 'Mar', active: 35, inactive: 5 },
    { name: 'Apr', active: 40, inactive: 0 },
    { name: 'May', active: 50, inactive: 5 },
    { name: 'Jun', active: 45, inactive: 10 },
  ];

  const studentStats = [
    { name: 'Jan', active: 200, inactive: 50 },
    { name: 'Feb', active: 180, inactive: 70 },
    { name: 'Mar', active: 220, inactive: 30 },
    { name: 'Apr', active: 240, inactive: 20 },
    { name: 'May', active: 260, inactive: 10 },
    { name: 'Jun', active: 250, inactive: 40 },
  ];

  const teacherLineData = {
    labels: teacherStats.map(stat => stat.name),
    datasets: [
      {
        label: 'Active Teachers',
        data: teacherStats.map(stat => stat.active),
        fill: false,
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Inactive Teachers',
        data: teacherStats.map(stat => stat.inactive),
        fill: false,
        borderColor: '#F87171',
        backgroundColor: '#F87171',
      },
    ],
  };

  const studentBarData = {
    labels: studentStats.map(stat => stat.name),
    datasets: [
      {
        label: 'Active Students',
        data: studentStats.map(stat => stat.active),
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Inactive Students',
        data: studentStats.map(stat => stat.inactive),
        backgroundColor: '#F87171',
      },
    ],
  };

  const summaryPieData = {
    labels: ['Active Teachers', 'Inactive Teachers', 'Active Students', 'Inactive Students'],
    datasets: [
      {
        data: [
          teacherStats.reduce((sum, stat) => sum + stat.active, 0),
          teacherStats.reduce((sum, stat) => sum + stat.inactive, 0),
          studentStats.reduce((sum, stat) => sum + stat.active, 0),
          studentStats.reduce((sum, stat) => sum + stat.inactive, 0),
        ],
        backgroundColor: ['#4F46E5', '#F87171', '#34D399', '#FBBF24'],
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Teachers Stats</h2>
          <Line data={teacherLineData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Students Stats</h2>
          <Bar data={studentBarData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <Pie
          className=''
            data={summaryPieData} />
        </div>
      </div>
    </div>
  );
}
