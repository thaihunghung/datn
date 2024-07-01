import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Select, Button } from 'antd';

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-indigo-500/50 text-white rounded-md p-1 text-sm">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Tỉ lệ đạt được: ${payload[0].value}%`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="plo-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <Button
        onClick={() => setShowFilter(!showFilter)}
        className="flex justify-start rounded mb-4">
        {showFilter ? 'Hide Filter' : 'Show Filter'}
      </Button>
      {showFilter && (
        <Select
          mode="multiple"
          placeholder="Chọn PLO"
          value={selectedPLO}
          onChange={handlePLOSelection}
          className="w-full mb-4"
        >
          {originalData.map((plo, index) => (
            <Option key={index} value={plo.name}>
              {plo.name}
            </Option>
          ))}
        </Select>
      )}
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ đạt được của chuẩn đầu ra chương trình</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="percentage" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PLOChartComponent;
