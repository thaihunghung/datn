// UpdateClo.js

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Tooltip, message, Button } from 'antd';

const UpdateChapter = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id, chapter_id } = useParams();

    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [chaptername, setChapterName] = useState("");
    const [Description, setDescription] = useState("");

    const [scrollBehavior, setScrollBehavior] = useState("inside");

    const navigate = useNavigate();
    const getChapterByID = async () => {
        try {
            const response = await axiosAdmin.get(`/chapter/${chapter_id}`);
            if (response.data) {
                setChapterName(response.data?.chapterName)
                setDescription(response.data?.description)
            }
            console.log(response.data);
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const UpdateChapter = async () => {
        try {
            const data = {
                clo_id: chapter_id,
                cloName: chaptername,
                description: Description,
                subject_id: id
            }
            console.log(data);
            await axiosAdmin.put(`/chapter/${chapter_id}`, { data: data });
            onClose(navigate(`/admin/management-subject/${id}/chapter/update`))
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        getChapterByID()
        const handleResize = () => {
            if (window.innerWidth < 1024) {

                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
            //console.log(window.innerWidth);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex w-full flex-col justify-center items-start leading-8 p-2 bg-[#f5f5f5]-500">
            <Modal
                isOpen={isOpen}
                onClose={() => navigate(`/admin/management-subject/${id}/chapter/update`)}
                scrollBehavior={scrollBehavior}
            >
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>
                        <span>Tên Chapter</span>
                        <Input
                            value={chaptername}
                            onValueChange={setChapterName}
                            className="max-w-xs"
                        />
                        <span>Mô tả</span>
                        <Input
                            value={Description}
                            onValueChange={setDescription}
                            className="max-w-xs"
                        />


                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            radius="sm"
                            as={Link}
                            to={`/admin/management-subject/${id}/chapter/update`}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button onClick={UpdateChapter} color="primary" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className="flex justify-between px-5 w-full items-center">
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to={`/admin/management-subject/list`}>
                        <Tooltip title="Quay lại" color={'#ff9908'}>
                            <div className="p-5">
                                <i class="fa-solid fa-arrow-left text-xl"></i>
                            </div>
                        </Tooltip>
                    </Link>
                    <Link to={`/admin/management-subject/${id}/chapter/update`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/chapter/update`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Danh sách CHAPTER
                            </div>
                        </div>
                    </Link>
                    <Link to={`/admin/management-subject/${id}/chapter-clo`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/chapter-clo`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                CHAPTER_CLO
                            </div>
                        </div>
                    </Link>
                    <Link to={`/admin/management-subject/${id}/chapter/create`}>
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive(`/admin/management-subject/${id}/chapter/create`) ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Tạo mới
                            </div>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to={`/admin/management-subject/${id}/chapter/store`}>
                        <Tooltip title="Kho lưu trữ">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"

                            >
                                <i className="fa-solid mr-2 fa-trash-can"></i><span className="text-base">Kho lưu trữ</span>
                            </Button>
                        </Tooltip></Link>
                </div>
            </div>
        </div>
    );
}

export default UpdateChapter;
