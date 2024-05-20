// UpdateClo.js

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Tooltip, message } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const UpdateClo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id, clo_id } = useParams();

    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [cloname, setCloName] = useState("");
    const [Description, setDescription] = useState("");

    const [scrollBehavior, setScrollBehavior] = useState("inside");

    const [isDelete, setisDelete] = useState(false);

    const navigate = useNavigate();
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

    const getPoByID = async () => {
        try {
            const response = await axiosAdmin.get(`/clo/${clo_id}`);
            if (response.data) {
                setCloName(response.data?.cloName)
                setDescription(response.data?.description)
            }
            console.log(response.data);
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    const [selectedItem, setSelectedItem] = useState("Danh sách CLO");

    const handleAction = (key) => {
        const selected = items.find(item => item.key === key);
        if (selected) {
            setSelectedItem(selected.label);
        }
    };

    const UpdatePos = async () => {
        try {
            const data = {
                clo_id: clo_id,
                cloName: cloname,
                description: Description,
                subject_id: id
            }
            console.log(data);
            const response = await axiosAdmin.put(`/clo/${clo_id}`, { data: data });
            onClose(navigate(`/admin/management-subject/${id}/clo/update`))
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        getPoByID()
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
                onClose={() => navigate(`/admin/management-subject/${id}/clo/update`)}
                scrollBehavior={scrollBehavior}
            >
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>
                        <span>Tên CLO</span>
                        <Input
                            value={cloname}
                            onValueChange={setCloName}
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
                            to={`/admin/management-subject/${id}/clo/update`}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button onClick={UpdatePos} color="primary" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
<div className="flex gap-2 justify-between px-5 w-full items-center">
                <div className="flex justify-center items-center lg:hidden xl:hidden">
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
                        <Button color="default">
                                <i class="fa-solid fa-arrow-left text-xl"></i>
                            </Button>
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
        </div>
    );
}

export default UpdateClo;
