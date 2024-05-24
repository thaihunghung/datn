import React, { useEffect, useState, useRef } from "react";
import { Button, Select, Tooltip, Input, Space, Table, Form, DatePicker, Modal } from 'antd';
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteFilled, EditFilled, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import './Student.css'
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const UpdateStudentById = (props) => {
    const { setCollapsedNav, successNoti } = props;
    const { id } = useParams();
    const [studentData, setStudentData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [classOptions, setClassOptions] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [classId, setClassId] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [classCode, setClassCode] = useState('');
    const [scrollBehavior, setScrollBehavior] = useState("inside");
    const [filteredOptions, setFilteredOptions] = useState(classOptions);
    const [dob, setDob] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getAllStudent = async () => {
        try {
            const student = await axiosAdmin.get(`/student-class`);

            const newStudent = student.data.map((student) => {
                return {
                    key: student.student_id,
                    name: student.name,
                    studentCode: student.studentCode,
                    class_id: student.class_id,
                    classCode: student.Class.classCode,
                    email: student.email,
                    created_at: student.createdAt,
                    updated_at: student.updatedAt,
                };
            });

            setStudentData(newStudent);
            console.log("data", studentData)
            getAllStudentById();
        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    const getAllStudentById = async () => {
        try {
            const student = await axiosAdmin.get(`/student/${id}`);
            console.log("student id", student.data);

            setStudentId(student.data[0].student_id);
            setName(student.data[0].name);
            setStudentCode(student.data[0].studentCode);
            setClassId(student.data[0].class_id);
            setClassCode(student.data[0].Class.classCode);
            setEmail(student.data[0].email);
            setDob(student.data[0].date_of_birth ? moment(student.data[0].date_of_birth) : null);

            form.setFieldsValue({
                name: student.data[0].name,
                email: student.data[0].email,
                classCode: student.data[0].Class.classCode,
                studentCode: student.data[0].studentCode,
                dob: student.data[0].date_of_birth ? moment(student.data[0].date_of_birth) : null,
            });

        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    const GetAllCodeClass = async () => {
        try {
            const response = await axiosAdmin.get('/class');
            const options = response.data.map(classItem => ({
                value: classItem.class_id.toString(),
                label: classItem.classCode
            }));
            setClassOptions(options);
            console.log("aaa", classOptions);
        } catch (error) {
            console.error('Lỗi khi get dữ liệu:', error);
        }
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
        render: (text) => text
    });

    const updateStudent = async () => {
        try {
            const data = {
                student_id: studentId,
                name: name,
                email: email,
                studentCode: studentCode,
                date_of_birth: dob,
                class_id: classId
            }
            console.log("data update: ", data);
            const response = await axiosAdmin.put(`/student/${id}`, { data: data });
            setModalVisible(false);
            navigate("/admin/student")
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const handleSearchOption = (value) => {
        console.log("Search Value:", value);
        const filtered = classOptions.filter(option =>
            option.label.toLowerCase().includes(value.toLowerCase())
        );
        console.log("Filtered Options:", filtered);
        setFilteredOptions(filtered);
    };

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
        },
        {
            title: 'Mã số sinh viên',
            dataIndex: 'studentCode',
            key: 'studentCode',
            width: '30%',
            ...getColumnSearchProps('studentCode'),
            sorter: (a, b) => parseInt(a.studentCode) - parseInt(b.studentCode),
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
            onFilter: (value, record) => record.classCode.startsWith(value),
            filterSearch: true,
            ...getColumnSearchProps('classCode'),
            width: '20%',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (value, record) => (
                <Space>
                    <Link to={`/student/update/${record.key}`}>
                        <Tooltip title="Cập nhật thông tin sinh viên">
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
        console.log("vaa", values);
        updateStudent();
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
        setFilteredOptions(classOptions);
    }, [classOptions]);

    useEffect(() => {
        getAllStudentById();
        getAllStudent();
        GetAllCodeClass();
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
                    title="Update Student"
                    visible={modalVisible}
                    onCancel={() => navigate("/admin/student")}
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
                            name: name,
                            email: email,
                            classCode: classCode,
                            studentCode: studentCode,
                            dob: dob,
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true }]}
                        >
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="max-w-xs"
                            />
                        </Form.Item>
                        <Form.Item
                            name="studentCode"
                            label="Mã số sinh viên"
                            rules={[{ type: 'mssv' }]}
                        >
                            <Input
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                className="max-w-xs"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email' }]}
                        >
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="max-w-xs"
                            />
                        </Form.Item>
                        <Form.Item
                            name="classCode"
                            label="Class Code"
                        >
                            <Select
                                showSearch
                                placeholder="Chọn mã lớp"
                                value={classCode}
                                onChange={setClassId}
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
                            name="dob"
                            label="Ngày sinh"
                            rules={[
                                { required: true, type: 'object', message: 'Please select date of birth!' }
                            ]}
                        >
                            <DatePicker
                                value={dob}
                                onChange={(date) => setDob(date ? moment(date).format('YYYY-MM-DD') : null)}
                                format="YYYY-MM-DD"
                                className="max-w-xs"
                            />
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
                        <Link to={"/admin/student"} className="rounded-lg bg-blue-600">
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
                    </div>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={studentData}
                onChange={onChange}
                pagination={{ defaultPageSize: 10, responsive: true, style: { justifyContent: "center" } }}
            />
        </>
    );
}

export default UpdateStudentById;
