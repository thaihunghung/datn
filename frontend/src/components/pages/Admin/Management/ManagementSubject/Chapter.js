
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Table, Tooltip, Button, message } from 'antd';
import { useDisclosure, Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";


import DropdownAndNavChapter from "../../Utils/DropdownAndNav/DropdownAndNavChapter";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";

const Chapter = (nav) => {
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


    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const [fileList, setFileList] = useState([]);
    const columns = [
        {
            title: "Tên Chương",
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
                    <Link to={`/admin/management-subject/${id}/chapter/update/${_id}`}>
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
    const getAllChapter = async () => {
        try {
            const response = await axiosAdmin.get(`/chapter/subject/${id}`);
            const updatedPoData = response.data.map((po) => {
                return {
                    key: po.chapter_id,
                    name: po.chapterName,
                    description: po.description,
                    isDeleted: po.isDelete,
                    action: po.chapter_id,
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
            chapter_id: selectedRowKeys,
        };
        console.log(data)
        try {
            const response = await axiosAdmin.put('/chapters/soft-delete-multiple', { data });
            await getAllChapter();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting POs:", error);
            message.error('Error soft deleting POs');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/chapter/${_id}/soft-delete`);
            await getAllChapter();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for PO with ID ${_id}`);
        }
    };

    const handleDownloadChapter = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                alert('Please select at least one chapter ID');
                return;
            }
            const data = {
                id: selectedRowKeys
            }
            const response = await axiosAdmin.post('/chapter/templates/update', { data: data }, {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'chapter_update.xlsx';
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
        getAllChapter()
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5">
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
            <DropdownAndNavChapter />
            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} chapter
                        </p>
                        <div className="flex items-center gap-2">

                            <Tooltip
                                title={`Xoá ${selectedRowKeys.length} chapter`}
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
                    <Table className="table-po min-w-[500px] sm:min-w-[500px] lg:min-w-full xl:min-w-full table-auto text-[#fefefe]"
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
                        <DownloadAndUpload props={props} handleDownload={handleDownloadChapter} handleOnChangeTextName={handleOnChangeTextName} endpoint={'chapter/update'} current={current} LoadData={getAllChapter} Data={parseInt(id)} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                    }
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            />
        </div>
    );
}


export default Chapter;
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
                                Chương sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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