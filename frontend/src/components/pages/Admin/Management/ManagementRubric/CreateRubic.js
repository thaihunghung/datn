// CreateRubic.js

import { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Divider, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Switch } from "@nextui-org/react";
import { Select } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import useHistory from react-router-dom
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
const CreateRubic = (nav) => {
    const { id } = useParams();
    const location = useLocation();
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [layout, setLayout] = useState("col");
    const [disableRowLayout, setDisableRowLayout] = useState(false);
    const [name, setName] = useState("");
    const [isDelete, setisDelete] = useState(false);
    const [subject_id, setSubject_id] = useState();
    const [rubricName, setRubricName] = useState("");
    const [comment, setComment] = useState("");
      
    const navigate = useNavigate();
    const [scrollBehavior, setScrollBehavior] = useState("inside");
    const [SubjectData, setSubject] = useState([]);

    const dataDemo = [
        {
            "subject_id": 13,
            "subjectName": "Thống kê và phân tích dữ liệu"
        }
    ]

    const UpdatePrograms = async () => {
        try {
            //await axiosAdmin.get(`/Subject`);
            
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    const CreateRubic = async () => {
        try {
            const data = {
                subject_id: subject_id,
                rubricName: rubricName,
                comment:comment
            }
            console.log(data);
            await axiosAdmin.post(`/rubric`, {data: data});
            navigate("/admin/management-rubric/")
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        setSubject(dataDemo)
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
    // onClose={() => navigate("/admin/management-rubric/")}
    return (
        <div className="flex w-full flex-col justify-center items-start leading-8 p-2 bg-[#f5f5f5]-500">
            <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}>
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1 text-[#FF9908] font-bold text-lg">Cập nhật</ModalHeader>
                    <ModalBody>
                        <Select
                            defaultValue={"Chọn học phần"}
                            value={subject_id}
                            onChange={setSubject_id}
                            size="large"
                            className="w-full"
                        >
                            {SubjectData.map((Subject) => (
                                <Select.Option
                                    key={Subject.subject_id}
                                    value={Subject.subject_id}
                                >
                                    {Subject.subjectName}
                                </Select.Option>
                            ))}
                        </Select>
                        <span className="text-[#020401]">rubric</span>

                        <Input
                            value={rubricName}
                            onValueChange={setRubricName}
                            className="max-w-xs"
                        />
                       <span className="text-[#020401]">comment</span>
                        <Input
                            value={comment}
                            onValueChange={setComment}
                            className="max-w-xs"
                        />
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="bg-[#FF8077] text-[#FEFEFE]"
                            radius="sm"
                            as={Link}
                            to="/admin/management-rubric/"
                            onClick={onClose}
                        >
                            Close
                        </Button>

                        <Button onClick={CreateRubic} className="text-[#FEFEFE] bg-[#475569]" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
        </div>
    );
}

export default CreateRubic;
