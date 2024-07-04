// BarChartComponent.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Select, Button } from 'antd';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const BarChartComponent = ({ filters, setFilters, showFilters, setShowFilters }) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });
  const [barChartInfo, setBarChartInfo] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [semestersRes, academicYearsRes, classesRes, subjectsRes, coursesRes] = await Promise.all([
          axiosAdmin.get('/semester'),
          axiosAdmin.get('/academic-year'),
          axiosAdmin.get('/class'),
          axiosAdmin.get('/subjects'),
          axiosAdmin.get('/course-all'),
        ]);

        setSemesters(semestersRes.data);
        setAcademicYears(academicYearsRes.data);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Error fetching filters data:', error);
      }
    };

    fetchFiltersData();
  }, []);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const processedFilters = {
          academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
          semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
          class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
          subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
          course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
        };

        const response = await axiosAdmin.post('/course/arg-score', {
          processedFilters
        });
        const data = response.data;

        const labels = data.map(course => course.courseName);
        const scores = data.map(course => course.averageScore);

        setBarChartData({
          labels,
          datasets: [{
            label: 'Average Scores',
            data: scores,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });

        setBarChartInfo(data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, [filters]);

  const handleFilterChange = (name, values) => {
    setFilters(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const optionsAcademicYear = academicYears.map((item) => ({
    value: `${item.academic_year_id} - ${item.startDate}`,
    label: item.description,
  }));

  const optionsSemester = semesters.map((item) => ({
    value: `${item.semester_id} - ${item.descriptionLong} - ${item.descriptionShort}`,
    label: item.descriptionLong,
  }));

  const optionsClass = classes.map((item) => ({
    value: `${item.class_id} - ${item.classNameShort} - ${item.classCode} - ${item.className}`,
    label: item.className,
  }));

  const optionsCourse = courses.map((item) => ({
    value: `${item.course_id} - ${item.courseCode} - ${item.courseName}`,
    label: item.courseName,
  }));

  const optionsSubject = subjects.map((item) => ({
    value: `${item.subject_id} - ${item.subjectCode} - ${item.subjectName}`,
    label: item.subjectName,
  }));

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
            const courseInfo = barChartInfo[index];
            const value = context.raw;
            return `
            Average Score: ${value}
            Teacher: ${courseInfo.teacherName}
            Semester: ${courseInfo.semester}
            Academic Year: ${courseInfo.academic_year}
            Class: ${courseInfo.className}
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
    <div className="col-span-2 bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center">
        <Button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filter' : 'Show Filter'}
        </Button>
      </div>
      {showFilters && (
        <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Năm học</label>
              <Select
                mode="multiple"
                value={filters.year}
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('year', value)}
                placeholder="Chọn năm học"
                options={optionsAcademicYear}
              />
            </div>
            <div>
              <label className="block mb-2">Học kì</label>
              <Select
                mode="multiple"
                value={filters.semester}
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('semester', value)}
                placeholder="Chọn học kì"
                options={optionsSemester}
              />
            </div>
            <div>
              <label className="block mb-2">Lớp học</label>
              <Select
                mode="multiple"
                value={filters.class}
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('class', value)}
                placeholder="Chọn lớp"
                options={optionsClass}
              />
            </div>
            <div>
              <label className="block mb-2">Subject</label>
              <Select
                mode="multiple"
                value={filters.subject}
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('subject', value)}
                placeholder="Chọn môn học"
                options={optionsSubject}
              />
            </div>
            <div>
              <label className="block mb-2">Course</label>
              <Select
                mode="multiple"
                value={filters.course}
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('course', value)}
                placeholder="Chọn học phần"
                options={optionsCourse}
              />
            </div>
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Điểm trung bình của khóa học</h2>
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
};

export default BarChartComponent;
