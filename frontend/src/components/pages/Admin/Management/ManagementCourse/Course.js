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
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYear] = useState([]);

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
        setTotalCourses(response.data.length);
      } catch (err) {
        console.error("Error fetching courses: ", err.message);
        // Display an error notification to the user
        successNoti('Error fetching courses', 'Please try again later');
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axiosAdmin.get("/class");
        setClasses(response.data);
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
        const response = await axiosAdmin.get("/subject");
        setSubjects(response.data);
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
        console.log(response.data);
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
        semester_id: course.semester.semester_id,
        enrollmentCount: course.enrollmentCount,
        subjectDescription: course.subject.description,
        academic_year_id: course.semester.academic_year.academic_year_id,
        description: course.semester.academic_year.description,

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

  const handleEditSubmit = async (values) => {
    console.log("vla: ", values);
    try {

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
        courseCode: `${selectedClass.classCode}-${selectedSubject.subjectCode}`
      }
      console.log("data", data);
      await axiosAdmin.put(`/course/${selectedCourse.course_id}`, { data: data });
      successNoti('Update Successful', 'The course has been updated successfully.');
      // Refresh
      const response = await axiosAdmin.get("/course-course-enrollment");
      setCourses(response.data);
      setTotalCourses(response.data.length);
      handleCancel();
    } catch (err) {
      console.error("Error updating course: ", err.message);
      successNoti('Error updating course', 'Please try again later.');
    }
  };

  const indexOfLastCourse = currentPage * pageSize;
  const indexOfFirstCourse = indexOfLastCourse - pageSize;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <>
      <nav className="text-lg mb-4 text-left">
        <Link to="/admin" className="text-blue-500 hover:underline">Home</Link>
        <span> / Course</span>
      </nav>
      <Title level={2}>Course List</Title>
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
                      <strong>Năm học:</strong> {course.semester.descriptionShort} - {course.semester.academic_year.description}
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
        visible={isSettingModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedCourse && (
          <div>
            <p><strong>Tên môn học:</strong> {selectedCourse.courseName}</p>
            <p><strong>Lớp học:</strong> {selectedCourse.class.className}</p>
            <p><strong>Giáo viên giảng dạy:</strong> {selectedCourse.teacher.name}</p>
            <p>
              <strong>Năm học:</strong> {selectedCourse.semester.descriptionShort} - {selectedCourse.semester.academic_year.description}
            </p>
            <p><strong>Số lượng học sinh đăng kí:</strong> {selectedCourse.enrollmentCount}</p>
            <p><strong>Mô tả:</strong> {selectedCourse.subject.description}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Chỉnh sửa nội dung"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
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
            <Select>
              {classes.map((cls) => (
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
            <Select>
              {subjects.map((subject) => (
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
            <Select>
              {academicYears.map((academicYear) => (
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
        visible={isEllipsisModalVisible}
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
