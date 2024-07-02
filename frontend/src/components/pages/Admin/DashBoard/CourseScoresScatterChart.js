import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Button } from 'antd';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

const CourseScoresScatterChart = () => {
  const [courseData, setCourseData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

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
          selectedCourses
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
    }));
  };

  const chartData = {
    datasets: [{
      label: 'Scatter Dataset',
      data: processData(scoreData),
      backgroundColor: 'rgb(255, 99, 132)',
      pointRadius: 5, // Increase the point size
      pointHoverRadius: 6 // Increase the point hover size
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
          text: 'Số lượng học sinh',
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
            const dataPoint = context.raw;
            const studentNames = dataPoint.students.join(',');
            return `${context.dataset.label}: (${dataPoint.x}, ${dataPoint.y})\nStudents:\n${studentNames}`;
          }
        }
      }
    }
  };

  return (
    <div className="course-scores-scatter-chart bg-white shadow-md rounded-lg p-6 mb-6">
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
      <h2 className="text-xl font-bold text-[#6366F1]">Phân bố điểm của lớp Công nghệ phần mền DA20TTB</h2>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};

export default CourseScoresScatterChart;
