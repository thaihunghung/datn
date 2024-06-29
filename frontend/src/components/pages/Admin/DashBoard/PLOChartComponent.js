import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const PLOChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.get('/achieved-rate/plo/percentage');
        const ploData = response.data[0].plos.map((plo) => ({
          name: plo.ploName,
          percentage: (plo.percentage_score * 100).toFixed(2),
        }));
        setData(ploData);
      } catch (error) {
        console.error('Error fetching PLO data:', error);
      }
    };

    fetchData();
  }, []);

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
    <div className="plo-chart">
      <h2 className="text-2xl font-bold mb-4">PLO Achievement Rates</h2>
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
