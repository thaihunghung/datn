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

    fetchCourses();
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
    fetchSemesters();
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
    try {
      const data = {
        courseName: values.courseName,
        class_id: values.class_id,
        teacher_id: values.teacher_id,
        subject_id: values.subject_id,
        semester_id: values.semester_id,
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
      <Breadcrumb
        style={{
          fontSize: '18px',
          margin: '16px 16px',
        }}
      >
        <Breadcrumb.Item>
          <Link to="/admin">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Course</Breadcrumb.Item>
      </Breadcrumb>
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
                      lg:h-[135px] lg:w-[180px] lg:text-[36px]
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
                      <p className="text-wrap">{`${course.courseName}`}</p>
                    </Link>
                  </div>
                }
                description={
                  <div className="text-left text-base ml-0 sm:ml-4">
                    <p><strong>Class:</strong> {course.class.className}</p>
                    <p><strong>Teacher:</strong> {course.teacher.name}</p>
                    <p><strong>Semester:</strong> {course.semester.descriptionShort}</p>
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
            <p><strong>Course Name:</strong> {selectedCourse.courseName}</p>
            <p><strong>Class:</strong> {selectedCourse.class.className}</p>
            <p><strong>Teacher:</strong> {selectedCourse.teacher.name}</p>
            <p><strong>Semester:</strong> {selectedCourse.semester.descriptionShort}</p>
            <p><strong>Number of Students:</strong> {selectedCourse.enrollmentCount}</p>
            <p><strong>Description:</strong> {selectedCourse.subject.description}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Course"
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
            label="Course Name"
            rules={[{ required: true, message: 'Please enter the course name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="class_id"
            label="Class"
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
            label="Teacher"
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
            label="Subject"
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
            label="Semester"
            rules={[{ required: true, message: 'Please select the semester' }]}
          >
            <Select>
              {semesters.map((semester) => (
                <Option key={semester.semester_id} value={semester.semester_id}>{semester.descriptionShort}</Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item
            name="subjectDescription"
            label="Subject Description"
            rules={[{ required: true, message: 'Please enter the subject description' }]}
          >
            <Input.TextArea />
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
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
