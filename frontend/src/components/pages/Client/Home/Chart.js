import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { AxiosClient } from '../../../../service/AxiosClient';

const Chart = ({ studentCode, filters }) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [data, setData] = useState([]);

  const fetchChartData = async () => {
    try {
      const processedFilters = {
        academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
        semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
        class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
        subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
        course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
        student_code: studentCode,
      };

      console.log("response.data", processedFilters)
      const response = await AxiosClient.post('/admin/course/arg-score', { processedFilters: processedFilters });
      const data = response.data;


      const labels = data.map(course => course.courseCode);
      const averageScores = data.map(course => course.averageScore);

      setData(data);

      setBarChartData({
        labels: labels,
        datasets: [
          {
            label: 'Average Score',
            data: averageScores,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });

      setLineChartData({
        labels: labels,
        datasets: [
          {
            label: 'Average Score Over Time',
            data: averageScores,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [filters, studentCode]);

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const courseInfo = data[index];
            const value = context.raw;
            return `
            Điểm : ${value},
            Giáo viên: ${courseInfo.teacherName},
            Khóa học: ${courseInfo.courseName}
            `.trim().split('\n').map(line => line.trim()).join('\n');
          },
          title: function (context) {
            return context[0].label;
          }
        }
      }
    }
  };

  return (
    <div className='grid grid-cols-2 mt-5'>
      <div className='flex flex-col bg-white rounded-lg items-center shadow-md m-2'>
        <h3>Line Chart</h3>
        <Line className='p-4' data={lineChartData} options={barChartOptions} />
      </div>
      <div className='flex flex-col bg-white p-6 rounded-lg items-center shadow-md m-2'>
        <h3>Bar Chart</h3>
        <Bar className='p-4' data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default Chart;
