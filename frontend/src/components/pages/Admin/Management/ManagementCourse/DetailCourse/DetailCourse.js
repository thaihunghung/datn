import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Typography, List, notification, Breadcrumb } from "antd";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

const { Title } = Typography;

const DetailCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleLoadStudents();
    const fetchCourse = async () => {
      try {
        const response = await axiosAdmin.get(`course/${id}`);
        console.log("data", response.data);
        setCourse(response.data[0]);
      } catch (err) {
        console.error("Error fetching course details: ", err.message);
      }
    };

    fetchCourse();
  }, [id]);

  const handleDownloadStudent = async () => {
    try {
      
      const data = {
        id: id
      }

      console.log(data);
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
  };

  const handleLoadStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosAdmin.get(`/course-enrollment/${id}`);
      console.log("z", response.data);
      // Assuming response.data contains the students array
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        notification.error({
          message: "Error",
          description: "Failed to load students.",
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students: ", err.message);
      notification.error({
        message: "Error",
        description: "Failed to load students.",
      });
      setLoading(false);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

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
        <Breadcrumb.Item>
        <Link to="/admin/course">Course</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2}>{course.subject.subjectName}</Title>
      <Card>
        <p><strong>Class:</strong> {course.class.className}</p>
        <p><strong>Teacher:</strong> {course.teacher.name}</p>
        <p><strong>Semester:</strong> {course.semester.descriptionShort}</p>
        <p><strong>Credits:</strong> {course.subject.numberCredits}</p>
        <p><strong>Description:</strong> {course.subject.description}</p>
      </Card>
      <Button type="primary" onClick={handleDownloadStudent} loading={loading} style={{ marginTop: '16px' }}>
        tải excel
      </Button>
      <List
        style={{ marginTop: '16px' }}
        bordered
        dataSource={students}
        renderItem={student => (
          <List.Item key={student.student_id}>
            {student.Student.name}
          </List.Item>
        )}
      />
    </div>
  );
};

export default DetailCourse;
