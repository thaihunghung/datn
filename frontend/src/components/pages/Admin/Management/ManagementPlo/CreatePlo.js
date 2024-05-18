// CreatePlo.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button, Select, message, Tooltip } from 'antd';
import { Link, useLocation } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const CreatePlo = (nav) => {
    const { setCollapsedNav } = nav;
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const [fileList, setFileList] = useState([]);

    const [programData, setProgramData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);


    const [ploName, setPloName] = useState("");
    const [Description, setDescription] = useState("");
    const [program_id, setProgram_id] = useState();


    const handleSave = async () => {
        try {
            if (ploName === "") {
                alert("dữ liệu lỗi")
                document.getElementById("name-program").focus();
                return;
            }
            const data = {
                ploName: ploName,
                description: Description,
                program_id: program_id
            }

            const response = await axiosAdmin.post('/plo', { data: data });
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


    const getAllProgram = async () => {
        try {
            const response = await axiosAdmin.get(`/program/isDelete/false`);
            if (response.data) {
                setProgramData(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching programs:", error);
            message.error('Error fetching programs');
        }
    }
    const [current, setCurrent] = useState(0);

    const handleDownloadPo = async () => {
        try {
            const response = await axiosAdmin.get('/plo/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'plo.xlsx';
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
        getAllProgram()
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
        <div className="flex w-full flex-col px-4 justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
             <div className="flex justify-between px-5 w-full items-center">
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-plo/list">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-plo/list") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Danh sách PLO
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-plo/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-plo/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Tạo mới
                            </div>
                        </div>
                    </Link>
                </div>
                <div>
                    <Link to="/admin/management-plo/store">
                        <Tooltip title="Xoá">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"

                            >
                                 <span className="text-base">Kho lưu trữ </span><i className="fa-solid ml-2 fa-trash-can"></i>
                            </Button>
                        </Tooltip></Link>
                </div>
            </div>
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Name Plo"
                                            placeholder="Enter your name Plo"
                                            value={ploName}
                                            onValueChange={setPloName}

                                        />
                                        <Input
                                            label="Description"
                                            placeholder="Enter your Description"
                                            value={Description}
                                            onValueChange={setDescription}

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
                                                    key={program.program_id}
                                                    value={program.program_id}
                                                >
                                                    {program.program_name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                        
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
                                <div className="w-full h-[1000px] rounded-lg">
                                    <div className=' w-full flex justify-center items-center'>
                                        <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row  lg:flex-col  xl:flex-col  gap-[20px]'>
                                            <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                                <Divider />
                                                <Steps current={current} onChange={setCurrent} items={[
                                                { title: 'Bước 1', description: 'Tải về form' },
                                                { title: 'Bước 2', description: 'Tải lại form' },
                                                { title: 'Bước 3', description: 'Chờ phản hồi' }
                                            ]} />
                                            </div>
                                            <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                                <Divider />
                                                <Steps current={current} onChange={setCurrent} items={[
                                                { title: 'Bước 1', description: 'Tải về form' },
                                                { title: 'Bước 2', description: 'Tải lại form' },
                                                { title: 'Bước 3', description: 'Chờ phản hồi' }
                                            ]} />
                                            </div>

                                            <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                                                    <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Tải Mẫu</p></div>
                                                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadPo}>
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
                                                        <div><p className='w-full text-center'>Lưu Dữ liệu</p></div>
                                                        <CustomUpload endpoint={'plo'} method={'POST'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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

export default CreatePlo;

function Tabs({ tabs, activeTab, setActiveTab }) {

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div>
            <table className="mb-2">
                <tr className="tab-buttons border-collapse border">
                    {tabs.map((tab, index) => (
                        <td>
                            <button
                                key={index}
                                onClick={() => handleTabClick(index)}
                                className={`${index === activeTab ? 'active ' : ''} ${index === activeTab ? 'bg-gray-800 text-white ' : ''} border p-2 px-7`}
                            >
                                {tab.title}
                            </button>
                        </td>
                    ))}
                </tr>
            </table>
            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}