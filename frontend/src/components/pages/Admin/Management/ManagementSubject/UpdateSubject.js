// UpdateSubject.js

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import DropdownAndNavSubject from "../../Utils/DropdownAndNav/DropdownAndNavSubject";

const UpdateSubject = (nav) => {
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [subjectName, setSubjectName] = useState("");
    const [description, setDescription] = useState("");
    const [numberCredit, setNumberCredit] = useState("");
    const [numberCreditsTheory, setNumberCreditsTheory] = useState("");
    const [numberCreditsPractice, setNumberCreditsPractice] = useState("");
    const [typeSubject, setTypeSubject] = useState("");

    const [scrollBehavior, setScrollBehavior] = useState("inside");

    const navigate = useNavigate();

    const getSubjectByID = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/${id}`);
            if (response.data) {
                setSubjectName(response.data.subjectName);
                setDescription(response.data.description);
                setNumberCredit(response.data.numberCredits);
                setNumberCreditsTheory(response.data.numberCreditsTheory);
                setNumberCreditsPractice(response.data.numberCreditsPractice);
                setTypeSubject(response.data.typesubject);
            }
            console.log(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const updateSubjects = async () => {
        try {
            const data = {
                subject_id: id,
                subjectName: subjectName,
                description: description,
                numberCredits: numberCredit,
                numberCreditsTheory: numberCreditsTheory,
                numberCreditsPractice: numberCreditsPractice,
                typesubject: typeSubject
            };
            console.log(data);
            await axiosAdmin.put(`/subject/${id}`, { data });
            onClose();
            navigate(`/admin/management-subject/list`);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        onOpen();
        getSubjectByID();

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
    }, [id, setCollapsedNav, onOpen]);
    
    useEffect(() => {
        onOpen()
        getSubjectByID()
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
                onClose={() => navigate(`/admin/management-subject/list`)}
                scrollBehavior={scrollBehavior}
            >
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>
                        <span>Tên subject</span>
                        <Input
                            value={subjectName}
                            onValueChange={setSubjectName}
                            className="max-w-xs"
                        />
                        <span>Mô tả</span>
                        <Input
                            value={description}
                            onValueChange={setDescription}
                            className="max-w-xs"
                        />
                        <span>Số tín chỉ</span>
                        <Input
                            value={numberCredit}
                            onValueChange={setNumberCredit}
                            className="max-w-xs"
                        />
                        <span>Số tín chỉ lý thuyết</span>
                        <Input
                            value={numberCreditsTheory}
                            onValueChange={setNumberCreditsTheory}
                            className="max-w-xs"
                        />
                        <span>Số tín chỉ thực hành</span>
                        <Input
                            value={numberCreditsPractice}
                            onValueChange={setNumberCreditsPractice}
                            className="max-w-xs"
                        />
                        <span>Loại môn học</span>
                        <Input
                            value={typeSubject}
                            onValueChange={setTypeSubject}
                            className="max-w-xs"
                        />


                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            radius="sm"
                            as={Link}
                            to={`/admin/management-subject/list`}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        
                        <Button onClick={updateSubjects} color="primary" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <DropdownAndNavSubject />
        </div>
    );
}

export default UpdateSubject;
