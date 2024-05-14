// CreateProgram.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button } from 'antd';
import { Link } from "react-router-dom";

import {
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const CreateProgram = (nav) => {
    const { setCollapsedNav, successNoti} = nav;

    const [activeTab, setActiveTab] = useState(0);
    const [nameP, setNameP] = useState("");

    const handleSave = async () => {
        try {
            if(nameP==="") {
                alert("dữ liệu lỗi")
                document.getElementById("name-program").focus();
                return;
            }
            const data = {
                programName: nameP
            }
            await axiosAdmin.post('/program',{data: data});
        } catch (error) {
            console.log(error);
        }
    }
    const [current, setCurrent] = useState(0);
    const onChangexxx = (nameP) => {

        setCurrent(nameP);
    };

    const [fileList, setFileList] = useState([]);

    const handleDownloadProgram = async () => {
        try {
            const response = await axiosAdmin.get('csv/program', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'program.csv';
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

    const description = 'This is a description.';
    useEffect(() => {
        //allProgramIsDelete()
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <div>
                 <div className="w-fit flex border justify-start text-base font-bold rounded-lg bg-[#ff8077]">
                    <Link to={"/admin/management-program"}>
                        <div className="p-5 min-w-[100px] hover:bg-slate-600 hover:text-white">
                            Chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/management-po"}>
                        <div className="p-5 min-w-[100px] hover:bg-slate-600 hover:text-white">
                            PO
                        </div>
                    </Link>
                    <Link to={"/admin/management-plo"}>
                        <div className="p-5 min-w-[100px] hover:bg-slate-600 hover:text-white">
                            PLO
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/po-plo"}>
                        <div className="p-5 min-w-[100px] hover:bg-slate-600 hover:text-white">
                            PO-PLO
                        </div>
                    </Link>


                    {/* <Link to={"/admin/management-program/store"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Kho lưu trữ
                        </div>
                    </Link> */}



                    {/* <Link to={"/admin/management-program/create"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Tạo chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/update"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                        update
                        </div>
                    </Link>
                     */}
                </div>
            </div>
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'DS Chương trình',
                            content:
                                <div className="w-full rounded-lg">
                                    <div className="w-full flex flex-col gap-2 max-w-[240px]">
                                        <Input
                                            label="Name"
                                            placeholder="Enter your name program"
                                            value={nameP}
                                            onValueChange={setNameP}
                                            id="name-program"
                                        />
                                         <Button color="primary" onClick={handleSave} className="mt-5 px-20">
                                                Tạo
                                        </Button>

                                    </div>
                                </div>
                        },
                        {
                            title: 'Nhập liệu form',
                            content:
                                <div className="w-full rounded-lg">
                                    <div className=' w-full flex justify-center items-center'>
                                        <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row  lg:flex-col  xl:flex-col  gap-[20px]'>
                                            <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                                <Divider />
                                                <Steps
                                                    current={current}
                                                    onChange={onChangexxx}
                                                    items={[
                                                        {
                                                            title: 'Bước 1',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 2',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 3',
                                                            description,
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                                <Divider />
                                                <Steps
                                                    current={current}
                                                    onChange={onChangexxx}
                                                    direction="vertical"

                                                    items={[
                                                        {
                                                            title: 'Bước 1',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 2',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 3',
                                                            description,
                                                        },
                                                    ]}
                                                />
                                            </div>

                                            <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                                                    <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
                                                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadProgram}>
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
                                                        <CustomUpload endpoint={'program'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        },
                        {
                            title: 'Nhập liệu EXCELs',
                            content:
                                <div className="w-full rounded-lg">
                                    <div className=' w-full flex justify-center items-center'>
                                        <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row  lg:flex-col  xl:flex-col  gap-[20px]'>
                                            <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                                <Divider />
                                                <Steps
                                                    current={current}
                                                    onChange={onChangexxx}
                                                    items={[
                                                        {
                                                            title: 'Bước 1',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 2',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 3',
                                                            description,
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                                <Divider />
                                                <Steps
                                                    current={current}
                                                    onChange={onChangexxx}
                                                    direction="vertical"

                                                    items={[
                                                        {
                                                            title: 'Bước 1',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 2',
                                                            description,
                                                        },
                                                        {
                                                            title: 'bước 3',
                                                            description,
                                                        },
                                                    ]}
                                                />
                                            </div>

                                            <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                                                    <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                                                        <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
                                                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadProgram}>
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
                                                        <CustomUpload endpoint={'program'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        },
                        {
                            title: 'Cập nhật',
                            content:
                                <div className="w-full rounded-lg">
                                   
                                </div>
                        },
                        {
                            title: 'Kho lưu trữ',
                            content:
                                <div className="w-full rounded-lg">
                                   
                                </div>
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}


export default CreateProgram;
function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
    const handleOnOKClick = (onClose) => {
        onClose();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Cảnh báo</ModalHeader>
                        <ModalBody>
                            <p className="text-[16px]">
                                Chương trình sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Huỷ
                            </Button>
                            <Button color="danger" className="font-medium" onPress={() => handleOnOKClick(onClose)}>
                                Xoá
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
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