// CreateClo.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button, Select, message, Tooltip } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import { Link, useLocation, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const CreateClo = (nav) => {
    const { setCollapsedNav } = nav;
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id } = useParams();
    const [fileList, setFileList] = useState([]);

    const [activeTab, setActiveTab] = useState(0);


    const [cloName, setcloName] = useState("");
    const [Description, setDescription] = useState("");
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
    const [selectedItem, setSelectedItem] = useState("list");

    const handleAction = (key) => {
        setSelectedItem(key);
        // Add any additional logic you may have here
    };
    const handleSave = async () => {
        try {
            const data = {
                subject_id: id,
                cloName: cloName,
                description: Description,
            }

            const response = await axiosAdmin.post('/clo', { data: data });
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

    const handleDownloadPo = async () => {
        try {
            const response = await axiosAdmin.get('/clo/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'clo.xlsx';
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
        const initialSelectedItem = items.find(item => isActive(item.path));
            if (initialSelectedItem) {
                setSelectedItem(initialSelectedItem.key);
            }
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
<div className="flex justify-between px-5 w-full items-center">
                <div className="flex gap-2 justify-center items-center lg:hidden xl:hidden">
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
                            <div className="p-5">
                                <i class="fa-solid fa-arrow-left text-xl"></i>
                            </div>
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
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Name Clo"
                                            placeholder="Enter your name Clo"
                                            value={cloName}
                                            onValueChange={setcloName}

                                        />
                                        <Input
                                            label="Description"
                                            placeholder="Enter your Description"
                                            value={Description}
                                            onValueChange={setDescription}

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
                                                        <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
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
                                                        <CustomUpload endpoint={'clo'} method={'POST'} Data={parseInt(id)} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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


export default CreateClo;

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