// ManagementRubric.js

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Tooltip, Button, message } from 'antd';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubric from "../../Utils/DropdownAndNav/DropdownAndNavRubric";
import Cookies from "js-cookie";
import CreateRubic from "./CreateRubic";
import ModalUpdateRubric from "./ModalUpdateRubric";

const ManagementRubric = (nav) => {
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [DataSubject, setDataSubject] = useState([]);
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const handleEditClick = (rubric) => {
        setEditRubric(rubric);
        setIsEditModalOpen(true);
    };

    const getAllSubject = async () => {
        try {
            const response = await axiosAdmin.get(`/subjects/isDelete/false`);
            if (response.data) {
                setDataSubject(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            message.error('Error fetching subjects');
        }
    }


    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const handleOpenModalCreate = () => setIsOpenModalCreate(true);
    const handleCloseModalCreate = () => setIsOpenModalCreate(false);

    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicData, setRubicData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRubric, setEditRubric] = useState({
        rubric_id: "",
        subject_id: "",
        teacher_id: "",
        rubricName: "",
        comment: "",
    });


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
    const handleEditFormSubmit = async (values, teacher_id) => {
        console.log("editRubric");
        console.log(editRubric);
        // if (!teacher_id) {
        //   console.error("No teacher selected for editing");
        //   return;
        // }

        // try {
        //   const res = await axiosAdmin.put(`/teacher/${teacher_id}`, { data: values });
        //   successNoti(res.data.message);
        //   setIsEditModalOpen(false);
        //   const { teachers, total } = await fetchTeachersData(page, rowsPerPage, filterValue);
        //   setTeachers(teachers);
        //   setTotalTeachers(total);
        // } catch (error) {
        //   console.error("Error updating teacher:", error);
        //   if (error.response && error.response.data && error.response.data.message) {
        //     errorNoti(error.response.data.message);
        //   } else {
        //     errorNoti("Error updating teacher");
        //   }
        // }
    };
    const columns = [
        {
            title: "Tên rubric",
            dataIndex: "name",
            render: (record) => (
                <div className="text-sm min-w-[100px]">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: "items",
            dataIndex: "status",
            render: (record) => (
                <div className="text-sm">
                    {record.status ?
                        <Link to={`/admin/management-rubric/${record._id}/rubric-items/list`}>

                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                            >
                                <p>Chỉnh sửa</p>
                            </Button>

                        </Link>
                        :
                        <Link to={`/admin/management-rubric/${record._id}/rubric-items/list`}>
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                            >
                                <p>Tạo mới</p>
                            </Button>

                        </Link>
                    }
                </div>
            ),
        },
        {
            title: "Tổng điểm",
            dataIndex: "point",
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
            render: (Rubric) => (
                <div className="flex items-center justify-center w-full gap-2">
                    {/* <Link to={`/admin/management-rubric/update/${_id}`}> */}
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            className="bg-[#AF84DD]"
                            onClick={() => { handleEditClick(Rubric) }}
                        >
                            <i className="fa-solid fa-pen"></i>
                        </Button>
                    </Tooltip>
                    {/* </Link> */}
                    <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            onClick={() => { onOpen(); setDeleteId(Rubric.rubric_id); }}
                            className="bg-[#FF8077]"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Tooltip>
                    <Link to={`/admin/management-grading/list`}>
                        <Tooltip title="Chấm điểm">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                                className="bg-[#FF9908] "
                            >
                                <i className="fa-solid fa-feather-pointed"></i>
                            </Button>
                        </Tooltip>
                    </Link>
                </div>
            ),
        },

    ];

    const getAllRubricIsDeleteFalse = async () => {
        try {
            const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
            const updatedRubricData = response.data.rubric.map((rubric) => {
                const Rubric = {
                    rubric_id: rubric.rubric_id,
                    subject_id: rubric.subject_id,
                    teacher_id: rubric.teacher_id,
                    rubricName: rubric.rubricName,
                    comment: rubric.comment,
                }

                const status = {
                    status: rubric.RubricItem.length === 0 ? false : true,
                    _id: rubric.rubric_id
                };
                return {
                    key: rubric.rubric_id,
                    name: rubric.rubricName,
                    status: status,
                    point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
                    action: Rubric
                };
            });
            setRubicData(updatedRubricData);
            console.log(updatedRubricData);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching Rubric data');
        }
    };

    const handleSoftDelete = async () => {
        const data = {
            rubric_id: selectedRowKeys,
        };
        try {
            const response = await axiosAdmin.put('/rubrics/softDelete', { data });
            await getAllRubricIsDeleteFalse();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting rubrics:", error);
            message.error('Error soft deleting rubrics');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/rubric/${_id}/softDelete`);
            await getAllRubricIsDeleteFalse();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for rubric with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for rubric with ID ${_id}`);
        }
    };

    useEffect(() => {

        getAllRubricIsDeleteFalse()
        getAllSubject()
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">
            <ModalUpdateRubric
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editRubric={editRubric}
                setEditRubric={setEditRubric}
                DataSubject={DataSubject}


            />
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
            <DropdownAndNavRubric open={handleOpenModalCreate} />
            {/* <Button onClick={handleOpenModalCreate}>tạo mới</Button> */}
            <div className="w-full my-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} rubric
                        </p>
                        <div className="flex items-center gap-2">
                            <Tooltip
                                title={`Xoá ${selectedRowKeys.length} rubric`}
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
                <div className="w-full overflow-auto">
                    <Table className="table-po text-[#fefefe]"
                        bordered
                        loading={loading}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={rubicData}
                    />
                    <CreateRubic onOpen={handleOpenModalCreate} isOpen={isOpenModalCreate} onClose={handleCloseModalCreate} />
                </div>
            </div>
        </div>
    );
}

export default ManagementRubric;

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
                                Rubric sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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