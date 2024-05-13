// Student.js

import { useEffect, useState } from "react";
import { Button, Select, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import './Student.css'

import {
  Modal, Chip,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter, useDisclosure
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";


//test


import React, { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space, Table } from 'antd';
// import Highlighter from 'react-highlight-words';

//end test
const Student = (nav) => {
  const { setCollapsedNav } = nav;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [studentData, setStudentData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const getAllStudent = async () => {
    try {
      const student = await axiosAdmin.get('/student-class');
      console.log("ssssâ", student.data);

      const newStudents = student.data.map((student) => {
        return {
          key: student.student_id,
          name: student.name,
          studentCode: student.studentCode,
          class_id: student.class_id,
          classCode: student.Class.classCode,
          email: student.email,
          created_at: student.createdAt,
          updated_at: student.updatedAt,
          // action: student.student_id,
        };
      });

      setStudentData(newStudents);
      console.log("ssss", studentData);
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  const getAllStudentByClass = async () => {
    try {
      const student = await axiosAdmin.get(`/student/class/${selectedClass}`);
      setStudentData(student.data)
      console.log(student.data);
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  const GetAllCodeClass = async () => {
    try {
      const response = await axiosAdmin.get('/class'); // use axios or your axiosAdmin instance
      const options = response.data.map(classItem => ({
        value: `${classItem.class_id.toString()}-${classItem.classCode}`,
        label: classItem.classCode
      }));
      setClassOptions(options);
      console.log(classOptions);
    } catch (error) {
      console.error('Lỗi khi get dữ liệu:', error);
    }
  };

  const handleClassChange = (value) => {
    const classId = parseInt(value.toString().charAt(0));
    if (!isNaN(classId) || classId == selectedClass) {
      setSelectedClass(classId);
      console.log("select:", classId);
      console.log("okoko2");
    } else {
      console.log("okoko");
      getAllStudent();
    }
  };

  const hangleChangeidDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/student/isDelete/${id}`);
      if (response) {
        console.log(response.data);

        console.log(response.data.message);
      }
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  useEffect(() => {
    getAllStudentByClass();
  }, [selectedClass])

  useEffect(() => {
    getAllStudent();
    GetAllCodeClass();
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
  }, []);

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      text
  });

  const columns = [
    {
      title: (
        <Tooltip title="Thông tin chi tiết về sinh viên">
          Tên sinh viên
        </Tooltip>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      ...getColumnSearchProps('name'),
      // render: (text) => (              //tooltip từng dòng của cột
      //   <Tooltip title="Thông tin chi tiết">
      //     {text}
      //   </Tooltip>
      // ),
    },
    {
      title: 'Mã số sinh viên',
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: '30%',
      ...getColumnSearchProps('studentCode'),
      sorter: (a, b) => parseInt(a.studentCode) - parseInt(b.studentCode),// cần quan tâm kiểu dữ liệu
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Mã lớp',
      dataIndex: 'classCode',
      key: 'classCode',
      filters: [
        {
          text: '2020',
          value: "DA20",
        },
        {
          text: '2021',
          value: 'DA21',
        },
      ],
      // onFilter: (value, record) => record.classCode.startsWith(value),
      // filterSearch: true,
      ...getColumnSearchProps('classCode'), //search và filter chỉ ton tai 1 
      width: '30%',
      sorter: (a, b) => a.classCode.length - b.classCode.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    // <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
    //   <ConfirmAction
    //     onOpenChange={onOpenChange}
    //     isOpen={isOpen}
    //     onConfirm={() => {
    //       if (deleteId) {
    //         hangleChangeidDelete(deleteId);
    //         setDeleteId(null);
    //       }
    //     }}
    //   />
    //   <div>
    //     <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
    //       <Link to={"/admin/student"}>
    //         <div className="p-5 hover:bg-slate-600 hover:text-white">
    //           DS Sinh viên
    //         </div>
    //       </Link>
    //       <Link to={"/admin/student/store"}>
    //         <div className="p-5 hover:bg-slate-600 hover:text-white">
    //           Kho lưu trữ
    //         </div>
    //       </Link>
    //       <Link to={"/admin/student/create"}>
    //         <div className="p-5 hover:bg-slate-600 hover:text-white">
    //           Thêm sinh viên
    //         </div>
    //       </Link>
    //       <Link to={"/admin/student/update"}>
    //         <div className="p-5 hover:bg-slate-600 hover:text-white">
    //           Cập nhật
    //         </div>
    //       </Link>
    //       {/* <Link to={"/admin/student/po-plo"}>
    //         <div className="p-5 hover:bg-slate-600 hover:text-white">
    //           PO-PLO
    //         </div>
    //       </Link> */}
    //     </div>
    //   </div>
    //   <Select
    //     mode="multiple"
    //     maxCount={1}
    //     style={{ width: '100%' }}
    //     placeholder="Chọn mã lớp"
    //     onChange={(e) => handleClassChange(e)}
    //     options={classOptions}
    //   />
    //   <div className="w-full border mt-5 rounded-lg">
    //     <table className="table-auto border-collapse border w-full">
    //       <tr>
    //         <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">STT</td>
    //         <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">Họ và tên</td>
    //         <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">MSSV</td>
    //         <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">Thao tác</td>
    //       </tr>
    //       {data.map((data, i) => (
    //         <tr key={i}>
    //           <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{i + 1}</td>
    //           <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{data.name}</td>
    //           <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{data.studentCode}</td>
    //           <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 flex justify-center">
    //             <div className="flex gap-1 flex-col sm:flex-col lg:flex-row xl:flex-row">
    //               <div className="bg-blue-500 w-[120px] hover:bg-blue-700 text-white  text-center font-bold p-1 rounded">
    //                 <Link to={`update/${data.student_id}`} className="w-full h-full">Cập nhật</Link></div>
    //               <div className="bg-red-500 w-[120px] hover:bg-red-700 text-white text-center font-bold p-1 rounded">
    //                 <button onClick={() => { onOpen(); setDeleteId(data.student_id); }} className="w-full h-full">Xóa</button>
    //               </div>
    //             </div>
    //           </td>
    //         </tr>
    //       ))}
    //     </table>
    //   </div>
    // </div>
    <Table
      columns={columns}
      dataSource={studentData}
      onChange={onChange}
      pagination={{
        defaultPageSize: 10,
        responsive: true,
        style: { justifyContent: "center" }
      }}
    />
  );
}

export default Student;

// function ConfirmAction(props) {
//   const { isOpen, onOpenChange, onConfirm } = props;
//   const handleOnOKClick = (onClose) => {
//     onClose();
//     console.log('thanđ');
//     if (typeof onConfirm === 'function') {
//       onConfirm();
//     }
//   }
//   return (
//     <Modal
//       isOpen={isOpen}
//       onOpenChange={onOpenChange}
//       motionProps={{
//         variants: {
//           enter: {
//             y: 0,
//             opacity: 1,
//             transition: {
//               duration: 0.2,
//               ease: "easeOut",
//             },
//           },
//           exit: {
//             y: -20,
//             opacity: 0,
//             transition: {
//               duration: 0.1,
//               ease: "easeIn",
//             },
//           },
//         }
//       }}
//     >
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader>Cảnh báo</ModalHeader>
//             <ModalBody>
//               <p className="text-[16px]">
//                 Chương trình sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
//               </p>
//             </ModalBody>
//             <ModalFooter>
//               <Button variant="light" onClick={onClose}>
//                 Huỷ
//               </Button>
//               <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
//                 Xoá
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   )
// }