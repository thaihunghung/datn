import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Pagination, Row } from "antd";
import { axiosAdmin } from "../../../../../service/AxiosAdmin"; // Adjust the import path as necessary
import './Course.css'
import { Link } from "react-router-dom";


const Course = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Number of cards per page
  const [totalCourses, setTotalCourses] = useState(0);

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
        const response = await axiosAdmin.get("/course");
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
    <div>
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
      <div>Tiêu đề</div>
      <div className="grid grid-cols-1 gap-4 m-3 md:grid-cols-2 lg:grid-cols-3">
        {currentCourses.map((course) => (
          <div
            key={course.course_id}
          >
            <Card
              className="min-h-80 text-[#AF84DD]"
              title={
                <div style={{ whiteSpace: 'normal' }}>
                  {`${course.subject.subjectName} - ${course.semester.descriptionShort}`}
                </div>
              }

            >
              <p><strong>Class:</strong> {course.class.className}</p>
              <p><strong>Giáo viên:</strong> {course.teacher.name}</p>
              <p><strong>Học kì:</strong> {course.semester.descriptionShort}</p>
              {/* <p><strong>Credits:</strong> {course.subject.numberCredits}</p> */}
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
    </div>
  );
};

export default Course;
