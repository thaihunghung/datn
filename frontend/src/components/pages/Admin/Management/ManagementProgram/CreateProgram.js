// CreateProgram.js

import { useEffect, useState } from "react";
import { Input, Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button } from 'antd';
import { Link, useLocation } from "react-router-dom";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const CreateProgram = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { setCollapsedNav, successNoti } = nav;

    const [activeTab, setActiveTab] = useState(0);
    const [nameP, setNameP] = useState("");
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState(null);

    const handleSave = async () => {
        try {
            if (nameP === "") {
                alert("dữ liệu lỗi");
                document.getElementById("name-program").focus();
                return;
            }
            const data = { programName: nameP, description: convertedContent};
            await axiosAdmin.post('/program', { data });
            successNoti && successNoti('Program saved successfully');
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownloadProgram = async () => {
        try {
            const response = await axiosAdmin.get('csv/program', { responseType: 'blob' });
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
            const newFileList = fileList.filter(item => item !== file);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    useEffect(() => {
        if (editorState) {
            let html = convertToHTML(editorState.getCurrentContent());
            setConvertedContent(html);
        }
    }, [editorState]);

    useEffect(() => {
        const handleResize = () => {
            setCollapsedNav(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setCollapsedNav]);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-program/description">
                        <div className={`p-5 min-w-[100px] ${isActive("/admin/management-program/description") ? "bg-slate-600 text-white" : "hover:bg-slate-600 hover:text-white"}`}>
                            Chương trình
                        </div>
                    </Link>
                    <Link to="/admin/management-program/create">
                        <div className={`p-5 ${isActive("/admin/management-program/create") ? "bg-slate-600 text-white" : "hover:bg-slate-600 hover:text-white"}`}>
                            Tạo chương trình
                        </div>
                    </Link>
                    <Link to="/admin/management-program/update">
                        <div className={`p-5 ${isActive("/admin/management-program/update") ? "bg-slate-600 text-white" : "hover:bg-slate-600 hover:text-white"}`}>
                            Chỉnh sửa
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs={[
                    {
                        title: 'Nhập liệu',
                        content: (
                            <div className="w-full rounded-lg">
                                <div className="w-full flex flex-col gap-2">
                                    <Input
                                        label="Name"
                                        placeholder="Enter your name program"
                                        value={nameP}
                                        onValueChange={setNameP}
                                        id="name-program"
                                    />
                                    <span className="font-bold text-left">Mô tả:</span>
                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState}
                                        wrapperClassName="wrapper-class w-full"
                                        editorClassName="editor-class px-5 border w-full"
                                        toolbarClassName="toolbar-class"
                                    />
                                    <div className="w-full flex justify-center items-center">
                                        <Button onClick={handleSave} className="mt-5 px-20 max-w-[300px] text-[#FEFEFE] hover:bg-[#475569] bg-[#AF84DD]">
                                            Tạo
                                        </Button>
                                    </div> 
                                </div>
                            </div>
                        )
                    },
                    {
                        title: 'EXCELs',
                        content: (
                            <div className="w-full rounded-lg">
                                <div className='w-full flex justify-center items-center'>
                                    <div className='w-full flex flex-col px-2 sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row lg:flex-col xl:flex-col gap-[20px]'>
                                        <div className='px-10 hidden sm:hidden lg:block xl:block'>
                                            <Divider />
                                            <Steps current={current} onChange={setCurrent} items={[
                                                { title: 'Bước 1', description: 'This is a description.' },
                                                { title: 'Bước 2', description: 'This is a description.' },
                                                { title: 'Bước 3', description: 'This is a description.' }
                                            ]} />
                                        </div>
                                        <div className='hidden sm:block lg:hidden xl:hidden w-[50%]'>
                                            <Divider />
                                            <Steps current={current} onChange={setCurrent} direction="vertical" items={[
                                                { title: 'Bước 1', description: 'This is a description.' },
                                                { title: 'Bước 2', description: 'This is a description.' },
                                                { title: 'Bước 3', description: 'This is a description.' }
                                            ]} />
                                        </div>
                                        <div className='flex flex-col w-full sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-start items-center'>
                                                <div className='p-10 w-full mt-10 h-fix sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <p className='w-full text-center'>Tải Mẫu CSV</p>
                                                    <Button className='w-full bg-primary flex items-center justify-center p-5 rounded-lg' onClick={handleDownloadProgram}>
                                                        Tải xuống mẫu
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
                                                <div className='p-10 w-full mt-10 sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <p className='w-full text-center'>Gửi lại mẫu</p>
                                                    <Upload {...props}>
                                                        <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
                                                    </Upload>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
                                                <div className='p-10 w-full mt-10 sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <p className='w-full text-center'>Lưu Dữ liệu</p>
                                                    <CustomUpload endpoint={'program'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};

export default CreateProgram;

function ConfirmAction({ isOpen, onOpenChange, onConfirm }) {
    const handleOnOKClick = (onClose) => {
        onClose();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };

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
                },
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Cảnh báo</ModalHeader>
                        <ModalBody>
                            <p className="text-[16px]">
                                Chương trình sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i className="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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
    );
}

function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div>
            <table className="mb-2">
                <tbody>
                    <tr className="tab-buttons border-collapse border">
                        {tabs.map((tab, index) => (
                            <td key={index}>
                                <button
                                    onClick={() => setActiveTab(index)}
                                    className={`${index === activeTab ? 'active bg-[#AF84DD] text-[#FEFEFE] font-bold' : 'text-[#020401]'} text-base border p-2 px-7`}
                                >
                                    {tab.title}
                                </button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
