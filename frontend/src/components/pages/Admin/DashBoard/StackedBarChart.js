import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const processData = (data) => {
  const labels = data.map(item => item.ploName);
  const subjectNames = [...new Set(data.flatMap(item => item.subjects.map(sub => sub.subjectName)))];

  const datasets = subjectNames.map(subject => ({
    label: subject,
    data: data.map(item => {
      const found = item.subjects.find(sub => sub.subjectName === subject);
      return found ? found.contributionPercentage : 0;
    }),
    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
  }));

  return {
    labels,
    datasets
  };
};

const options = {
  plugins: {
    title: {
      display: false,
      text: 'Stacked Bar Chart'
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          const datasetLabel = tooltipItem.dataset.label || '';
          const value = tooltipItem.raw;
          return value > 0 ? `${datasetLabel}: ${value} %` : '';
        }
      }
    },
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 14
        }
      }
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
};

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosAdmin.post('/getPloPercentageContainSubject')
      .then(response => {
        const data = response.data;
        setChartData(processData(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white shadow-md rounded-lg p-6 mb-6 h-[700px]'>
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ chuẩn đầu ra của chương trình đào tạo</h2>
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
};

export default StackedBarChart;
