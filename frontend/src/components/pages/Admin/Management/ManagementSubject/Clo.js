import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Table, Upload, Tooltip, Divider, Steps, message, Button } from 'antd';
import { Link, useLocation, useParams } from "react-router-dom";
import { useDisclosure } from "@nextui-org/react";
import {
    Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import DropdownAndNavClo from "../../Utils/DropdownAndNav/DropdownAndNavClo";
import Tabs from "../../Utils/Tabs/Tabs";

const Clo = (nav) => {
    const location = useLocation();
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [activeTab, setActiveTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [poListData, setPosListData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedItem, setSelectedItem] = useState("Danh sách CLO");
    const [fileList, setFileList] = useState([]);

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const columns = [
        {
            title: "Tên PO",
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
                <div className="flex items-center justify-center w-full gap-2">
                    <Link to={`/admin/management-subject/${id}/clo/update/${_id}`}>
                        <Tooltip title="Chỉnh sửa">
                            <Button isIconOnly variant="light" radius="full" size="sm">
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
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };

    const getAllClo = async () => {
        try {
            const response = await axiosAdmin.get(`/clo/subject/${id}`);
            const updatedPoData = response.data.map((po) => ({
                key: po.clo_id,
                name: po.cloName,
                description: po.description,
                isDeleted: po.isDelete,
                action: po.clo_id,
            }));
            setPosListData(updatedPoData);
            console.log(response.data);
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };

    const handleSoftDelete = async () => {
        const data = { clo_id: selectedRowKeys };
        try {
            const response = await axiosAdmin.put('/clo/listId/soft-delete-multiple', { data });
            await getAllClo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting Clos:", error);
            message.error('Error soft deleting Clos');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/clo/${_id}/toggle-soft-delete`);
            await getAllClo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for Clo with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for Clo with ID ${_id}`);
        }
    };

    const handleDownloadPo = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                alert('Please select at least one clo ID');
                return;
            }
            const data = { id: selectedRowKeys };
            const response = await axiosAdmin.post('/clo/templates/update', { data }, { responseType: 'blob' });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'clo.xlsx';
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
        getAllClo();
        const handleResize = () => {
            setCollapsedNav(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex w-full h-fit flex-col justify-center leading-8 pt-5">
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
            <DropdownAndNavClo />
            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} clo
                        </p>
                        <div className="flex items-center gap-2">

                            <Tooltip
                                title={`Xoá ${selectedRowKeys.length} clo`}
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
                <div className="w-full h-fit overflow-auto">
                    <Table className="table-po min-w-[400px] sm:min-w-[400px] lg:min-w-full xl:min-w-full table-auto text-[#fefefe]"
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
                        title: 'Cập nhật',
                        content:
                            <div className="w-full rounded-lg">
                                <div className=' w-full flex justify-center items-center'>
                                    <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-col  lg:flex-col  xl:flex-col  gap-[20px]'>
                                        <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                            <Divider />
                                            <Steps
                                                current={current}
                                                onChange={handleOnChangeTextName}
                                                items={[
                                                    { title: 'Bước 1', description: 'Tải về form' },
                                                    { title: 'Bước 2', description: 'Tải lại form' },
                                                    { title: 'Bước 3', description: 'Chờ phản hồi' }
                                                ]}
                                            />
                                        </div>

                                        <div className='flex flex-col gap-5 justify-center items-center w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row'>
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
                                                    <CustomUpload endpoint={'clo/update'} LoadData={getAllClo} Data={parseInt(id)}  setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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


export default Clo;
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
                                Clo sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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