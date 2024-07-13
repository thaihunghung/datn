// BoxPlotComponent.jsx
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Select, Button } from 'antd';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const BoxPlotComponent = ({ filters, setFilters, showFilters, setShowFilters, user }) => {
  const [boxPlotData, setBoxPlotData] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [permission, setPermission] = useState();

  useEffect(() => {
    if (user && user.teacher_id) {
      setTeacherId(user.teacher_id);
      setPermission(user.permission);
    }
  }, [user]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [semestersRes, academicYearsRes, classesRes, subjectsRes, coursesRes] = await Promise.all([
          axiosAdmin.get('/semester'),
          axiosAdmin.get('/academic-year'),
          axiosAdmin.get('/class'),
          axiosAdmin.get('/subjects'),
          axiosAdmin.post('/course-all', {
            teacher_id: teacherId,
            permission: permission
          }),
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
  }, [permission, teacherId]);

  useEffect(() => {
    const fetchBoxPlotData = async () => {
      try {
        const processedFilters = {
          academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
          semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
          class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
          subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
          course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
          student_code: '',
          teacher_id: teacherId,
          permission: permission
        };

        const response = await axiosAdmin.post('/course/arg-score', {
          processedFilters
        });
        const data = response.data;

        const coursesMap = data.reduce((acc, student) => {
          const courseName = student.courseName;
          if (!acc[courseName]) {
            acc[courseName] = [];
          }
          acc[courseName].push(student.score);
          return acc;
        }, {});

        const plotData = Object.keys(coursesMap).map(course => ({
          type: 'box',
          name: course,
          y: coursesMap[course]
        }));

        setBoxPlotData(plotData);
      } catch (error) {
        console.error('Error fetching box plot data:', error);
      }
    };

    fetchBoxPlotData();
  }, [filters, permission, teacherId]);

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
            {permission > 1 && (
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
            )}
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
      <Plot
        data={boxPlotData}
        layout={{ 
          title: 'Box Plot of Course Scores', 
          yaxis: { 
            range: [0, 10],  // Set y-axis range
            title: '',  // Hide y-axis title
          },
          xaxis: { showticklabels: false },  // Hide x-axis tick labels
          width: 1200,  // Increase width
          height: 600   // Increase height
        }}
      />
    </div>
  );
};

export default BoxPlotComponent;
