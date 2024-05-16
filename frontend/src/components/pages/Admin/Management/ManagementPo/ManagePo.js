import { useEffect, useState } from "react";
import { Button, message } from 'antd';
import { Link, useLocation } from "react-router-dom";
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const ManagePo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [poData, setPoData] = useState([]);

    const [deleteId, setDeleteId] = useState(null);
    const allPoNotIsDelete = async () => {
        try {
            const po = await axiosAdmin.get('/po/isDelete/false');
            setPoData(po.data)
        } catch (err) {
            console.error("Error: " + err.message);
            message.error('Error fetching PO data');
        };
    }

    const hangleChangeidDelete = async (id) => {
        try {
            const response = await axiosAdmin.put(`/po/${id}/toggle-delete`);
            if (response) {
                console.log(response.data.message);
                message.success(response.data.message);
            }
        } catch (err) {
            console.error("Error: " + err.message);
            message.error('Error updating PO status');
        };
    }

    useEffect(() => {
        allPoNotIsDelete()
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
                        hangleChangeidDelete(deleteId);
                        setDeleteId(null);
                    }
                }}
            />

<div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-po/list">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-po/list") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Danh sách PO
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-po/store">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]" >
                            <div className={` ${isActive("/admin/management-po/store") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Kho lưu trữ
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-po/update">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-po/update") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Chỉnh sửa
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-po/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-po/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Tạo mới
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full border mt-5 rounded-lg">
                <table className="table-auto border-collapse border w-full">
                    <tr>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">STT</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">Tên PO</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white text-center">Thao tác</td>
                    </tr>
                    {poData.map((data, i) => (
                        <tr key={i}>
                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{i + 1}</td>
                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{data.poName}</td>
                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 flex justify-center">
                                <div className="flex gap-1 flex-col sm:flex-col lg:flex-row xl:flex-row">
                                    <div className="bg-blue-500 w-[120px] hover:bg-blue-700 text-white  text-center font-bold p-1 rounded">
                                        <Link to={`update/${data.po_id}`} className="w-full h-full">Cập nhật</Link></div>
                                    <div className="bg-red-500 w-[120px] hover:bg-red-700 text-white text-center font-bold p-1 rounded">
                                        <button onClick={() => { onOpen(); setDeleteId(data.po_id); }} className="w-full h-full">Xóa</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
}


export default ManagePo;
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
                                Po sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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