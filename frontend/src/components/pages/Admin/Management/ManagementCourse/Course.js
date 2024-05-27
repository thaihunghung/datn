import React, { useEffect, useState } from "react";
import { Card, Col, Row, Pagination, Typography, Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { axiosAdmin } from "../../../../../service/AxiosAdmin"; // Adjust the import path as necessary
import './Course.css'
import Meta from "antd/es/card/Meta";

const { Title } = Typography;

const Course = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Number of cards per page
  const [totalCourses, setTotalCourses] = useState(0);
  const navigate = useNavigate();

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
      }
    };

    fetchCourses();
  }, []);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
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
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2}>Course List</Title>
      <div className="grid grid-cols-1 gap-5 m-5">
        {currentCourses.map((course) => (
          <div key={course.course_id}>
            <Card
              className="flex flex-col"
              bordered={true}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={
                  <Link to={`${course.course_id}`}>
                    <div className="flex items-center justify-center h-[150px] w-[200px] bg-gray-200 text-[44px] text-[#1890ff]
                                          
                    ">
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
    </>
  );
};

export default Course;
