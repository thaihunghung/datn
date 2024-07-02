import React, { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Select, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Option } = Select;

const PLOChartComponent = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedPLO, setSelectedPLO] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.get('/achieved-rate/plo/percentage');
        const ploData = response.data[0].plos.map((plo) => ({
          name: plo.ploName,
          percentage: (plo.percentage_score * 100).toFixed(2),
        }));
        setData(ploData);
        setOriginalData(ploData);
        setSelectedPLO(ploData.map(plo => plo.name));
      } catch (error) {
        console.error('Error fetching PLO data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = originalData.filter(plo => selectedPLO.includes(plo.name));
    setData(filteredData);
  }, [selectedPLO]);

  const handlePLOSelection = (value) => {
    setSelectedPLO(value);
  };

  const ploNames = data.map(plo => plo.name);
  const ploPercentages = data.map(plo => plo.percentage);

  const chartData = {
    labels: ploNames,
    datasets: [
      {
        label: 'Tỉ lệ Plo đạt được',
        data: ploPercentages,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="plo-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-start rounded">
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </Button>
        {showFilter && (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select PLOs"
            defaultValue={selectedPLO}
            onChange={handlePLOSelection}
          >
            {originalData.map(plo => (
              <Option key={plo.name} value={plo.name}>
                {plo.name}
              </Option>
            ))}
          </Select>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ đạt của chuẩn đầu ra của chương trình</h2>
      <Line data={chartData} />
    </div>
  );
};

export default PLOChartComponent;
