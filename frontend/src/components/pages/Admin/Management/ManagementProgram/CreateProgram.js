import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button, message } from 'antd';
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
    const { setCollapsedNav } = nav;

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
            const data = { programName: nameP, description: convertedContent };
            const response = await axiosAdmin.post('/program', { data });

            if (response.status === 201) {
                message.success('Data saved successfully');
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');;
        }
    };

    const handleDownloadProgram = async () => {
        try {
            const response = await axiosAdmin.get('program/form/excel', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'program.xlsx';
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500">
            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-program/description">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/description") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]" >
                            <div className={` ${isActive("/admin/management-program/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Tạo chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/update">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/update") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Chỉnh sửa
                            </div>
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
                        title: 'Excels',
                        content: (
                            <div className="w-full rounded-lg">
                                <div className='w-full flex justify-center items-center'>
                                    <div className='w-full flex flex-col px-2 sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-row lg:flex-col xl:flex-col gap-[20px]'>
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
                                            <Steps current={current} onChange={setCurrent} direction="vertical" items={[
                                                { title: 'Bước 1', description: 'Tải về form' },
                                                { title: 'Bước 2', description: 'Tải lại form' },
                                                { title: 'Bước 3', description: 'Chờ phản hồi' }
                                            ]} />
                                        </div>
                                        <div className='flex flex-col w-full sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-start items-center'>
                                                <div className='p-10 w-full mt-10 h-fix sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-[#475569] border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <p className='w-full text-center'>Tải Mẫu CSV</p>
                                                    <Button className='w-full bg-primary flex items-center justify-center p-5 rounded-lg' onClick={handleDownloadProgram}>
                                                        Tải xuống mẫu
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
                                                <div className='p-10 w-full mt-10 sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-[#475569] border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                                                    <p className='w-full text-center'>Gửi lại mẫu</p>
                                                    <Upload {...props}>
                                                        <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
                                                    </Upload>
                                                </div>
                                            </div>
                                            <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
                                                <div className='p-10 w-full mt-10 sm:h-fix lg:min-h-[250px] xl:min-h-[250px] border-[#475569] border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
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

function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div>
            <table className="mb-2">
                <tbody>
                    <tr className="tab-buttons border-collapse border-[#020401] border">
                        {tabs.map((tab, index) => (
                            <td key={index}>
                                <button
                                    onClick={() => setActiveTab(index)}
                                    className={`${index === activeTab ? 'active bg-[#475569] text-[#FEFEFE] font-bold' : ' text-[#020401]'} text-base border p-2 px-7`}
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
