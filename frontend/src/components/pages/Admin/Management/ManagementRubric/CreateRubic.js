// CreateRubic.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button,Select, message, Tooltip } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import DropdownAndNavRubric from "../../Utils/DropdownAndNav/DropdownAndNavRubric";

const CreateRubic = (nav) => {
    const { setCollapsedNav } = nav;
    const [activeTab, setActiveTab] = useState(0);

    const [rubricName, setRubricName] = useState("");
    const [Comment, setComment] = useState("");
    const [subject_id, setSubject_id] = useState();
    const [DataSubject, setDataSubject] = useState([]);


    const handleSave = async () => {
        try {
            const data = {
                subject_id: subject_id,
                rubricName: rubricName,
                comment: Comment,
            }

            const response = await axiosAdmin.post('/rubric', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    }
    const getAllSubject = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/isDelete/false`);
            if (response.data) {
                setDataSubject(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            message.error('Error fetching subjects');
        }
    }
    useEffect(() => {
        getAllSubject()
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
            <DropdownAndNavRubric />
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Tạo mới',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Select
                                            defaultValue={"Chọn học phần"}
                                            value={subject_id}
                                            onChange={setSubject_id} 
                                            size="large"
                                            className="w-full"
                                        >
                                            {DataSubject.map((subject) => (
                                                <Select.Option
                                                    key={subject.subject_id}
                                                    value={subject.subject_id}
                                                >
                                                    {subject.subjectName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                        <Input
                                            label="Name Clo"
                                            placeholder="Enter your name Rubric"
                                            value={rubricName}
                                            onValueChange={setRubricName}

                                        />
                                        <Input
                                            label="Ghi chú"
                                            placeholder="Enter your Comment"
                                            value={Comment}
                                            onValueChange={setComment}

                                        /> 
                                
                                        <div className="w-full flex justify-center items-center">
                                            <Button color="primary" onClick={handleSave} className="max-w-[300px] mt-5 px-20">
                                                Tạo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                        },
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}


export default CreateRubic;
