import React, { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import BarChartComponent from './BarChartComponent';
import CLOChartComponent from './CLOChartComponent';
import PLOChartComponent from './PLOChartComponent';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: [],
    semester: [],
    class: [],
    subject: [],
    course: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        const user = response.data;

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
          <h1 className="text-3xl font-bold">Chào bạn {user.name}. 👋</h1>
          <p className='text-left'>Dưới đây là các biểu đồ</p>
        </div>
      </header>

      <div className='grid grid-cols-2 mx-3'>
        <CLOChartComponent descriptions={descriptions} setDescriptions={setDescriptions} />
        <PLOChartComponent />
        <BarChartComponent
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div>
    </div>
  );
}