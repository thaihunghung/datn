import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


import { Table, Tooltip, message } from 'antd';
import { useDisclosure, Modal, Chip, Button, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import DropdownAndNavClo from "../../Utils/DropdownAndNav/DropdownAndNavClo";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";

import Cookies from "js-cookie";
import BackButton from "../../Utils/BackButton/BackButton";
import ModalUpdateClo from "./ModalUpdateClo";
import ModalAddClo from "./ModalAddClo";
import { PlusIcon } from "../../../../../public/PlusIcon";

const Clo = (nav) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    
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

    const [Subject, setSubject] = useState({});

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
            render: (action) => (
                <div className="flex items-center justify-center w-full gap-2">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            className="bg-[#AF84DD]"
                            onClick={() => { handleEditClick(action.CLO) }}
                        >
                            <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            className="bg-[#FF8077]"
                            variant="light"
                            radius="full"
                            size="sm"
                            onClick={() => { onOpen(); setDeleteId(action._id); }}
                        >
                            <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
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

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };

    const getAllClo = async () => {
        try {
            const response = await axiosAdmin.get(`/clos?subject_id=${id}&isDelete=false`);
            const updatedPoData = response.data.map((clo) => ({
                key: clo?.clo_id,
                name: clo?.cloName,
                description: clo?.description,
                isDeleted: clo?.isDelete,
                action: {
                    _id: clo?.clo_id,
                    CLO: {
                        clo_id: clo?.clo_id,
                        cloName: clo?.cloName,
                        description: clo?.description,
                        subject_id: clo?.subject_id,
                    }
                }
            }));
            setPosListData(updatedPoData);
            console.log(response.data);
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };
    const getSubjectById = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/${id}`);
            console.log("response.data");
            console.log(response.data);
            setSubject(response?.data?.subject)
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };

    const handleSoftDelete = async () => {
        const data = { clo_id: selectedRowKeys };
        try {
            const response = await axiosAdmin.put('/clos/softDelete', { data });
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
            const response = await axiosAdmin.put(`/clo/${_id}/softDelete`);
            await getAllClo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for Clo with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for Clo with ID ${_id}`);
        }
    };

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newClo, setNewClo] = useState({
        cloName: "",
        description: "",
        subject_id: "",
    });
    const [editClo, setEditClo] = useState({
        clo_id: "",
        cloName: "",
        description: "",
        subject_id: "",
    });

    const handleEditFormSubmit = async (values, clo_id) => {
        if (!clo_id) {
            console.error("No clo selected for editing");
            return;
        }
        try {
            const response = await axiosAdmin.put(`/clo/${clo_id}`, { data: values });
            getAllClo();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error updating clo:", error);
            message.error("Error updating clo: " + (error.response?.data?.message || 'Internal server error'));
        }
    };
    const UnValueModalNew = {
        cloName: "",
        description: "",
        subject_id: id,
    }
    const handleFormSubmit = async (event) => {
        // setNewClo(UnValueModalNew);
        // const [newClo, setNewClo] = useState({
        //     cloName: "",
        //     description: "",
        //     subject_id: "",
        // });
        
        if (newClo.cloName === "") {
            message.warning('Please input a new clo name');
            return;
        }
        const data = {
            cloName: newClo.cloName,
            description: newClo.description,
            subject_id: id,
        }
        try {
            const response = await axiosAdmin.post('/clo', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
                setNewClo(UnValueModalNew)
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    };
    const handleEditClick = (clo) => {
        setEditClo(clo);
        setIsEditModalOpen(true);
    };
    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };


    useEffect(() => {
        getSubjectById()
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
            <ModalUpdateClo
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editData={editClo}
                setEditData={setEditClo}
            />


            <ModalAddClo
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                editData={newClo}
                setEditData={setNewClo}
            />

            {/* <DropdownAndNavClo /> */}
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-center items-center flex gap-4 flex-col'>
                    <div className='flex justify-center w-full flex-wrap items-center gap-1'>
                        <Button

                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-subject/${id}/clo-plo`
                            )}
                        >
                            Clo_Plo
                        </Button>
                        <Button
                            className='bg-[#AF84DD] '
                            endContent={<PlusIcon />}
                            onClick={handleAddClick}
                        >
                            New
                        </Button>
                        <Button
                            className='bg-[#FF8077] '
                            endContent={<PlusIcon />}
                            onClick={onOpen}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Deletes
                        </Button>
                        <Button
                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-subject/${id}/clo/store`
                            )}
                        >
                            Store
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 w-full flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-2xl w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">{Subject.subjectCode + ': ' + Subject.subjectName}</div>
            </div>
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách Clo</h1>
            </div>

            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} clo
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