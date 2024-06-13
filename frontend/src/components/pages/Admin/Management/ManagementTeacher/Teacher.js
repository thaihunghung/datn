import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  User,
  Button as NextUIButton,
} from "@nextui-org/react";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import debounce from 'lodash/debounce';
import './Teacher.css';
import CustomUpload from "../../CustomUpload/CustomUpload";
import { handleSearch, handleReset, getColumnSearchProps } from '../../../../../Helper/searchHelpers';
import { Form, Input, Modal, Select, Steps, Upload } from "antd";

const statusColorMap = {
  "GVGD": "success",
  "GVCV": "warning",
  "ADMIN": "danger",
};

const Teacher = React.memo((props) => {
  const { setCollapsedNav, successNoti, errorNoti } = props;
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showTeacherCodeInput, setShowTeacherCodeInput] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const searchInputRef = useRef(null);
  const [permission, setPermission] = useState(1);
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const searchInput = useRef(null);

  const [form] = Form.useForm();
  const { Option } = Select;

  const fetchTeachers = useCallback(async (page = 1, size = 10) => {
    try {
      const response = await axiosAdmin.get(`/teacher?page=${page}&size=${size}`);
      if (response.data.teachers) {
        setTeachers(response.data.teachers);
        setTotalTeachers(response.data.total);
      } else {
        setTeachers(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    }
  }, []);

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
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.input.contains(event.target)) {
        setSearchMode(false);
      }
    };

    if (searchMode) {
      document.addEventListener("mousedown", handleClickOutside);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchMode]);

  useEffect(() => {
    fetchTeachers(currentPage, pageSize);
  }, [fetchTeachers, currentPage, pageSize]);

  const handleSearch = debounce((value) => {
    console.log("text ", value);
  }, 300);

  const handleAddClick = () => {
    setIsAddModalVisible(true);
  };

  const handleUploadClick = () => {
    setIsUploadModalVisible(true);
  };

  const handleEditClick = (teacher) => {
    setCurrentTeacher(teacher);
    form.setFieldsValue(teacher);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsUploadModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const toggleTeacherCodeInput = () => {
    setShowTeacherCodeInput(!showTeacherCodeInput);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
      console.log('selectedRows: ', selectedRows)
    },
  };

  const handleUnSelect = () => {
    setSelectedRowKeys([]);
    setSelectedRow([]);
  };

  const handleFormSubmit = async (values) => {
    try {
      await axiosAdmin.post('/teacher', values);
      successNoti("Teacher added successfully");
      setIsAddModalVisible(false);
      fetchTeachers(currentPage, pageSize);
    } catch (error) {
      console.error("Error adding teacher:", error);
      if (error.response && error.response.data && error.response.data.message) {
        errorNoti(error.response.data.message);
      } else {
        errorNoti("Error adding teacher");
      }
    }
  };

  const handleEditFormSubmit = async (values) => {
    try {
      const res = await axiosAdmin.put(`/teacher/${currentTeacher.teacher_id}`, { data: values });
      console.log("id", currentTeacher.teacher_id)
      successNoti(res.data.message);
      setIsEditModalVisible(false);
      fetchTeachers(currentPage, pageSize);
    } catch (error) {
      console.error("Error updating teacher:", error);
      if (error.response && error.response.data && error.response.data.message) {
        errorNoti(error.response.data.message);
      } else {
        errorNoti("Error updating teacher");
      }
    }
  };

  const handleDownloadTemplateExcel = async () => {
    console.log("vao")
    try {
      const response = await axiosAdmin.get('/teacher/template/excel', {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadTemplateExcelWithData = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        alert('Please select at least one teacher ID');
        return;
      }
      const data = {
        id: selectedRowKeys
      }

      console.log(data);
      const response = await axiosAdmin.post('/teacher/template/data', { data: data }, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
        handleUnSelect();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  const handleSoftDelete = async () => {
    try {
      if (selectedRowKeys.length === 0) {
        alert('Please select at least one teacher ID');
        return;
      }
      const data = {
        id: selectedRowKeys
      }

      await axiosAdmin.patch('/teachers/deletes', { data: data });
      successNoti("Chuyển vào thùng rác thành công")
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  const onChange = (current) => {
    setCurrent(current);
  };

  const propsUpload = {
    onRemove: (file) => {
      setFileList((prevFileList) => {
        const index = prevFileList.indexOf(file);
        const newFileList = prevFileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
  };

  const columns = [
    {
      name: "Name",
      uid: "name",
    },
    {
      name: "Teacher Code",
      uid: "teacherCode",
    },
    {
      name: "Email",
      uid: "email",
    },
    {
      name: "Permission",
      uid: "permission",
    },
    {
      name: "Type Teacher",
      uid: "typeTeacher",
    },
    {
      name: "Actions",
      uid: "actions",
    }
  ];

  const renderCell = (teacher, columnKey) => {
    const cellValue = teacher[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg" }}
            description={teacher.teacherCode}
            name={teacher.name}
          />
        );
      case "permission":
        return (
          <Chip color={statusColorMap[teacher.typeTeacher]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Edit">
              <span className="cursor-pointer" onClick={() => handleEditClick(teacher)}>
                <EditOutlined />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <span className="cursor-pointer">
                <DeleteOutlined />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <div>
        <div>
          <h2 className="text-center mb-5">
            Danh sách giáo viên
          </h2>
          <div className="flex justify-between mx-3 mb-5">
            <div className="flex justify-between gap-5">
              <NextUIButton
                color="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClick}
              >
                Add
              </NextUIButton>
              <NextUIButton
                icon={<UploadOutlined />}
                onClick={handleUploadClick}
              >
                Upload
              </NextUIButton>
            </div>
            <div className="order-last">
              <Input
                ref={searchInputRef}
                placeholder="Search"
                prefix={<SearchOutlined />}
                className="w-72 ml-2"
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </div>
          </div>
          <div>
            {selectedRowKeys.length !== 0 && (
              <div className="Quick__Option flex justify-between items-center sticky top-0 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                <p className="text-sm font-medium">
                  <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                  Đã chọn {selectedRow.length} Teacher
                </p>
                <div className="flex items-center gap-2">
                  <Tooltip
                    content={`Tải file excel ${selectedRowKeys.length} giáo viên`}
                  >
                    <NextUIButton
                      onClick={() => handleDownloadTemplateExcelWithData()}
                    >
                      <i className="fa-solid fa-download"></i>
                    </NextUIButton>
                  </Tooltip>

                  <Tooltip
                    content={`Xoá ${selectedRowKeys.length} giáo viên`}
                  >
                    <NextUIButton
                      onClick={() => handleSoftDelete()}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </NextUIButton>
                  </Tooltip>
                  <Tooltip content="Bỏ chọn">
                    <NextUIButton
                      onClick={() => {
                        handleUnSelect();
                      }}
                    >
                      <i className="fa-solid fa-xmark text-[18px]"></i>
                    </NextUIButton>
                  </Tooltip>
                </div>
              </div>
            )}

            <Table
              aria-label="Teacher table"
              css={{ minWidth: "100%" }}
              selectionMode="multiple"
              onSelectionChange={setSelectedRowKeys}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={teachers}>
                {(teacher) => (
                  <TableRow key={teacher.teacher_id}>
                    {(columnKey) => (
                      <TableCell>{renderCell(teacher, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Modal title="Thêm giáo viên mới" open={isAddModalVisible} onCancel={handleCancel} footer={null}>
        <Form
          name="add_teacher"
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            hasFeedback
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <NextUIButton
              type="text"
              onClick={toggleTeacherCodeInput}>
              {showTeacherCodeInput ?
                "Nhập mã giáo viên theo ý bạn"
                :
                "Mã giáo viên tự động "
              }
            </NextUIButton>
          </Form.Item>
          {showTeacherCodeInput && (
            <Form.Item
              hasFeedback
              label="Teacher Code"
              name="teacherCode"
              count={{
                show: true,
                max: 10,
              }}
              rules={[
                { required: true, message: 'Vui lòng nhâp mã giáo viên!' },
              ]}
              tooltip={{
                title: 'Mã giáo viên',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'The input is not valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input the password!' },
              { min: 6, max: 8, message: 'Password must be between 6 and 8 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Permission"
            name="permission"
            initialValue={1}
            rules={[{
              required: true,
              message: 'Please input the permission!',
            }]}
          >
            <Select>
              <Option value="1">Giáo viên cố vấn</Option>
              <Option value="2">Giáo viên giảng dạy</Option>
              <Option value="3">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Type Teacher"
            name="typeTeacher"
            initialValue="GVGD"
            rules={[{ required: true, message: 'Please select the type of teacher!' }]}
          >
            <Select>
              <Option value="GVCV">GVCV</Option>
              <Option value="GVGD">GVGD</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <NextUIButton type="primary" htmlType="submit">
              Submit
            </NextUIButton>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Chỉnh sửa giáo viên" open={isEditModalVisible} onCancel={handleCancel} footer={null}>
        {currentTeacher && (
          <Form
            form={form}
            name="edit_teacher"
            onFinish={handleEditFormSubmit}
            layout="vertical"
            initialValues={currentTeacher}
          >
            <Form.Item
              hasFeedback
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              hasFeedback
              label="Teacher Code"
              name="teacherCode"
              rules={[
                { required: true, message: 'Vui lòng nhâp mã giáo viên!' },
              ]}
              tooltip={{
                title: 'Mã giáo viên',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              hasFeedback
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'The input is not valid email!' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input the password!' },
                { min: 6, max: 8, message: 'Password must be between 6 and 8 characters' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Permission"
              name="permission"
              rules={[{
                required: true,
                message: 'Please input the permission!',
              }]}
            >
              <Select>
                <Option value="1">Giáo viên cố vấn</Option>
                <Option value="2">Giáo viên giảng dạy</Option>
                <Option value="3">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Type Teacher"
              name="typeTeacher"
              rules={[{ required: true, message: 'Please select the type of teacher!' }]}
            >
              <Select>
                <Option value="GVCV">GVCV</Option>
                <Option value="GVGD">GVGD</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <NextUIButton type="primary" htmlType="submit">
                Submit
              </NextUIButton>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="Upload CSV"
        open={isUploadModalVisible}
        onCancel={handleCancel} footer={null}
      >
        <div className="flex flex-col items-center w-full m-3 rounded-lg">
          <div className='w-full grid grid-cols-1 gap-2 justify-center px-2 sm:px-4 lg:px-5 xl:px-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
            <div className='hidden lg:block xl:block mt-14'>
              <Steps
                direction="vertical"
                current={current}
                onChange={onChange}
                items={[
                  {
                    title: 'Bước 1',
                    description: 'Tải mẫu',
                  },
                  {
                    title: 'Bước 2',
                    description: 'Upload file',
                  },
                  {
                    title: 'Bước 3',
                    description: 'Thành công',
                  },
                ]}
              />
            </div>
            <div className='hidden sm:block lg:hidden xl:hidden'>
              <Steps
                current={current}
                onChange={onChange}
                direction="vertical"
                items={[
                  {
                    title: 'Bước 1',
                    description: 'Tải mẫu',
                  },
                  {
                    title: 'Bước 2',
                    description: 'Upload file',
                  },
                  {
                    title: 'Bước 3',
                    description: 'Thành công',
                  },
                ]}
              />
            </div>
            <div className='flex flex-col w-full sm:gap-0 sm:w-full lg:flex-col xl:flex-col justify-around'>
              <div className='w-full'>
                <div className='p-10 w-full mt-2 h-auto border border-blue-500 flex flex-col items-center justify-center gap-2 rounded-lg'>
                  <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
                  <NextUIButton className='w-full bg-primary flex items-center justify-center p-5 rounded-lg' onClick={handleDownloadTemplateExcel}>
                    <span>Tải xuống mẫu </span>
                  </NextUIButton>
                </div>
              </div>
              <div className='w-full'>
                <div className='p-10 w-full mt-2 h-auto border border-blue-500 flex flex-col items-center justify-center gap-2 rounded-lg'>
                  <div><p className='w-full text-center'>Gửi lại mẫu</p></div>
                  <Upload {...propsUpload} >
                    <NextUIButton icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-10'>Select File</NextUIButton>
                  </Upload>
                </div>
              </div>
              <div className='w-full'>
                <div className='p-10 w-full mt-2 h-auto border border-blue-500 flex flex-col items-center justify-center gap-2 rounded-lg'>
                  <div><p className='w-full text-center'>Lưu Dữ liệu</p></div>
                  <CustomUpload endpoint={'teacher'} method="POST" setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default Teacher;
