import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale,LinearScale,CategoryScale,BarElement,  PointElement, LineElement, RadarController, Title, Tooltip, Legend } from 'chart.js';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

ChartJS.register(RadialLinearScale,LinearScale, CategoryScale,BarElement, PointElement, LineElement, RadarController, Title, Tooltip, Legend);

export default function CLOChartComponent({ descriptions, setDescriptions }) {
  const [selectedRadar, setSelectedRadar] = useState([]);
  const [radarChartData, setRadarChartData] = useState({ labels: [], datasets: [] });
  const [originalRadarData, setOriginalRadarData] = useState([]);
  const [allLabels, setAllLabels] = useState([]);

  const fetchRadarChartData = async () => {
    try {
      const response = await axiosAdmin.get('/achieved-rate/clo/percentage');
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
            datasetsMap[subject.subjectName].data[clo.cloName] = (clo.percentage_score * 100).toFixed(2);
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

      setRadarChartData({ labels: labelsArray, datasets });

      // Set default selected radar datasets
      setSelectedRadar(datasets.map(dataset => dataset.label));
    } catch (error) {
      console.error('Error fetching radar chart data:', error);
    }
  };

  useEffect(() => {
    fetchRadarChartData();
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

  const handleRadarSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedRadar(prev =>
      checked ? [...prev, value] : prev.filter(radar => radar !== value)
    );
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
        radius: 6,
        hoverRadius: 8
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
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
    <div className='mx-2'>
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
        <h2 className="text-xl font-semibold mb-4">CLO Data (Radar Chart)</h2>
        <Radar data={radarChartData} options={radarChartOptions} />
      </div>
    </div>
  );
}
