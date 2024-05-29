import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { Table } from "antd";

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
      const data = { id: id };
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
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students: ", err.message);
      setLoading(false);
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => record.Student.name,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (text, record) => record.Student.studentCode,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => record.Student.email,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(record.createdAt)),
    },
  ];

  return (
    <div className="p-4">
      <nav className="text-lg mb-4 text-left">
        <Link to="/admin" className="text-blue-500 hover:underline">Home</Link>
        <span> / </span>
        <Link to="/admin/course" className="text-blue-500 hover:underline">Course</Link>
        <span> / Chi tiết</span>
      </nav>
      <h2 className="text-2xl font-bold mb-4">{course.subject.subjectName}</h2>
      <div className="flex gap-2 flex-col bg-white p-6 rounded shadow-md text-left">
        <p><strong>Tên môn học:</strong> {course.courseName}</p>
        <p><strong>Lớp học:</strong> {course.class.className}</p>
        <p><strong>Giáo viên giảng dạy:</strong> {course.teacher.name}</p>
        <p><strong>Năm học:</strong> {course.semester.descriptionShort} - {course.semester.academic_year.description}</p>
        <p><strong>Số lượng học sinh đăng kí:</strong> {course.enrollmentCount}</p>
        <p><strong className="text-pretty">Mô tả:</strong> {course.subject.description}</p>
      </div>
      
      <div className="mt-4 border rounded">
        <Table
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="id_detail_courses"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <button
        type="button"
        onClick={handleDownloadStudent}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 disabled:opacity-50"
      >
        tải danh sách
      </button>
    </div>
  );
};

export default DetailCourse;
