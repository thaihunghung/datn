import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Input, Modal, Upload, Steps, Spin, Form, Dropdown, Menu, Typography } from "antd";
import { SearchOutlined, PlusOutlined, UploadOutlined, FilterOutlined, SettingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import './Teacher.css'

const { Title } = Typography;

const Teacher = (props) => {
  const { setCollapsedNav, successNoti } = props;
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const searchInputRef = useRef(null);
  const [permission, setPermission] = useState(1);
  const [current, setCurrent] = useState(0);
  const [fileList, setFileList] = useState([]);

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
    const fetchTeachers = async () => {
      try {
        const response = await axiosAdmin.get('/teacher');
        console.log("data", response)
        setTeachers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        const user = response.data;
        console.log("user", user)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleSearch = (event) => {
    console.log("text ", event.target.value);
  };

  const handleAddClick = () => {
    setIsAddModalVisible(true);
  };

  const handleUploadClick = () => {
    setIsUploadModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsUploadModalVisible(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      await axiosAdmin.post('/teacher', values);
      successNoti("Teacher added successfully");
      setIsAddModalVisible(false);
      // Refetch the teachers data
      const response = await axiosAdmin.get('/teacher');
      setTeachers(response.data);
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleDownloadStudent = () => {
    // Function to handle downloading CSV template
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
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: () => <input type="checkbox" />
    },
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
          <Button icon={<EditOutlined />} className="mr-2" />
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
                onPressEnter={handleSearch}
                allowClear
              />
            </div>
            <div>
              <Dropdown overlay={menu}>
                <Button icon={<SettingOutlined />}>Settings</Button>
              </Dropdown>
            </div>
          </div>
          {loading ? (
            <Spin size="large" className="flex justify-center items-center h-screen" />
          ) : (
              <Table
                columns={columns}
                dataSource={teachers}
                pagination={true}
              />
          )}
        </div>
      </div>
      <Modal title="Add Teacher" visible={isAddModalVisible} onCancel={handleCancel} footer={null}>
        <Form
          name="add_teacher"
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Permission"
            name="permission"
            initialValue={1}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Type Teacher"
            name="typeTeacher"
            initialValue="GVGD"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Upload CSV"
        visible={isUploadModalVisible}
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
                  <Button className='w-full bg-primary flex items-center justify-center p-5 rounded-lg' onClick={handleDownloadStudent}>
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
                  <CustomUpload endpoint={'student'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Teacher;
