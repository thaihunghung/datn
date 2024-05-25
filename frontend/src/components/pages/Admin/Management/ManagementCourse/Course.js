import React, { useEffect, useState } from "react";
import { Card, Col, Row, Pagination, Typography, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin"; // Adjust the import path as necessary

const { Title } = Typography;

const Course = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Number of cards per page
  const [totalCourses, setTotalCourses] = useState(0);

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
      <div className="grid grid-cols-1 gap-4 m-3 md:grid-cols-2 lg:grid-cols-3">
        {currentCourses.map((course) => (
          <div key={course.course_id}>
            <Card
              bordered={false}
              style={{ wordWrap: 'break-word' }}
              cover={
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '150px',
                  backgroundColor: '#f5f5f5',
                  fontSize: '64px',
                  color: '#1890ff'
                }}>
                  {getAcronym(course.subject.subjectName)}
                </div>
              }
            >
              <div className="font-black">
                {`${course.subject.subjectName} - ${course.semester.descriptionShort}`}
              </div>
              <p><strong>Class:</strong> {course.class.className}</p>
              <p><strong>Teacher:</strong> {course.teacher.name}</p>
              <p><strong>Semester:</strong> {course.semester.descriptionShort}</p>
              <p><strong>Số học sinh:</strong> {course.enrollmentCount}</p>
              {/* <p><strong>Description:</strong> {course.subject.description}</p> */}
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
