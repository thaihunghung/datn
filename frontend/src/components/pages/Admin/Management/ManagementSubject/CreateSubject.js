import { useEffect, useState } from "react";

import { Input } from "@nextui-org/react";
import { Button, message} from 'antd';

import DropdownAndNavSubject from "../../Utils/DropdownAndNav/DropdownAndNavSubject";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";

const CreateSubject = (nav) => {
    const { setCollapsedNav } = nav;
    const [fileList, setFileList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [subjectName, setSubjectName] = useState("");
    const [description, setDescription] = useState("");
    const [numberCredit, setNumberCredit] = useState("");
    const [numberCreditsTheory, setNumberCreditsTheory] = useState("");
    const [numberCreditsPractice, setNumberCreditsPractice] = useState("");
    const [typeSubject, setTypeSubject] = useState("");
    const [current, setCurrent] = useState(0);

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };
    
    const handleSave = async () => {
        try {
            const data = {
                subjectName: subjectName,
                description: description,
                numberCredits: parseInt(numberCredit),
                numberCreditsTheory: parseInt(numberCreditsTheory),
                numberCreditsPractice: parseInt(numberCreditsPractice),
                typesubject: typeSubject
            }

            const response = await axiosAdmin.post('/subject', { data: data });
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

    const handleDownloadSubject = async () => {
        try {
            const response = await axiosAdmin.get('/subject/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'subject.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setCurrent(1);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    useEffect(() => {
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
            <DropdownAndNavSubject />
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Tên subject"
                                            placeholder="Enter your name subject"
                                            value={subjectName}
                                            onValueChange={setSubjectName}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            label="Mô tả"
                                            placeholder="Enter your Description"
                                            value={description}
                                            onValueChange={setDescription}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            label="Số tín chỉ"
                                            placeholder="Enter your NumberCredit"
                                            value={numberCredit}
                                            onValueChange={setNumberCredit}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            label="Số tín chỉ lý thuyết"
                                            placeholder="Enter your NumberCreditsTheory"
                                            value={numberCreditsTheory}
                                            onValueChange={setNumberCreditsTheory}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            label="Số tín chỉ thực hành"
                                            placeholder="Enter your NumberCreditsPractice"
                                            value={numberCreditsPractice}
                                            onValueChange={setNumberCreditsPractice}
                                            className="max-w-xs"
                                        />
                                        <Input
                                            label="Loại học phần"
                                            placeholder="Enter your setTypeSubject"
                                            value={typeSubject}
                                            onValueChange={setTypeSubject}
                                            className="max-w-xs"
                                        />
                                        <div className="w-full flex justify-center items-center">
                                            <Button color="primary" onClick={handleSave} className="max-w-[300px] mt-5 px-20">
                                                Tạo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                        },
                        {
                            title: 'Nhập liệu CSV',
                            content:
                                <DownloadAndUpload props={props} endpoint={'subject'} method={'POST'} handleDownload={handleDownloadSubject} handleOnChangeTextName={handleOnChangeTextName} current={current} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}


export default CreateSubject;
