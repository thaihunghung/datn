// StoreStudent.js
import React, { useEffect, useState, useRef } from "react";
import { Button, Select, Tooltip, Input, Space, Table } from 'antd';
import { Link } from "react-router-dom";
import { DeleteOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter, useDisclosure
} from "@nextui-org/react";
const StoreStudent = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [studentData, setStudentData] = useState([]);

  const [deleteId, setDeleteId] = useState(null);
  const [toggleId, setToggleId] = useState(null);
  const allStudentIsDelete = async () => {
    try {
      const student = await axiosAdmin.get('/student/isDelete/true');

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

  const handleDeleteStudent = async (id) => {
    try {
      await axiosAdmin.delete(`/student/${id}`);
      allStudentIsDelete();
      successNoti("Xóa sinh viên thành công");
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  const handleChangeIdDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/student/isDelete/${id}`);
      if (response) {
        allStudentIsDelete();
        console.log(response.data.message);
        successNoti("Khôi phục sinh viên thành công");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  useEffect(() => {
    allStudentIsDelete()
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
      //console.log(window.innerWidth);
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
      width: '20%',
      // sorter: (a, b) => a.classCode - b.classCode,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (value, record) => (
        <Space>
          <Tooltip title="Khôi phục sinh viên này">
            <Button onClick={() => {
              onOpen();
              setToggleId(record.key);
              console.log("delete", record.key);
            }} icon={<RedoOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa vĩnh viễn">
            <Button icon={<DeleteOutlined />} onClick={() => {
              onOpen();
              setDeleteId(record.key);
            }} />
          </Tooltip>

        </Space>
      ),
      width: '10%',
    }
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <>
      <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
        <ConfirmAction
          onOpenChange={onOpenChange}
          isOpen={isOpen}
          message={toggleId ?
            "Sinh viên này sẽ khôi phục lại, bạn có muốn tiếp tục thao tác?" :
            "Sinh viên này sẽ được xóa vĩnh viễn, bạn có muốn tiếp tục thao tác?"
          }
          onConfirm={() => {
            if (toggleId) {
              handleChangeIdDelete(toggleId);
              setDeleteId(null);
            }
            else {
              handleDeleteStudent(deleteId);
              setDeleteId(null);
            }
          }}
        />
        <div>
          <div className="w-fit flex justify-start text-base font-bold rounded-lg mb-5">
            <Link to={"/admin/student"} className="rounded-lg bg-blue-600 text-white">
              <div className="p-5 text-white rounded-lg">
                DS Sinh viên
              </div>
            </Link>
            <Link to={"/admin/student/store"}>
              <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                Kho lưu trữ
              </div>
            </Link>
            <Link to={"/admin/student/create"}>
              <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                Thêm sinh viên
              </div>
            </Link>
            <Link to={"/admin/student/update"}>
              <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                Cập nhật
              </div>
            </Link>
            {/* <Link to={"/admin/student/po-plo"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              PO-PLO
            </div>
          </Link> */}
          </div>
        </div>
      </div>
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
    </>
  );
}


export default StoreStudent;
function ConfirmAction(props) {
  const { isOpen, onOpenChange, onConfirm, message } = props;
  const handleOnOKClick = (onClose) => {
    onClose();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Cảnh báo</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                {message}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Huỷ
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                Ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}