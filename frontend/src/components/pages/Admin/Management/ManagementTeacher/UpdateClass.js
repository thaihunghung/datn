import { useEffect, useState, useRef } from "react";
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Upload, Tooltip, Divider, Steps, Button, Collapse, Space, Input } from 'antd';
import { Link } from "react-router-dom";
import "./Class.css"
import { useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const UpdateClass = (nav) => {
    const { setCollapsedNav, successNoti } = nav;
    const { onOpen } = useDisclosure();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [classData, setClassData] = useState([]);
    const [current, setCurrent] = useState(0);
    const onChangexxx = (nameP) => {
        console.log('onChange:', nameP);
        setCurrent(nameP);
    };

    const [fileList, setFileList] = useState([]);

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

    const getAllStudent = async () => {
        try {
            const classes = await axiosAdmin.get('/class-teacher');
            console.log("class delete", classes.data);
      
            const newClasses = classes.data.map((classes) => {
              return {
                key: classes.class_id,
                teacher_id: classes.teacher_id,
                className: classes.className,
                classCode: classes.classCode,
                nameTeacher: classes.teacher.name,
                created_at: classes.createdAt,
                updated_at: classes.updatedAt,
                // action: student.student_id,
              };
            });
      
            setClassData(newClasses);
            console.log("ssss", classData);
          } catch (err) {
            console.log("Error: " + err.message);
          };
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            align: 'center',
            width: '8%'
          },
          {
            title: 'Mã lớp',
            dataIndex: 'classCode',
            key: 'classCode',
            align: 'center',
            filters: [
              {
                text: 'Năm học 2017',
                value: "DA17",
              },
              {
                text: 'Năm học 2018',
                value: 'DA18',
              },
              {
                text: 'Năm học 2019',
                value: "DA19",
              },
              {
                text: 'Năm học 2020',
                value: 'DA20',
              }, {
                text: 'Năm học 2021',
                value: 'DA21',
              },
            ],
            onFilter: (value, record) => record.classCode.startsWith(value),
            filterSearch: true,
            // ...getColumnSearchProps('classCode'), 
            width: '17%',
            // sorter: (a, b) => a.classCode - b.classCode,
            // sortDirections: ['descend', 'ascend'],
          },
          {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            ...getColumnSearchProps('className'),
            sorter: (a, b) => parseInt(a.className) - parseInt(b.className),// cần quan tâm kiểu dữ liệu
            sortDirections: ['descend', 'ascend'],
            width: '40%',
          },
          {
            title: 'Tên giáo viên cố vấn',
            dataIndex: 'nameTeacher',
            key: 'nameTeacher',
            ...getColumnSearchProps('nameTeacher'),
            render: (value, record) => (
              <Link to={`teacher/${record.teacher_id}`}>
                <Tooltip title="Click để xem thông tin chi tiết">
                  {record.nameTeacher}
                </Tooltip>
              </Link>
            ),
            align: 'center',
            width: '30%',
          },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    


    const handleDownloadStudent = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                alert('Vui lòng chọn');
                return;
            }
            const data = {
                id: selectedRowKeys
            }

            console.log(data);
            const response = await axiosAdmin.post('/class/templates/update', { data: data }, {
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
    const props = {
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

    const description = 'This is a description.';
    useEffect(() => {
        //allProgramIsDelete()
        getAllStudent()
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

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <div>
                <div className="w-fit flex justify-start text-base font-bold rounded-lg mb-5">
                    <Link to={"/admin/class"}>
                        <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                            DS Các lớp
                        </div>
                    </Link>
                    <Link to={"/admin/class/store"}>
                        <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                            Kho lưu trữ
                        </div>
                    </Link>
                    <Link to={"/admin/class/create"}>
                        <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                            Thêm class
                        </div>
                    </Link>
                    <Link to={"/admin/class/update"} className="rounded-lg bg-blue-600 text-white">
                        <div className="p-5 hover:bg-blue-600 hover:text-white rounded-lg">
                            Cập nhật
                        </div>
                    </Link>
                    {/* <Link to={"/admin/class/po-plo"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            PO-PLO
                        </div>
                    </Link> */}
                </div>
            </div>
            <div className="w-full my-5">
                <Collapse
                    colorBorder="#FFD700"
                    items={[{
                        key: '1', label: <span className="text-base font-bold">Danh sách</span>,
                        children: <div>
                            {selectedRowKeys.length !== 0 && (
                                <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
                                    <p className="text-sm font-medium">
                                        <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                                        Đã chọn {selectedRow.length} bài viết
                                    </p>
                                    <div className="flex items-center gap-2">

                                        <Tooltip
                                            title={`Xoá ${selectedRowKeys.length} bài viết`}
                                            getPopupContainer={() =>
                                                document.querySelector(".Quick__Option")
                                            }
                                        >
                                            <Button isIconOnly variant="light" radius="full" onClick={onOpen}>
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
                            <div className="ListNews w-full">
                                <Table className="p-0"
                                    bordered
                                    loading={loading}
                                    rowSelection={{
                                        type: "checkbox",
                                        ...rowSelection,
                                        columnWidth: 32,
                                    }}
                                    columns={columns}
                                    dataSource={classData}
                                />
                            </div>
                        </div>
                    }]}
                />


            </div>
            <Tabs tabs=
                {[
                    {
                        title: 'Cập nhật bằng CSV',
                        content:
                            <div className="w-full h-[1000px] rounded-lg">
                                <div className=' w-full flex justify-center items-center'>
                                    <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row  lg:flex-col  xl:flex-col  gap-[20px]'>
                                        <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                            <Divider />
                                            <Steps
                                                current={current}
                                                onChange={onChangexxx}
                                                items={[
                                                    {
                                                        title: 'Bước 1',
                                                        description,
                                                    },
                                                    {
                                                        title: 'bước 2',
                                                        description,
                                                    },
                                                    {
                                                        title: 'bước 3',
                                                        description,
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                            <Divider />
                                            <Steps
                                                current={current}
                                                onChange={onChangexxx}
                                                direction="vertical"

                                                items={[
                                                    {
                                                        title: 'Bước 1',
                                                        description,
                                                    },
                                                    {
                                                        title: 'bước 2',
                                                        description,
                                                    },
                                                    {
                                                        title: 'bước 3',
                                                        description,
                                                    },
                                                ]}
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
                                                    <Upload {...props} >
                                                        <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
                                                    </Upload>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
                                                <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <div><p className='w-full text-center'>Cập nhật Dữ liệu</p></div>
                                                    <CustomUpload endpoint={'student/update'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            />
        </div>
    );
}


export default UpdateClass;

function Tabs({ tabs, activeTab, setActiveTab }) {

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div>
            <table className="mb-2">
                <tr className="tab-buttons border-collapse border">
                    {tabs.map((tab, index) => (
                        <td>
                            <button
                                key={index}
                                onClick={() => handleTabClick(index)}
                                className={`${index === activeTab ? 'active ' : ''} ${index === activeTab ? 'bg-gray-800 text-white ' : ''} border p-2 px-7`}
                            >
                                {tab.title}
                            </button>
                        </td>
                    ))}
                </tr>
            </table>
            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}