import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, RadarController, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, RadarController, Title, Tooltip, Legend);

export default function RadarChart({ radarChartData, selectedRadar, handleRadarSelection, originalRadarData, radarChartOptions }) {
  const radarChartFilteredData = {
    labels: radarChartData.labels,
    datasets: radarChartData.datasets.filter(dataset => selectedRadar.includes(dataset.label))
  };

  return (
    <div className='col-span-2 mx-3'>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Radar to Display</h2>
        <div className='flex gap-4'>
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
  );
}
