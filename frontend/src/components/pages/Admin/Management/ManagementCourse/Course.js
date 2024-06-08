import React, { useEffect, useState } from "react";
import { Card, Pagination, Typography, Breadcrumb, Modal, Form, Input, Button, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import './Course.css';
import Meta from "antd/es/card/Meta";

const { Title } = Typography;
const { Option } = Select;

const Course = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Number of cards per page
  const [totalCourses, setTotalCourses] = useState(0);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEllipsisModalVisible, setIsEllipsisModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYear] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredAcademicYears, setFilteredAcademicYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicYearSearchText, setAcademicYearSearchText] = useState("");

  const getAcronym = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCollapsedNav]);

  //get course list
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAdmin.get("/course-course-enrollment");
        setCourses(response.data);
        setFilteredCourses(response.data);
        setTotalCourses(response.data.length);
      } catch (err) {
        console.error("Error fetching courses: ", err.message);
        successNoti('Error fetching courses', 'Please try again later');
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axiosAdmin.get("/class");
        setClasses(response.data);
        setFilteredClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes: ", err.message);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosAdmin.get("/teacher");
        setTeachers(response.data);
      } catch (err) {
        console.error("Error fetching teachers: ", err.message);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosAdmin.get("/subjects");
        setSubjects(response.data);
        setFilteredSubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects: ", err.message);
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await axiosAdmin.get("/semester");
        setSemesters(response.data);
      } catch (err) {
        console.error("Error fetching semesters: ", err.message);
      }
    };

    const fetchAcademicYear = async () => {
      try {
        const response = await axiosAdmin.get("/academic-year");
        setAcademicYear(response.data);
        setFilteredAcademicYears(response.data);
      } catch (err) {
        console.error("Error fetching academic year: ", err.message);
      }
    };

    fetchCourses();
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
    fetchSemesters();
    fetchAcademicYear();
  }, [successNoti]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const showModal = (type, course) => {
    setSelectedCourse(course);
    if (type === 'setting') {
      setIsSettingModalVisible(true);
    } else if (type === 'edit') {
      form.setFieldsValue({
        course_id: course.course_id,
        courseName: course.courseName,
        class_id: course.class.class_id,
        teacher_id: course.teacher.teacher_id,
        subject_id: course.subject.subject_id,
        enrollmentCount: course.enrollmentCount,
        subjectDescription: course.subject.description,
        id_semester_academic_year: course.id_semester_academic_year,
        semester_id: course.SemesterAcademicYear.semester.semester_id,
        academic_year_id: course.SemesterAcademicYear.academic_year.academic_year_id,
        description: course.SemesterAcademicYear.academic_year.description,
      });
      setIsEditModalVisible(true);
    } else if (type === 'ellipsis') {
      setIsEllipsisModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsSettingModalVisible(false);
    setIsEditModalVisible(false);
    setIsEllipsisModalVisible(false);
    setSelectedCourse(null);
  };

  const handleDownload = async () => {
    try {
      const data = {
        id: selectedCourse.course_id
      }

      const response = await axiosAdmin.post('/course-enrollment/templates/data', { data: data }, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  const handleDelete = async () => {

  }

  const handleSearchCourse = (value) => {
    const filtered = courses.filter(course =>
      course.courseName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleSearchClass = (value) => {
    const filtered = classes.filter(cls =>
      cls.className.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleSearchSubject = (value) => {
    const filtered = subjects.filter(subject =>
      subject.subjectName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleSearchAcademicYear = (value) => {
    setAcademicYearSearchText(value);
    const filtered = academicYears.filter(option =>
      option.description.toLowerCase().includes(value.toLowerCase())
    );
    if (filtered.length === 0) {
      filtered.push({
        academic_year_id: 'create',
        description: `Năm học "${value}"`
      });
    }
    setFilteredAcademicYears(filtered);
  };

  const handleEditSubmit = async (values) => {
    try {
      let newAcademicYearId = values.academic_year_id;
      if (newAcademicYearId === 'create') {
        const newAcademicYear = await axiosAdmin.post('/academic-year', {
          description: `Năm học ${academicYearSearchText}`
        });
        newAcademicYearId = newAcademicYear.data.academic_year_id;
      }

      const selectedClass = classes.find(cls => cls.class_id === values.class_id);
      const selectedSubject = subjects.find(subject => subject.subject_id === values.subject_id);

      if (!selectedClass || !selectedSubject) {
        throw new Error("Invalid class or subject selection");
      }

      const data = {
        courseName: values.courseName,
        class_id: values.class_id,
        teacher_id: values.teacher_id,
        subject_id: values.subject_id,
        semester_id: values.semester_id,
        academic_year_id: newAcademicYearId,
        id_semester_academic_year: values.id_semester_academic_year,
        courseCode: `${selectedClass.classCode} - ${selectedSubject.subjectCode}`
      }

      await axiosAdmin.put(`/course/${selectedCourse.course_id}`, { data: data });
      successNoti('Update Successful', 'The course has been updated successfully.');
      // Refresh
      const response = await axiosAdmin.get("/course-course-enrollment");
      setCourses(response.data);
      setFilteredCourses(response.data);
      setTotalCourses(response.data.length);
      handleCancel();
    } catch (err) {
      console.error("Error updating course: ", err.message);
      successNoti('Error updating course', 'Please try again later.');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCoursesForCards = filteredCourses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.class.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * pageSize;
  const indexOfFirstCourse = indexOfLastCourse - pageSize;
  const currentCourses = filteredCoursesForCards.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <>
      <nav className="text-lg mb-4 text-left">
        <Link to="/admin" className="text-blue-500 hover:underline">Home</Link>
        <span> / Course</span>
      </nav>
      <Title level={2}>Course List</Title>

      <Input.Search
        placeholder="Search courses, class, teacher"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 20 }}
      />

      <div className="grid grid-cols-1 gap-5 m-5">
        {currentCourses.map((course) => (
          <div key={course.course_id}>
            <Card
              bordered={true}
              actions={[
                <SettingOutlined key="setting" onClick={() => showModal('setting', course)} />,
                <EditOutlined key="edit" onClick={() => showModal('edit', course)} />,
                <EllipsisOutlined key="ellipsis" onClick={() => showModal('ellipsis', course)} />,
              ]}
            >
              <Meta
                className="flex flex-col md:flex-row"
                avatar={
                  <Link to={`${course.course_id}`}>
                    <div className="flex flex-col items-center justify-center h-[85px] w-full bg-gray-200 text-[24px] text-[#1890ff]
                      lg:h-[160px] lg:w-[200px] lg:text-[36px]
                      md:h-[120px] md:w-[150px] md:text-[32px]
                      ms:h-[100px] ms:w-[130px] ms:text-[28px]
                      ">
                      {getAcronym(course.subject.subjectName)}
                    </div>
                  </Link>
                }
                title={
                  <div className="font-semibold text-xl font-serif text-left ml-0 mt-0 sm:m-4">
                    <Link to={`${course.course_id}`}>
                      <p className="text-wrap">{`${course.courseCode} ${course.courseName}`}</p>
                    </Link>
                  </div>
                }
                description={
                  <div className="text-left text-base ml-0 sm:ml-4">
                    <p><strong>Lớp:</strong> {course.class.className}</p>
                    <p><strong>Giáo viên giản dạy:</strong> {course.teacher.name}</p>
                    <p>
                      <strong>Năm học:</strong> {course.SemesterAcademicYear.semester.descriptionShort} - {course.SemesterAcademicYear.academic_year.description}
                    </p>
                    <p><strong>Số học sinh:</strong> {course.enrollmentCount}</p>
                  </div>
                }
              />
            </Card>

          </div>
        ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalCourses}
        onChange={handlePageChange}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />

      <Modal
        title="Settings"
        open={isSettingModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedCourse && (
          <div>
            <p><strong>Tên môn học:</strong> {selectedCourse.courseName}</p>
            <p><strong>Lớp học:</strong> {selectedCourse.class.className}</p>
            <p><strong>Giáo viên giảng dạy:</strong> {selectedCourse.teacher.name}</p>
            <p>
              <strong>Năm học:</strong> {selectedCourse.SemesterAcademicYear.semester.descriptionShort} - {selectedCourse.SemesterAcademicYear.academic_year.description}
            </p>
            <p><strong>Số lượng học sinh đăng kí:</strong> {selectedCourse.enrollmentCount}</p>
            <p><strong>Mô tả:</strong> {selectedCourse.subject.description}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Chỉnh sửa nội dung"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="id_semester_academic_year"
            label="Mã năm học"
            rules={[{ required: true, message: 'Please enter the course name' }]}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="courseName"
            label="Tên môn học"
            rules={[{ required: true, message: 'Please enter the course name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="class_id"
            label="Lớp học"
            rules={[{ required: true, message: 'Please select the class' }]}
          >
            <Select
              showSearch
              onSearch={handleSearchClass}
              filterOption={false}
            >
              {filteredClasses.map((cls) => (
                <Option key={cls.class_id} value={cls.class_id}>{cls.className}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher_id"
            label="Giáo viên giảng dạy"
            rules={[{ required: true, message: 'Please select the teacher' }]}
          >
            <Select>
              {teachers.map((teacher) => (
                <Option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subject_id"
            label="Môn học"
            rules={[{ required: true, message: 'Please select the subject' }]}
          >
            <Select
              showSearch
              onSearch={handleSearchSubject}
              filterOption={false}
            >
              {filteredSubjects.map((subject) => (
                <Option key={subject.subject_id} value={subject.subject_id}>{subject.subjectName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="semester_id"
            label="Học kì"
            rules={[{ required: true, message: 'Please select the semester' }]}
          >
            <Select>
              {semesters.map((semester) => (
                <Option key={semester.semester_id} value={semester.semester_id}>{semester.descriptionShort}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="academic_year_id"
            label="Năm học"
            rules={[{ required: true, message: 'Please select the semester' }]}
          >
            <Select
              showSearch
              onSearch={handleSearchAcademicYear}
              filterOption={false}
            >
              {filteredAcademicYears.map((academicYear) => (
                <Option key={academicYear.academic_year_id} value={academicYear.academic_year_id}>{academicYear.description}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="More Options"
        open={isEllipsisModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        <p className="text-base m-4">Tải danh sách học sinh đã đăng ký lớp học</p>
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-5/12"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
        <p className="text-base m-4">Thêm học sinh đăng ký lớp học</p>
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-5/12"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
        <p className="text-base m-4">Ẩn lớp {selectedCourse?.courseName}</p>
        <div>
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 w-5/12"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Course;
