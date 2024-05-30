// ManagementRubric.js

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Tooltip, Button, message } from 'antd';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubric from "../../Utils/DropdownAndNav/DropdownAndNavRubric";

const ManagementRubric = (nav) => {
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicData, setRubicData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

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
                        <Link to={`/admin/management-rubric/${record._id}/rubric-items/create`}>

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
            render: (_id) => (
                <div className="flex items-center justify-center w-full gap-2">
                    <Link to={`/admin/management-rubric/update/${_id}`}>
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
                    <Link to={`/admin/management-rubric/update/${_id}`}>
                        <Tooltip title="Chấm điểm">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
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
            const response = await axiosAdmin.get(`/rubrics/user/${1}/checkscore`);
            const updatedRubricData = response.data.rubric.map((rubric) => {
                const status = {
                    status: rubric.RubricItem.length === 0 ? false : true,
                    _id: rubric.rubric_id
                };
                return {
                    key: rubric.rubric_id,
                    name: rubric.rubricName,
                    status: status,
                    point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
                    action: rubric.rubric_id
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
            const response = await axiosAdmin.put('/rubrics/soft-delete-multiple', { data });
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
            const response = await axiosAdmin.put(`/rubric/${_id}/soft-delete`);
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
            <DropdownAndNavRubric />
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