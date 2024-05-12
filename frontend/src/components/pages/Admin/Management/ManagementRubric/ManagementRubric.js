// ManagementRubric.js

import { useEffect, useState } from "react";
import { Button } from 'antd';
import { Link, useLocation } from "react-router-dom";

import {
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const ManagementRubric = (nav) => {
    const location = useLocation();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [rubicData, setRubicData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const allRubricByUser = async () => {
        try {
            const rubric = await axiosAdmin.get('/rubric/get-by-user/checkscore');
            setRubicData(rubric.data)
            console.table(rubric.data);
        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    const hangleChangeidDelete = async (id) => {
        // try {
        //     const response = await axiosAdmin.put(`/rubric/isDelete/${id}`);
        //     if (response) {
        //         console.log(response.data);

        //         console.log(response.data.message);
        //     }
        // } catch (err) {
        //     console.log("Error: " + err.message);
        // };
    }

    useEffect(() => {
        allRubricByUser()
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
            <div className="w-fit flex  justify-start text-base font-bold rounded-lg border-1 border-[#FF8077]">
          <Link to={"/admin/management-rubric"}
            className={location.pathname.startsWith('/admin/management-rubric') ? "bg-[#475569] text-[#FEFEFE]" : ""}
          >
            
            <div className="p-5  hover:bg-slate-600 hover:text-white">
              DS rubric
            </div>
          </Link>
          <Link to={"/admin/management-rubric/store"}
            className={location.pathname.startsWith('/admin/management-rubric/store') ? "bg-[#475569] text-[#FEFEFE]" : ""}
          >
            <div className="p-5  hover:bg-slate-600 hover:text-white">
              Kho lưu trữ
            </div>
          </Link>
          <Link to={"/admin/management-rubric/create"}
            className={location.pathname.startsWith('/admin/management-rubric/create') ? "bg-[#475569] text-[#FEFEFE]" : ""}
          >
            <div className="p-5  hover:bg-slate-600 hover:text-white">
              Tạo rubric
            </div>
          </Link>
          <Link to={"/admin/management-rubric/update"}
            className={location.pathname.startsWith('/admin/management-rubric/update') ? "bg-[#475569] text-[#FEFEFE]" : ""}
          >
            <div className="p-5  hover:bg-slate-600 hover:text-white">
              update
            </div>
          </Link>
        </div>
            </div>
            <div className="w-full border mt-5 rounded-lg">
                <table className="table-auto border-collapse border w-full">
                    <tr>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white text-center">STT</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white text-center">Tên rubric</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white text-center">Trạng thái điểm</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white text-center">Trạng thái</td>
                        <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white text-center">Thao tác</td>
                    </tr>
                    {rubicData.map((data, i) => (
                        <tr key={i}>
                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{i + 1}</td>
                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{data.rubric_name}</td>


                            {data.checkScore10 === "no" ? (
                                <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">Chưa đủ điểm</td>
                            ) : (
                                <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">Đủ điểm</td>
                            )}

                            <td className="p-2 border-1 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 flex justify-center">
                                <div className="flex gap-1 flex-col sm:flex-col lg:flex-row xl:flex-row">
                                    <div className="bg-blue-500 w-[120px] hover:bg-blue-700 text-white  text-center font-bold p-1 rounded">
                                        <Link to={`update/${data.rubric_id}`} className="w-full h-full">Cập nhật</Link></div>
                                    <div className="bg-red-500 w-[120px] hover:bg-red-700 text-white text-center font-bold p-1 rounded">
                                        <button onClick={() => { onOpen(); setDeleteId(data.rubric_id); }} className="w-full h-full">Xóa</button>
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

export default ManagementRubric;

function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
    const handleOnOKClick = (onClose) => {
        onClose();
        console.log('thanđ');
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
                                Chương trình sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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