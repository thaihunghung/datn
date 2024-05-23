// CreateSubject.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button, Select, message, Tooltip } from 'antd';

import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

import Tabs from "../../Utils/Tabs/Tabs";
import DropdownAndNavSubject from "../../Utils/DropdownAndNav/DropdownAndNavSubject";

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

    const [current, setCurrent] = useState(0);

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

                                <div className="w-full rounded-lg">
                                    <div className=' w-full flex justify-center items-center'>
                                        <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-col  lg:flex-col  xl:flex-col  gap-[20px]'>
                                            <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                                <Divider />
                                                <Steps
                                                    current={current}
                                                    onChange={handleOnChangeTextName}
                                                    items={[
                                                        { title: 'Bước 1', description: 'Tải về form' },
                                                        { title: 'Bước 2', description: 'Tải lại form' },
                                                        { title: 'Bước 3', description: 'Chờ phản hồi' }
                                                    ]}
                                                />
                                            </div>

                                            <div className='flex flex-col gap-5 justify-center items-center w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row'>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                                                    <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
                                                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadSubject}>
                                                            <scan>Tải xuống mẫu </scan>
                                                        </Button>

                                                    </div>
                                                </div>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
                                                    <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Gửi lại mẫu</p></div>
                                                        <Upload {...props} >
                                                            <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
                                                        </Upload>
                                                    </div>
                                                </div>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
                                                    <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Cập nhật Dữ liệu</p></div>
                                                        <CustomUpload endpoint={'subject'} method={'POST'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}


export default CreateSubject;
