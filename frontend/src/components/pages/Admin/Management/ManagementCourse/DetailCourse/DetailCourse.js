import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { Button, Table, Upload } from "antd";
import CustomUpload from "../../../CustomUpload/CustomUpload";
import { UploadOutlined } from "@ant-design/icons";

const DetailCourse = (props) => {
  const { setCollapsedNav, successNoti } = props;

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);

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

  useEffect(() => {
    handleLoadStudents();
  }, [successNoti])

  const state = {
    onRemove: (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    },
    beforeUpload: (file) => {
        setFileList([...fileList, file]);
        return false;
    },
    fileList,
  };
  
  const handleDownloadStudent = async () => {
    try {
        const response = await axiosAdmin.get('/student/templates/post', {
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
            setCurrent(1);
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
      <h2 className="text-2xl font-bold mb-4">{`${course.courseCode} ${course.courseName}`}</h2>
      <div className="flex gap-2 flex-col bg-white p-6 rounded shadow-md text-left">
        <p><strong>Tên môn học:</strong> {course.courseName}</p>
        <p><strong>Lớp học:</strong> {course.class.className}</p>
        <p><strong>Giáo viên giảng dạy:</strong> {course.teacher.name}</p>
        <p><strong>Năm học:</strong> {course.SemesterAcademicYear.semester.descriptionShort}</p>
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

      <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
        <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
          <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
            <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
            <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadStudent}>
              <scan>Tải xuống mẫu </scan>
            </Button>

          </div>
        </div>
        <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
          <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
            <div><p className='w-full text-center'>Gửi lại mẫu</p></div>
            <Upload {...state} >
              <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
            </Upload>
          </div>
        </div>
        <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
          <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
            <div><p className='w-full text-center'>Cập nhật Dữ liệu</p></div>
            <CustomUpload endpoint={`course-enrollment/${id}`} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} method = "POST" />
          </div>
        </div>
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
