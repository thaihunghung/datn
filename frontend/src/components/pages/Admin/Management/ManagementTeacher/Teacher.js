import React, { useEffect, useState, useRef, useCallback } from "react";
import { Table, Button, Input, Modal, Upload, Steps, Form, Dropdown, Menu, Typography, Select, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, UploadOutlined, FilterOutlined, SettingOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import debounce from 'lodash/debounce';
import './Teacher.css'

const { Title } = Typography;
const { Option } = Select;

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

  const [form] = Form.useForm();

  const fetchTeachers = useCallback(async (page = 1, size = 10) => {
    setLoading(true);
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
      setLoading(false);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Teacher Code",
      dataIndex: "teacherCode",
      key: "teacherCode",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
    },
    {
      title: "Type Teacher",
      dataIndex: "typeTeacher",
      key: "typeTeacher",
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <>
          <Button icon={<EditOutlined />} className="mr-2" onClick={() => handleEditClick(record)} />
          <Button icon={<DeleteOutlined />} />
        </>
      ),
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

  const toggleTeacherCodeInput = () => {
    setShowTeacherCodeInput(!showTeacherCodeInput);
  };

  return (
    <>
      <div>
        <div>
          <Title level={2} className="text-center mb-5">
            Danh sách giáo viên
          </Title>
          <div className="flex justify-between mx-3 mb-5">
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClick}
              >
                Add
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadClick}
              >
                Upload
              </Button>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Input
                ref={searchInputRef}
                placeholder="Search"
                prefix={<SearchOutlined />}
                className="w-72 ml-2"
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </div>
            <div>
              <Dropdown overlay={menu}>
                <Button icon={<SettingOutlined />}>Settings</Button>
              </Dropdown>
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
                    title={`Xoá ${selectedRowKeys.length} plo`}
                    getPopupContainer={() =>
                      document.querySelector(".Quick__Option")
                    }
                  >
                    <Button isIconOnly variant="light" radius="full">
                      <i className="fa-solid fa-trash-can"></i>
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title="Bỏ chọn"
                    getPopupContainer={() =>
                      document.querySelector(".Quick__Option")
                    }
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      radius="full"
                      onClick={() => {
                        handleUnSelect();
                      }}
                    >
                      <i className="fa-solid fa-xmark text-[18px]"></i>
                    </Button>
                  </Tooltip>
                </div>
              </div>
            )}

            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={teachers.map(teacher => ({ ...teacher, key: teacher.teacher_id }))}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalTeachers,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
              }}
              loading={loading}
            />
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
            <Button
              type="text"
              onClick={toggleTeacherCodeInput}>
              {showTeacherCodeInput ?
                "Nhập mã giáo viên theo ý bạn"
                :
                "Mã giáo viên tự động "
              }
            </Button>
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
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
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
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
                  <Button className='w-full bg-primary flex items-center justify-center p-5 rounded-lg' onClick={handleDownloadTemplateExcel}>
                    <span>Tải xuống mẫu </span>
                  </Button>
                </div>
              </div>
              <div className='w-full'>
                <div className='p-10 w-full mt-2 h-auto border border-blue-500 flex flex-col items-center justify-center gap-2 rounded-lg'>
                  <div><p className='w-full text-center'>Gửi lại mẫu</p></div>
                  <Upload {...propsUpload} >
                    <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-10'>Select File</Button>
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
