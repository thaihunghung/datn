import React, { useEffect, useState } from "react";
import { Card, Col, Row, Pagination, Typography, Breadcrumb, Modal, Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import './Course.css';
import Meta from "antd/es/card/Meta";

const { Title } = Typography;

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

    fetchCourses();
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
        courseName: course.courseName,
        className: course.class.className,
        teacherName: course.teacher.name,
        semesterDescription: course.semester.descriptionShort,
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

  const handleEditSubmit = async (values) => {
    try {
      await axiosAdmin.put(`/course/${selectedCourse.course_id}`, {
        ...selectedCourse,
        courseName: values.courseName,
        class: { ...selectedCourse.class, className: values.className },
        teacher: { ...selectedCourse.teacher, name: values.teacherName },
        semester: { ...selectedCourse.semester, descriptionShort: values.semesterDescription },
        enrollmentCount: values.enrollmentCount,
        subject: { ...selectedCourse.subject, description: values.subjectDescription },
      });
      successNoti('Update Successful', 'The course has been updated successfully.');
      // Refresh course list
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
              className="flex flex-col"
              bordered={true}
              actions={[
                <SettingOutlined key="setting" onClick={() => showModal('setting', course)} />,
                <EditOutlined key="edit" onClick={() => showModal('edit', course)} />,
                <EllipsisOutlined key="ellipsis" onClick={() => showModal('ellipsis', course)} />,
              ]}
            >
              <Meta
                avatar={
                  <Link to={`${course.course_id}`}>
                    <div className="flex items-center justify-center h-[150px] w-[200px] bg-gray-200 text-[44px] text-[#1890ff]">
                      {getAcronym(course.subject.subjectName)}
                    </div>
                  </Link>
                }
                title={
                  <div className="font-semibold text-xl mb-3 font-serif text-left">
                    <Link to={`${course.course_id}`}>
                      {`${course.courseName}`}
                    </Link>
                  </div>
                }
                description={
                  <div className="text-left text-base">
                    <p><strong>Class:</strong> {course.class.className}</p>
                    <p><strong>Teacher:</strong> {course.teacher.name}</p>
                    <p><strong>Semester:</strong> {course.semester.descriptionShort}</p>
                    <p><strong>Số học sinh:</strong> {course.enrollmentCount}</p>
                    {/* <p><strong>Description:</strong> {course.subject.description}</p> */}
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
            name="className"
            label="Class Name"
            rules={[{ required: true, message: 'Please enter the class name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teacherName"
            label="Teacher Name"
            rules={[{ required: true, message: 'Please enter the teacher name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="semesterDescription"
            label="Semester Description"
            rules={[{ required: true, message: 'Please enter the semester description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="enrollmentCount"
            label="Number of Students"
            rules={[{ required: true, message: 'Please enter the number of students' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="subjectDescription"
            label="Subject Description"
            rules={[{ required: true, message: 'Please enter the subject description' }]}
          >
            <Input.TextArea />
          </Form.Item>
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
      >
        <p>More options for {selectedCourse?.courseName}</p>
      </Modal>
    </>
  );
};

export default Course;
