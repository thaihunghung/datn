import { useEffect, useState } from "react";
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import {
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const ManageProgram = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [programData, setProgramData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const allProgramNotIsDelete = async () => {
        try {
            const program = await axiosAdmin.get('/program/isDelete/false');
            setProgramData(program.data)
            console.log(program.data);
        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    const hangleChangeidDelete = async (id) => {
        try {
            const response = await axiosAdmin.put(`/program/isDelete/${id}`);
            if (response) {
                console.log(response.data);

                console.log(response.data.message);
            }
        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    useEffect(() => {
        allProgramNotIsDelete()
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
                    <Link to="/admin/management-program/description">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/description") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]" >
                            <div className={` ${isActive("/admin/management-program/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Tạo chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/update">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/update") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Chỉnh sửa
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full border mt-5 rounded-lg">
                <div className="w-full border-collapse border">
                    <div className="w-full">
                        <div className="w-full border-1 bg-[#475569] text-white text-center">Mô tả</div>
                    </div>
                    <div className="border-1 text-justify leading-8 p-5">
                        <div className="w-full text-2xl text-[#475569] mb-5 font-bold">{programData?.programName}</div>

                        <div dangerouslySetInnerHTML={{ __html: programData?.description }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManageProgram;

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