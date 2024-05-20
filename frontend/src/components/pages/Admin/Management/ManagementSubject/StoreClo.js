// StoreClo.js

import { useEffect, useState } from "react";
import { Button, message } from 'antd';
import { Link, useLocation, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Table, Upload, Tooltip, Divider, Steps } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";


const StoreClo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [poListData, setPosListData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const items = [
        {
            key: "Danh sách CLO",
            label: "Danh sách CLO",
            path: `/admin/management-subject/${id}/clo/update`
        },
        {
            key: "CLO_PLO",
            label: "CLO_PLO",
            path: `/admin/management-subject/${id}/clo-plo`
        },
        {
            key: "Tạo mới",
            label: "Tạo mới",
            path: `/admin/management-subject/${id}/clo/create`
        }
    ];
    const [selectedItem, setSelectedItem] = useState("update");
    const handleAction = (key) => {
        const selected = items.find(item => item.key === key);
        if (selected) {
            setSelectedItem(selected.label);
        }
    };
    const columns = [
        {
            title: "Tên CLO",
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
                    <Tooltip title="Khôi phục">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            onClick={() => handleRestoreById(_id)}
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xoá vĩnh viễn">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            color="danger"
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
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    const handleRestore = async () => {
        const data = {
            clo_id: selectedRowKeys,
        }
        try {
            const response = await axiosAdmin.put('/clo/listId/soft-delete-multiple', { data });
            handleUnSelect();
            message.success(response.data.message);
            getAllClo()
        } catch (error) {
            console.error("Error soft deleting PLOs:", error);
            message.error('Error soft deleting PLOs');
        }
    };

    const handleRestoreById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/clo/${_id}/toggle-soft-delete`);
            handleUnSelect();
            message.success(response.data.message);
            getAllClo()
        } catch (error) {

            console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for PO with ID ${_id}`);
        }
    };

    const getAllClo = async () => {
        try {
            const response = await axiosAdmin.get(`/clo/archive/subject/${id}`);
            const updatedPloData = response.data.map((plo) => {
                return {
                    key: plo.clo_id,
                    name: plo.cloName,
                    description: plo.description,
                    isDeleted: plo.isDelete,
                    action: plo.clo_id,
                };
            });
            setPosListData(updatedPloData);
            
        } catch (error) {
            console.error("Error: " + error.message);
            //message.error('Error fetching PLO data');
        }
    };

    const handleDelete = async () => {
      const data = {
          clo_id: selectedRowKeys,
      };
      console.log(data)
      try {
        const response = await axiosAdmin.delete('/clo/delete/multiple', { params: data });

        await getAllClo();
          handleUnSelect();
          message.success(response.data.message);
      } catch (error) {
          console.error("Error soft deleting Clos:", error);
          message.error('Error soft deleting Clos');
      }
  };

  const handleDeleteById = async (_id) => {
    console.log(_id)
      try {
          const response = await axiosAdmin.delete(`/clo/${_id}`);
          await getAllClo();
          handleUnSelect();
          message.success(response.data.message);
      } catch (error) {
          console.error(`Error toggling soft delete for Clo with ID ${_id}:`, error);
          message.error(`Error toggling soft delete for Clo with ID ${_id}`);
      }
  };

    useEffect(() => {
        getAllClo()
        const initialSelectedItem = items.find(item => isActive(item.path));
            if (initialSelectedItem) {
                setSelectedItem(initialSelectedItem.key);
            }
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
                        handleDeleteById(deleteId);
                        setDeleteId(null);
                    } else if (selectedRowKeys.length > 0) {
                        handleDelete();
                        setSelectedRowKeys([]);
                    }
                }}
            />
<div className="flex justify-between px-5 w-full items-center">
                <div className="flex gap-2 justify-center items-center lg:hidden xl:hidden">
                    <Link to={`/admin/management-subject/list`}>
                        <Tooltip title="Quay lại" color={'#ff9908'}>
                        <Button variant="bordered"> 
                                <i class="fa-solid fa-arrow-left text-xl"></i>
                            </Button>
                        </Tooltip>
                    </Link>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered" className="text-base font-bold">
                                {selectedItem} <i className="fas fa-chevron-right ml-2"></i>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions" items={items} onAction={handleAction}>
                            {(item) => (
                                <DropdownItem key={item.key}>
                                    <Link to={item.path} className="h-full">
                                        <div className="min-w-[200px] text-base font-bold text-[#020401]">
                                            {item.label}
                                        </div>
                                    </Link>
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                </div>

             <div className="hidden sm:hidden lg:block xl:block">
                <div className="flex border justify-start text-base font-bold rounded-lg">
                    <Link to={`/admin/management-subject/list`}>
                        <Tooltip title="Quay lại" color={'#ff9908'}>
                            <div className="p-5">
                                <i class="fa-solid fa-arrow-left text-xl"></i>
                            </div>
                        </Tooltip>
                    </Link>

                    <Link to={`/admin/management-subject/${id}/clo/update`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/clo/update`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Danh sách CLO
                            </div>
                        </div>
                    </Link>

                    <Link to={`/admin/management-subject/${id}/clo-plo`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/clo-plo`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                CLO_PLO
                            </div>
                        </div>
                    </Link>

                    <Link to={`/admin/management-subject/${id}/clo/create`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/clo/create`) ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Tạo mới
                            </div>
                        </div>
                    </Link>
                </div>
                </div>
                <div className="hidden sm:hidden lg:block xl:block">
                    <Link to={`/admin/management-subject/${id}/clo/store`}>
                        <Button color="default">
                            <i className="fa-solid mr-2 fa-trash-can"></i><span className="text-base">Kho lưu trữ</span>
                        </Button>
                    </Link>
                </div>
                <div className="lg:hidden xl:hidden">
                    <Link to={`/admin/management-subject/${id}/clo/store`}>
                       <Tooltip title="Kho lưu trữ" color={'#ff9908'}>
                        <Button color="default" className="w-fit">
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                        </Tooltip> 
                    </Link>
                </div>
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
                                title={`Khôi phục ${selectedRowKeys.length} clo`}
                                getPopupContainer={() =>
                                    document.querySelector(".Quick__Option")
                                }
                            >
                                <Button isIconOnly variant="light" radius="full" onClick={() => handleRestore()}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </Button>
                            </Tooltip>
                            <Tooltip
                                title={`Xoá vĩnh viễn ${selectedRowKeys.length} clo`}
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
        </div>
    );
}


export default StoreClo;
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
                                xóa vĩnh viễn, tiếp tục thao tác?
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
