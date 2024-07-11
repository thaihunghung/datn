import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

const CourseScoresHistogramChart = () => {
  const [courseData, setCourseData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showFilter, setShowFilter] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAdmin.get('/course-all');
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const response = await axiosAdmin.post('/getAverageCourseScores', 
          {course_id_list: selectedCourses}
        );
        setScoreData(response.data);
        console.log("data", response.data)
      } catch (error) {
        console.error('Error fetching score data:', error);
      }
    };

    console.log("selectedCourses", selectedCourses)
    fetchScoreData();
  }, [selectedCourses]);

  const handleCourseSelection = (value) => {
    setSelectedCourses(value);
  };

  const processData = (data) => {
    const scoreCounts = data.reduce((acc, score) => {
      acc[score.score] = acc[score.score] || { count: 0, students: [] };
      acc[score.score].count += 1;
      acc[score.score].students.push(score.studentName);
      return acc;
    }, {});
    return Object.keys(scoreCounts).map(score => ({
      x: parseFloat(score),
      y: scoreCounts[score].count,
      students: scoreCounts[score].students
    })).sort((a, b) => a.x - b.x); // Sort scores in ascending order
  };

  const processedData = processData(scoreData);

  const chartData = {
    labels: processedData.map(dataPoint => dataPoint.x),
    datasets: [{
      label: 'Histogram Dataset',
      data: processedData.map(dataPoint => dataPoint.y),
      backgroundColor: 'rgb(75, 192, 192)',
      barPercentage: 1.0,
      categoryPercentage: 1.0
    }]
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Điểm',
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng sinh viên',
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const students = processedData[index].students.join(', ');
            return `${context.dataset.label}: ${context.raw}\nStudents:\n${students}`;
          }
        }
      }
    }
  };

  return (
    <div className="course-scores-histogram-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-start rounded mb-2">
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </Button>
        {showFilter && (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Courses"
            onChange={handleCourseSelection}
          >
            {courseData.map(course => (
              <Option key={course.course_id} value={course.course_id}>
                {course.courseName}
              </Option>
            ))}
          </Select>
        )}
      </div>
      <h2 className="text-xl font-bold text-[#6366F1]">Phân bố điểm</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CourseScoresHistogramChart;
