import React, { useEffect, useState } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, RadarController, Title, Tooltip, Legend } from 'chart.js';
import { Container, Card, Button, Input, Spacer } from '@nextui-org/react';
import axios from 'axios';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

// Register the necessary components with Chart.js
ChartJS.register(CategoryScale, RadialLinearScale, LinearScale, PointElement, LineElement, BarElement, RadarController, Title, Tooltip, Legend);

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [selectedLines, setSelectedLines] = useState(['Acme Plus', 'Acme Advanced', 'Acme Professional']);
  const [selectedBars, setSelectedBars] = useState(['Acme Plus', 'Acme Advanced', 'Acme Professional']);
  const [selectedRadar, setSelectedRadar] = useState([]);
  const [radarChartData, setRadarChartData] = useState({
    labels: [],
    datasets: []
  });

  const [originalRadarData, setOriginalRadarData] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [descriptions, setDescriptions] = useState({});

  // Sample data for various charts
  const salesStats = [
    { name: 'Acme Plus', amount: 24780, color: '#4F46E5', sales: [5, 6, 8, 12, 10, 15] },
    { name: 'Acme Advanced', amount: 17489, color: '#10B981', sales: [7, 8, 12, 14, 16, 18] },
    { name: 'Acme Professional', amount: 9962, color: '#F59E0B', sales: [3, 5, 6, 8, 9, 11] },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: salesStats.filter(stat => selectedLines.includes(stat.name)).map(stat => ({
      label: stat.name,
      data: stat.sales,
      borderColor: stat.color,
      backgroundColor: stat.color,
      fill: false,
    }))
  };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: salesStats.filter(stat => selectedBars.includes(stat.name)).map(stat => ({
      label: stat.name,
      data: stat.sales,
      backgroundColor: stat.color,
    }))
  };

  const fetchRadarChartData = async () => {
    try {
      const response = await axiosAdmin.get('/courses/assessment-scores');
      const data = response.data;

      const labelsSet = new Set();
      const datasetsMap = {};
      const descriptionsMap = {};

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          labelsSet.add(clo.cloName);
          descriptionsMap[clo.cloName] = clo.description;
          if (!datasetsMap[subject.subjectName]) {
            datasetsMap[subject.subjectName] = {
              label: subject.subjectName,
              data: {},
              fill: true,
              backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
              borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
              pointBackgroundColor: '#6FDCE3',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#5C2FC2',
              pointHoverBorderColor: '#fff',
            };
          }
        });
      });

      const labelsArray = Array.from(labelsSet);

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          if (!datasetsMap[subject.subjectName].data[clo.cloName]) {
            datasetsMap[subject.subjectName].data[clo.cloName] = clo.percentage_score * 100;
          }
        });
      });

      const datasets = Object.values(datasetsMap).map(dataset => ({
        ...dataset,
        data: labelsArray.map(label => dataset.data[label] || null)
      }));

      setOriginalRadarData(datasets);
      setAllLabels(labelsArray);
      setDescriptions(descriptionsMap);

      setRadarChartData({
        labels: labelsArray,
        datasets
      });

      // Set default selected radar datasets
      setSelectedRadar(datasets.map(dataset => dataset.label));

    } catch (error) {
      console.error('Error fetching radar chart data:', error);
    }
  };

  useEffect(() => {
    fetchRadarChartData();

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

  useEffect(() => {
    const selectedDatasets = originalRadarData.filter(dataset => selectedRadar.includes(dataset.label));
    const selectedLabelsSet = new Set();

    selectedDatasets.forEach(dataset => {
      dataset.data.forEach((score, index) => {
        if (score > 0) {
          selectedLabelsSet.add(allLabels[index]);
        }
      });
    });

    const newLabels = Array.from(selectedLabelsSet);

    setRadarChartData({
      labels: newLabels,
      datasets: selectedDatasets.map(dataset => ({
        ...dataset,
        data: newLabels.map(label => {
          const index = allLabels.indexOf(label);
          return dataset.data[index];
        })
      }))
    });
  }, [selectedRadar]);

  const handleLineSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedLines(prev =>
      checked ? [...prev, value] : prev.filter(line => line !== value)
    );
  };

  const handleBarSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedBars(prev =>
      checked ? [...prev, value] : prev.filter(bar => bar !== value)
    );
  };

  const handleRadarSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedRadar(prev =>
      checked ? [...prev, value] : prev.filter(radar => radar !== value)
    );
  };

  const radarChartFilteredData = {
    labels: radarChartData.labels,
    datasets: radarChartData.datasets.filter(dataset => selectedRadar.includes(dataset.label))
  };

  const radarChartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    },
    elements: {
      point: {
        radius: 6, // Increase point size
        hoverRadius: 8
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            // const label = context.dataset.label || '';
            const value = context.raw;
            const cloName = context.label;
            const description = descriptions[cloName] || '';
            return `Tỉ lệ đạt được là ${value} %\n\n${description}`;
          }
        }
      }
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Chào bạn {user.name}. 👋</h1>
          <p className='text-left'>Dưới đây là các biểu đồ</p>
        </div>
        <div className="flex items-center">
          <Input type="date" className="mr-4" />
          <Button>Add View</Button>
        </div>
      </header>
      <div className='grid grid-cols-2'>
        <div className='mx-3'>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Lines to Display</h2>
            <div className='flex gap-3'>
              {salesStats.map((stat, index) => (
                <div key={index} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value={stat.name}
                      checked={selectedLines.includes(stat.name)}
                      onChange={handleLineSelection}
                      className="mr-2"
                    />
                    {stat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sales Data (Line Chart)</h2>
            <Line data={lineChartData} />
          </div>
        </div>

        <div className='mx-3'>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Bars to Display</h2>
            <div className='flex gap-3'>
              {salesStats.map((stat, index) => (
                <div key={index} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value={stat.name}
                      checked={selectedBars.includes(stat.name)}
                      onChange={handleBarSelection}
                      className="mr-2"
                    />
                    {stat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sales Data (Bar Chart)</h2>
            <Bar data={barChartData} />
          </div>
        </div>

        <div className='col-span-2 mx-3'>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Radar to Display</h2>
            <div className='flex'>
              {originalRadarData.map((dataset, index) => (
                <div key={index} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value={dataset.label}
                      checked={selectedRadar.includes(dataset.label)}
                      onChange={handleRadarSelection}
                      className="mr-2"
                    />
                    {dataset.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Sales Data (Radar Chart)</h2>
            <Radar data={radarChartFilteredData} options={radarChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
