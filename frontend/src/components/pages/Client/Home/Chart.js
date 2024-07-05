import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { AxiosClient } from '../../../../service/AxiosClient';
import { Button, Select } from 'antd';

const Chart = (studentCode) => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [filters, setFilters] = useState({
    year: [],
    semester: [],
    class: [],
    subject: [],
    course: []
  });

  const [showFilters, setShowFilters] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [semestersRes, academicYearsRes, classesRes, subjectsRes, coursesRes] = await Promise.all([
          AxiosClient.get('/admin/semester'),
          AxiosClient.get('/admin/academic-year'),
          AxiosClient.get('/admin/class'),
          AxiosClient.get('/admin/subjects'),
          AxiosClient.post('/admin/course-enrollment/student', {studentCode: studentCode.studentCode}),
        ]);

        setSemesters(semestersRes.data);
        console.log("semestersRes.data", semestersRes.data)
        setAcademicYears(academicYearsRes.data);
        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error('Error fetching filters data:', error);
      }
    };

    fetchFiltersData();
  }, [studentCode]);

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
    value: `${item.course_id} - ${item.course.courseCode} - ${item.course.courseName}`,
    label: item.course.courseName,
  }));

  const optionsSubject = subjects.map((item) => ({
    value: `${item.subject_id} - ${item.subjectCode} - ${item.subjectName}`,
    label: item.subjectName,
  }));

  const fetchBarChartData = async () => {
    try {
      const processedFilters = {
        academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
        semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
        class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
        subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
        course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
        student_code:  studentCode.studentCode,
      };

      const response = await AxiosClient.post('/admin/course/arg-score', {
        processedFilters
      });
      const data = response.data;

      console.log("response", response.data)
      const labels = data.map(course => course.courseName);
      const averageScores = data.map(course => course.averageScore);

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
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [filters, studentCode]);

  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Monthly Active Users',
        data: [560, 530, 500, 520, 540, 510, 500],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Electronics', 'Home Appliances', 'Beauty', 'Furniture', 'Watches', 'Apparel'],
    datasets: [
      {
        data: [30, 20, 10, 15, 10, 15],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const tableData = {
    headers: ['Source', 'No of Users', 'Conversion'],
    rows: [
      ['Facebook Ads', '26,345', '10.2%'],
      ['Google Ads', '21,341', '11.7%'],
      ['Instagram Ads', '34,379', '12.4%'],
      ['Affiliates', '12,359', '20.9%'],
      ['Organic', '10,345', '10.3%'],
    ],
  };

  return (
    <div className='grid grid-cols-2 mt-5'>
      <div className='col-span-2'>
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
              {/* <div>
                <label className="block mb-2">Lớp học</label>
                <Select
                  mode="multiple"
                  value={filters.class}
                  style={{ width: '100%' }}
                  onChange={(value) => handleFilterChange('class', value)}
                  placeholder="Chọn lớp"
                  options={optionsClass}
                />
              </div> */}
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
      </div>
      <div className='flex flex-col bg-white rounded-lg items-center shadow-md m-2'>
        <h3>Line Chart</h3>
        <Line className='p-4' data={lineChartData} />
      </div>
      <div className='flex flex-col bg-white p-6 rounded-lg items-center shadow-md m-2'>
        <h3>Bar Chart</h3>
        <Bar className='p-4' data={barChartData} />
      </div>
      <div className='bg-white p-6 rounded-lg items-center shadow-md m-2'>
        <h3>Table</h3>
        <table>
          <thead>
            <tr>
              {tableData.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex flex-col bg-white p-6 rounded-lg items-center shadow-md m-2'>
        <h3>Doughnut Chart</h3>
        <Doughnut className='p-4' data={doughnutChartData} />
      </div>
    </div>
  );
};

export default Chart;
