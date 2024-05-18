
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Table, Upload, Tooltip, Divider, Steps, Button, message } from 'antd';
import { Link, useLocation } from "react-router-dom";
import "./Plo.css"
import {
    useDisclosure
} from "@nextui-org/react";

import {
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const ManagePlo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [poListData, setPosListData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [deleteId, setDeleteId] = useState(null);


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
            title: "Mô tả",
            dataIndex: "description",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center justify-center w-full">
                    <span>Form</span>
                </div>
            ),
            dataIndex: "action",
            render: (_id) => (
                <div className="flex flex-col items-center justify-center w-full gap-2">
                    
               
                    <Link to={`/admin/management-po/update/${_id}`}>
    <Tooltip title="Chỉnh sửa">
        <Button
            isIconOnly
            variant="light"
            radius="full"
            size="sm"
        >
            <i className="fa-solid fa-pen"></i>
        </Button>
    </Tooltip>
</Link>


                    <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            onClick={() => { onOpen(); setDeleteId(_id); }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Tooltip>

                </div>
            ),
        },

    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    const getAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plo/isDelete/false');
            const updatedPoData = response.data.map((plo) => {
                return {
                    key: plo.plo_id,
                    name: plo.ploName,
                    description: plo.description,
                    isDeleted: plo.isDelete,
                    action: plo.plo_id,
                };
            });
            setPosListData(updatedPoData);
            console.log(response.data);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching PO data');
        }
    };
    
    const handleSoftDelete = async () => {
        const data = {
            plo_id: selectedRowKeys,
        };
        console.log(data)
        try {
            const response = await axiosAdmin.put('/plo/listId/soft-delete-multiple', { data});
            await getAllPlo();
            handleUnSelect();
            message.success(response.data.message); 
        } catch (error) {
            console.error("Error soft deleting POs:", error);
            message.error('Error soft deleting POs'); 
        }
    };
    
    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/plo/${_id}/toggle-soft-delete`);
            await getAllPlo();
            handleUnSelect();
            message.success(response.data.message); 
        } catch (error) {
            console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for PO with ID ${_id}`); 
        }
    };


    const handleDownloadPo = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                alert('Please select at least one po ID');
                return;
            }
            const data = {
                id: selectedRowKeys
            }
            const response = await axiosAdmin.post('/plo/templates/update', { data: data }, {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plo_update.xlsx';
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
    useEffect(() => {
        getAllPlo()
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

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <ConfirmAction
                onOpenChange={onOpenChange}
                isOpen={isOpen}
                onConfirm={() => {
                    if (deleteId) {
                        handleSoftDeleteById(deleteId);
                        setDeleteId(null);
                    } else if (selectedRowKeys.length > 0) {
                        handleSoftDelete();
                        setSelectedRowKeys([]);
                    }
                }}
            />

<div className="flex justify-between px-5 w-full items-center">
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-plo/list">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-plo/list") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Danh sách PLO
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-plo/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-plo/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Tạo mới
                            </div>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/admin/management-plo/store">
                        <Tooltip title="Xoá">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"

                            >
                                 <span className="text-base">Kho lưu trữ </span><i className="fa-solid ml-2 fa-trash-can"></i>
                            </Button>
                        </Tooltip></Link>
                </div>
            </div>
            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
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
                <div className="w-full ">
                    <Table className="table-po text-[#fefefe]"
                        bordered
                        loading={loading}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={poListData}
                    />
                </div>
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
                                            <Steps current={current} onChange={setCurrent} items={[
                                                { title: 'Bước 1', description: 'Tải về form' },
                                                { title: 'Bước 2', description: 'Tải lại form' },
                                                { title: 'Bước 3', description: 'Chờ phản hồi' }
                                                ]}
                                            />
                                        </div>
                                        <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                            <Divider />
                                            <Steps current={current} onChange={setCurrent} items={[
                                                { title: 'Bước 1', description: 'Tải về form' },
                                                { title: 'Bước 2', description: 'Tải lại form' },
                                                { title: 'Bước 3', description: 'Chờ phản hồi' }
                                                ]}
                                            />
                                        </div>

                                        <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                                                <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                                                    <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
                                                    <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadPo}>
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
                                                    <CustomUpload endpoint={'plo/update'} LoadData={getAllPlo} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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


export default ManagePlo;
function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
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
                                Plo sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Huỷ
                            </Button>
                            <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                                Xoá
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

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