// UpdateProgramById.js

import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Divider, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Switch } from "@nextui-org/react";

import { Link } from "react-router-dom";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import useHistory from react-router-dom
import {
    Button,
    Avatar,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
const UpdateProgramById = (nav) => {
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [layout, setLayout] = useState("col");
    const [disableRowLayout, setDisableRowLayout] = useState(false);
    const [name, setName] = useState("");
    const [isDelete, setisDelete] = useState(false);

    const navigate = useNavigate();
    const [scrollBehavior, setScrollBehavior] = useState("inside");


    const getProgramByID = async () => {
        try {
            const response = await axiosAdmin.get(`/program/${id}`);
            if (response.data) {
                setName(response.data.program_name)
                setisDelete(response.data.isDeleted)
            }
            console.log(response);

        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const UpdatePrograms = async () => {
        try {
            const data = {
                program_name: name,
                isDeleted: isDelete
            }
            const response = await axiosAdmin.put(`/program/${id}`, { data });
            onClose(navigate("/admin/manage-program/"))
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        getProgramByID()
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
            <Modal isOpen={isOpen} onClose={() => navigate("/admin/manage-program/")} scrollBehavior={scrollBehavior}>
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>

                        <Input
                            value={name}
                            onValueChange={setName}
                            className="max-w-xs"
                        />

                        <Switch isSelected={isDelete} onValueChange={setisDelete}>
                            Airplane mode
                        </Switch>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            radius="sm"
                            as={Link}
                            to="/admin/manage-program/"
                            onClick={onClose}
                        >
                            Close
                        </Button>

                        <Button onClick={UpdatePrograms} color="primary" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to={"/admin/manage-program"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            DS Chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/store"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Kho lưu trữ
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/create"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Tạo chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/update"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            update
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/po-plo"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            PO-PLO
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default UpdateProgramById;
