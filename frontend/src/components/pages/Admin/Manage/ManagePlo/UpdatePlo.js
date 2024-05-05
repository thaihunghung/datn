// UpdatePlo.js

import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Table, Upload, Tooltip, Divider, Steps, Button, Collapse } from 'antd';
import { Link } from "react-router-dom";
import "./Plo.css"
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const UpdatePlo = (nav) => {
    const { setCollapsedNav, successNoti} = nav;
    const [activeTab, setActiveTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [ploListData, setPlosListData] = useState([]);


    const [current, setCurrent] = useState(0);
    const onChangexxx = (nameP) => {
        console.log('onChange:', nameP);
        setCurrent(nameP);
    };

    const [fileList, setFileList] = useState([]);
    const columns = [
        {
            title: "Tên PLO",
            dataIndex: "name",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: "Đã xóa",
            dataIndex: "isDeleted",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },{
            title: (
                <div className="flex items-center justify-center w-full">
                    <span>Form</span>
                    {/* <i className="fa-solid fa-bars text-[18px] ml-3"></i> */}
                </div>
            ),
            dataIndex: "action",
            render: (_id) => (
                <div className="flex flex-col items-center justify-center w-full gap-2">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            as={Link}
                            to={`update/${_id}`}

                        >
                            <i className="fa-solid fa-pen"></i>
                        </Button>
                    </Tooltip>
                    {/* <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            onClick={() => { onOpen(); setDeleteId(_id);}}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Tooltip> */}
                </div>
            ),
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
    const getAllPlo = async () => {
        //setSpinning(true);
        try {
            const response = await axiosAdmin.get('/plo');

            console.log(response.data)

            const updatedPloData = response.data.map((plo) => {
                return {
                    key: plo.plo_id,
                    name: plo.ploName,
                    isDeleted: plo.isDelete,
                    action: plo.plo_id,
                };
            });

            setPlosListData(updatedPloData);

            //setSpinning(false);
        } catch (error) {
            console.error("Error fetching plo:", error);
            //setSpinning(false);
        }
    };


    const handleDownloadPlo = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                alert('Please select at least one plo ID');
                return;
            }
            const data = {
                id: selectedRowKeys
            }
            const response = await axiosAdmin.post('csv/plo/',{data: data},{
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plo.csv';
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
        //allPloIsDelete()
        getAllPlo()
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
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to={"/admin/manage-plo"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            DS PLO
                        </div>
                    </Link>
                    <Link to={"/admin/manage-plo/store"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Kho lưu trữ
                        </div>
                    </Link>
                    <Link to={"/admin/manage-plo/update"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            update
                        </div>
                    </Link>
                    <Link to={"/admin/manage-plo/create"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Tạo PLO
                        </div>
                    </Link>
                </div> 
            </div>
            <div className="w-full my-5">
            <Collapse
                colorBorder="#FFD700"
                items = {[{ key: '1', label: <span className="text-base font-bold">Danh sách</span>, 
                    children: <div> 
                        {selectedRowKeys.length !== 0 && (
                            <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
                                <p className="text-sm font-medium">
                                    <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                                    Đã chọn {selectedRow.length} bài viết
                                </p>
                                <div className="flex items-center gap-2">
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
                                }}
                                columns={columns}
                                dataSource={ploListData}
                            />
                        </div>
                    </div>
                }]}
            />
           

            </div>
            <Tabs  tabs=
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
                                                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadPlo}>
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
                                                        <CustomUpload endpoint={'plo/getByID'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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


export default UpdatePlo;

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