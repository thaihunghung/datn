import React, { useEffect, useState } from 'react';
import Header from './Header';
import DashboardCard from './DashboardCard';
import Chart from './Chart';
import { AxiosClient } from '../../../../service/AxiosClient';
import { Button, Select } from 'antd';

const Home = () => {
  const [studentCode, setStudentCode] = useState('110120151');
  const [student, setStudent] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: [],
    semester: [],
    class: [],
    subject: [],
    course: []
  });
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
          AxiosClient.post('/admin/course-enrollment/student', { studentCode }),
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

  useEffect(() => {
    // Fetch student data from API
    const fetchStudentStatistics = async () => {
      try {
        const response = await AxiosClient.post(`/admin/getStudentStatistics`, { studentCode });
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
        <div className='mt-4 '>
          <div className="flex items-center">
            <Button
              className='bg-[#6366F1] text-white'
              onClick={() => setShowFilters(!showFilters)}>
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
                  <label className="block mb-2">Subject</label>
                  <Select
                    mode="multiple"
                    value={filters.subject}
                    style={{ width: '100%' }}
                    onChange={(value) => handleFilterChange('subject', value)}
                    placeholder="Chọn môn học"
                    options={optionsSubject}
                  />
                </div> */}
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
        <div className="grid grid-cols-3 gap-6 mt-6">
          <DashboardCard title="Điểm trung bình" value={student?.averageScore} icon="🎓" />
          <DashboardCard title="Số tín chỉ" value={student?.totalCredits} icon="📚" />
          <DashboardCard title="Số môn học" value={student?.courseCount} icon="📋" />
        </div>
        <div>
          <Chart studentCode={studentCode} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Home;
