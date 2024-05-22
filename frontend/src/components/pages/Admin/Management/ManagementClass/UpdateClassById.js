// UpdateClassById.js

import React, { useEffect, useState, useRef } from "react";
import { Button, Select, Tooltip, Input, Space, Table, Form, Modal } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons';
import './Class.css';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const UpdateClassById = (props) => {
    const { setCollapsedNav, successNoti } = props;
    const { id } = useParams();
    const [classData, setClassData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [classId, setClassId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [classCode, setClassCode] = useState('');
    const [className, setClassName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(teacherOptions);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getAllClass = async () => {
        try {
            const response = await axiosAdmin.get(`/class`);
            const newClass = response.data.map((classItem) => {
                return {
                    key: classItem.class_id,
                    className: classItem.className,
                    classCode: classItem.classCode,
                    teacherName: classItem.teacher.name,
                };
            });
            setClassData(newClass);
            getClassById();
        } catch (err) {
            console.log("Error: " + err.message);
        }
    }

    const getClassById = async () => {
        try {
            const response = await axiosAdmin.get(`/class/${id}`);
            const classItem = response.data[0];
            setClassId(classItem.class_id);
            setClassName(classItem.className);
            setClassCode(classItem.classCode);
            setTeacherName(classItem.teacher.name);

            form.setFieldsValue({
                className: classItem.className,
                classCode: classItem.classCode,
                teacherName: classItem.teacher.name,

            });
        } catch (err) {
            console.log("Error: " + err.message);
        }
    }

    const GetAllTeacher = async () => {
        try {
            const response = await axiosAdmin.get('/teacher');
            const options = response.data.map(teacherItem => ({
                value: teacherItem.teacher_id.toString(),
                label: teacherItem.name
            }));
            setTeacherOptions(options);
            console.log("aaa", teacherOptions);
        } catch (error) {
            console.error('Lỗi khi get dữ liệu:', error);
        }
    };

    const handleSearchOption = (value) => {
        console.log("Search Value:", value);
        const filtered = teacherOptions.filter(option =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        console.log("Filtered Options:", filtered);
        setFilteredOptions(filtered);
    };

    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters) => {
        clearFilters();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text
    });

    const updateClass = async () => {
        try {
            const data = {
                class_id: classId,
                className: className,
                classCode: classCode,
                teacher_id: teacherId
            };
            const response = await axiosAdmin.put(`/class/${id}`, { data: data });
            setModalVisible(false);
            navigate("/admin/class")
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const columns = [
        {
            title: (
                <Tooltip title="Thông tin chi tiết về lớp học">
                    Tên lớp học
                </Tooltip>
            ),
            dataIndex: 'className',
            key: 'className',
            width: '40%',
            ...getColumnSearchProps('className'),
        },
        {
            title: 'Mã lớp',
            dataIndex: 'classCode',
            key: 'classCode',
            width: '30%',
            ...getColumnSearchProps('classCode'),
            sorter: (a, b) => a.classCode.localeCompare(b.classCode),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Tên giáo viên',
            dataIndex: 'teacherName',
            key: 'teacherName',
            width: '30%',
            ...getColumnSearchProps('teacherName'),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (value, record) => (
                <Space>
                    <Link to={`/class/update/${record.key}`}>
                        <Tooltip title="Cập nhật thông tin lớp học">
                            <Button icon={<EditFilled />} />
                        </Tooltip>
                    </Link>
                    <Tooltip title="Chuyển vào thùng rác">
                        <Button onClick={() => {
                            setModalVisible(true);
                            setDeleteId(record.key);
                            console.log("delete", record.key);
                        }} icon={<DeleteFilled />} />
                    </Tooltip>
                </Space>
            ),
            width: '10%',
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const onFinish = (values) => {
        console.log(values);
        updateClass();
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    useEffect(() => {
        setFilteredOptions(teacherOptions);
    }, [teacherOptions]);

    useEffect(() => {
        GetAllTeacher();
        getAllClass();
        getClassById();
        setModalVisible(true);
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

    return (
        <>
            <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
                <Modal
                    title="Update Class"
                    visible={modalVisible}
                    onCancel={() => navigate("/admin/class")}
                    footer={null}
                >
                    <Form
                        {...layout}
                        form={form}
                        name="nest-messages"
                        onFinish={onFinish}
                        style={{ maxWidth: 600 }}
                        validateMessages={validateMessages}
                        initialValues={{
                            className: className,
                            classCode: classCode,
                            teacherName: teacherName,
                        }}
                    >
                        <Form.Item
                            name="className"
                            label="Class Name"
                            rules={[{ required: true }]}
                        >
                            <Input
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="max-w-xs"
                            />
                        </Form.Item>
                        <Form.Item
                            name="classCode"
                            label="Class Code"
                            rules={[{ required: true }]}
                        >
                            <Input
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                                className="max-w-xs"
                            />
                        </Form.Item>
                       
                        <Form.Item
                            name="teacherName"
                            label="Chọn giáo viên cố vấn"
                        >
                            <Select
                                showSearch
                                placeholder="Chọn mã lớp"
                                value={teacherName}
                                onChange={setTeacherId}
                                onSearch={handleSearchOption}
                                size="middle"
                                className="w-full"
                                filterOption={false}
                                optionFilterProp="children"
                            >
                                {filteredOptions.map((item) => (
                                    <Select.Option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <div>
                    <div className="w-fit flex justify-start text-base font-bold rounded-lg mb-5">
                        <Link to={"/admin/class"} className="rounded-lg bg-blue-600">
                            <div className="p-5 text-white rounded-lg">
                                DS Lớp học
                            </div>
                        </Link>
                        <Link to={"/admin/class/store"}>
                            <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                                Kho lưu trữ
                            </div>
                        </Link>
                        <Link to={"/admin/class/create"}>
                            <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                                Thêm lớp học
                            </div>
                        </Link>
                        <Link to={"/admin/class/update"}>
                            <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                                Cập nhật
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={classData}
                onChange={onChange}
                pagination={{ defaultPageSize: 10, responsive: true, style: { justifyContent: "center" } }}
            />
        </>
    );
}

export default UpdateClassById;
