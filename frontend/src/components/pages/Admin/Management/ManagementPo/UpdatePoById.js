// UpdatePoById.js

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"; 
import { axiosAdmin } from "../../../../../service/AxiosAdmin";


import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Switch } from "@nextui-org/react";
import { Select } from "antd"; 

const UpdatePoById = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [layout, setLayout] = useState("col");
    const [disableRowLayout, setDisableRowLayout] = useState(false);
    const [po_id, setPo_id] = useState("");
    const [po_name, setPo_name] = useState("");
    const [program_id, setProgram_id] = useState();
    const [programData, setProgramData] = useState([]);

    const [isDelete, setisDelete] = useState(false);

    const navigate = useNavigate();
    const [scrollBehavior, setScrollBehavior] = useState("inside");

    const getPoByID = async () => {
        try {
            const response = await axiosAdmin.get(`/po/${id}`);
            if (response.data) {
                setPo_id(response.data.po_id)
                setPo_name(response.data.po_name)
                setProgram_id(response.data.program_id)
                setisDelete(response.data.isDeleted)
            }
            console.log(response.data);
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const getAllProgram = async () => {
        try {
            const response = await axiosAdmin.get(`/program/isDelete/false`);
            if (response.data) {
                setProgramData(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const UpdatePos = async () => {
        try {
            const data = {
                po_id: po_id,
                po_name: po_name,
                program_id: program_id,
                isDeleted: isDelete
            }
            console.log(data);
            const response = await axiosAdmin.put(`/po/${id}`, { data: data });
            onClose(navigate("/admin/management-po/"))
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        getPoByID()
        getAllProgram()
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setLayout("col");
                setCollapsedNav(true);
                setDisableRowLayout(true);
            } else {
                setDisableRowLayout(false);
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
            <Modal isOpen={isOpen} onClose={() => navigate("/admin/management-po/")} scrollBehavior={scrollBehavior}>
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>
                        <Input
                            value={po_id}
                            onValueChange={setPo_id}
                            className="max-w-xs"
                        />
                        <Switch isSelected={isDelete} onValueChange={setisDelete}>
                            Trạng thái
                        </Switch>
                        <Input
                            value={po_name}
                            onValueChange={setPo_name}
                            className="max-w-xs"
                        />
                        <Select
                            defaultValue={"Chọn chương trình"}
                            value={program_id}
                            onChange={setProgram_id}
                            size="large"
                            className="w-full"
                        >
                            {programData.map((program) => (
                                <Select.Option
                                    key={program.id}
                                    value={program.id}
                                >
                                    {program.program_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            radius="sm"
                            as={Link}
                            to="/admin/management-po/"
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
        </div>
    );
}

export default UpdatePoById;
