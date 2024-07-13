import React, { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Select, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Option } = Select;

const PLOChartComponent = ({ user }) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedPLO, setSelectedPLO] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [permission, setPermission] = useState();

  useEffect(() => {
    if (user && user.teacher_id) {
      console.log("User info:", user);
      setTeacherId(user.teacher_id);
      setPermission(user.permission);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data with:", { teacherId, permission });

      if (!teacherId || !permission) return;
      
      try {
        const response = await axiosAdmin.post('/achieved-rate/plo/percentage', {
          teacher_id: teacherId,
          permission: permission
        });
        console.log("Response data:", response.data);

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
  }, [teacherId, permission]);

  useEffect(() => {
    const filteredData = originalData.filter(plo => selectedPLO.includes(plo.name));
    setData(filteredData);
  }, [selectedPLO, originalData]);

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'PLOs',
        },
      },
      y: {
        title: {
          display: false,
          text: 'Percentage',
        },
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="plo-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-start rounded mb-3">
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </Button>
        {showFilter && (
          <div>
            <p className='text-left mb-1'>Chọn các chuẩn đầu ra hiển thị</p>
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
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ đạt của chuẩn đầu ra của chương trình</h2>
      <div className="h-[600px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PLOChartComponent;
