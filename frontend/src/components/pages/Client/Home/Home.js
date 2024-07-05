import React, { useEffect, useState } from 'react';
import Header from './Header';
import DashboardCard from './DashboardCard';
import Chart from './Chart';
import { AxiosClient } from '../../../../service/AxiosClient';

const Home = () => {
  const [studentCode, setStudentCode] = useState('110120151');
  const [student, setStudent] = useState('');


  useEffect(() => {
    // Fetch student data from API
    const fetchStudentStatistics = async () => {
      try {
        const response = await AxiosClient.post(`/admin/getStudentStatistics`, { studentCode });
        console.log("response.data", response.data);
        setStudent(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch student data', error);
      }
    };

    fetchStudentStatistics();
  }, [studentCode]);

  return (
    <div className="flex h-full min-w-full">
      {/* <Sidebar /> */}
      <div className="flex-grow p-6">
        <Header studentCode={studentCode} setStudentCode={setStudentCode} />
        <div className="grid grid-cols-3 gap-6 mt-6">
          <DashboardCard title="Điểm trung bình" value={student?.averageScore} icon="🎓" />
          <DashboardCard title="Số tín chỉ" value={student?.totalCredits} icon="📚" />
          <DashboardCard title="Số môn học" value={student?.courseCount} icon="📋" />
        </div>
        <div>
          <Chart studentCode={studentCode} />
        </div>
      </div>
    </div>
  );
};

export default Home;
