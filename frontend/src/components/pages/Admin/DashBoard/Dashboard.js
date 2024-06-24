import React, { useEffect, useState } from 'react';
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
import { axiosAdmin } from '../../../../service/AxiosAdmin';

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
  const [user, setUser] = useState([])

  // Sample data for various charts
  const salesStats = [
    { name: 'Acme Plus', amount: 24780, color: '#4F46E5', sales: [5, 6, 8, 12, 10, 15] },
    { name: 'Acme Advanced', amount: 17489, color: '#10B981', sales: [7, 8, 12, 14, 16, 18] },
    { name: 'Acme Professional', amount: 9962, color: '#F59E0B', sales: [3, 5, 6, 8, 9, 11] },
  ];

  const directIndirectSales = {
    labels: ['Dec 30', 'Jan 1', 'Feb 21', 'Mar 12', 'Apr 21', 'May 21'],
    datasets: [
      {
        label: 'Direct',
        data: [12000, 15000, 18000, 20000, 22000, 25000],
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Indirect',
        data: [20000, 23000, 25000, 27000, 30000, 33000],
        backgroundColor: '#10B981',
      },
    ],
  };

  const realTimeValue = {
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
    datasets: [
      {
        label: 'Value',
        data: [50, 52, 54, 53, 51, 59],
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        fill: false,
      },
    ],
  };

  const topCountriesData = {
    labels: ['United States', 'Italy', 'Other'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'],
      },
    ],
  };

  const topChannelsData = {
    labels: ['GitHub.com', 'Twitter', 'Google (organic)', 'Vimeo.com', 'linkedin.com'],
    datasets: [
      {
        label: 'Visitors',
        data: [2400, 1800, 2000, 1500, 1200],
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Revenues',
        data: [3077, 2048, 2444, 1820, 2034],
        backgroundColor: '#10B981',
      },
      {
        label: 'Sales',
        data: [267, 249, 224, 204, 194],
        backgroundColor: '#F59E0B',
      },
    ],
  };

  const salesOverTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Current',
        data: [1500, 2000, 2500, 3000, 3500, 4000],
        borderColor: '#4F46E5',
        backgroundColor: '#4F46E5',
        fill: false,
      },
      {
        label: 'Previous',
        data: [1200, 1700, 2200, 2700, 3200, 3700],
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        fill: false,
      },
    ],
  };

  const salesVsRefundsData = {
    labels: ['Dec 30', 'Jan 1', 'Feb 21', 'Mar 12', 'Apr 21', 'May 21'],
    datasets: [
      {
        label: 'Sales',
        data: [1500, 2000, 2500, 3000, 3500, 4000],
        backgroundColor: '#4F46E5',
      },
      {
        label: 'Refunds',
        data: [200, 300, 400, 500, 600, 700],
        backgroundColor: '#F87171',
      },
    ],
  };

  const customersData = [
    { name: 'Alex Shatov', email: 'alexshatov@gmail.com', spent: 3040, country: 'US' },
    { name: 'Philip Harbach', email: 'philip.h@gmail.com', spent: 2970, country: 'DE' },
    { name: 'Mirko Fisuk', email: 'mirkofisuk@gmail.com', spent: 2490, country: 'IT' },
    { name: 'Olga Semklo', email: 'olga.s.design@gmail.com', spent: 1760, country: 'RU' },
    { name: 'Bartek Long', email: 'long.bart@gmail.com', spent: 1560, country: 'GA' },
  ];

  const reasonsForRefundsData = {
    labels: ['Having difficulties using the product', 'Missing features I need', 'Not satisfied with the quality of the product', 'The product doesn\'t look as advertised', 'Other'],
    datasets: [
      {
        label: 'Reasons for Refunds',
        data: [29, 23, 19, 15, 14],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#F87171', '#34D399'],
      },
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        const user = response.data;

        console.log(user);
        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Good afternoon, {user.name }. 👋</h1>
          <p>Here is what's happening with your projects today:</p>
        </div>
        <div className="flex items-center">
          <input type="date" className="border border-gray-300 p-2 rounded-md mr-4" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Add View</button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {salesStats.map((stat, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{stat.name}</h2>
            <p className="text-2xl font-bold text-gray-800 mb-2">${stat.amount.toLocaleString()}</p>
            <Line data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Sales',
                data: stat.sales,
                borderColor: stat.color,
                backgroundColor: stat.color,
                fill: false,
              }],
            }} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Direct vs Indirect Sales</h2>
          <Bar data={directIndirectSales} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Value</h2>
          <Line data={realTimeValue} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Top Countries</h2>
          <Pie data={topCountriesData} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Over Time (all stores)</h2>
          <Line data={salesOverTimeData} />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sales vs Refunds</h2>
          <Bar data={salesVsRefundsData} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-right p-2">Spent</th>
                <th className="text-left p-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {customersData.map((customer, index) => (
                <tr key={index}>
                  <td className="p-2">{customer.name}</td>
                  <td className="p-2">{customer.email}</td>
                  <td className="p-2 text-right">${customer.spent.toLocaleString()}</td>
                  <td className="p-2">{customer.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reasons for Refunds</h2>
          <Bar data={reasonsForRefundsData} />
        </div>
      </div>
    </div>
  );
}
