// CreateStudent.js
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button, Select } from 'antd';
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

const CreateStudent = (nav) => {
  const { setCollapsedNav, successNoti } = nav;

  const [activeTab, setActiveTab] = useState(0);
  // const [name, setname] = useState("");
  const [studentCode, setStudentCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [current, setCurrent] = useState(0);
  const MAX_COUNT = 1;
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const handleSave = async () => {
    try {
      if (name === "") {
        alert("dữ liệu lỗi")
        document.getElementById("name-student").focus();
        return;
      }
      const data = {
        class_id: selectedClass,
        studentCode: studentCode,
        name: name,
        email: email
      }

      console.log("datta: ", data);
      await axiosAdmin.post('/student', { data: data });
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetAllCodeClass = async () => {
    try {
      const response = await axiosAdmin.get('/class');
      const options = response.data.map(classItem => ({
        value: `${classItem.class_id.toString()}-${classItem.classCode}`,
        label: classItem.classCode
      }));
      setClassOptions(options);
      console.log(classOptions);
    } catch (error) {
      console.error('Lỗi khi get dữ liệu:', error);
    }
  };

  const handleClassChange = (value) => {
    const classId = parseInt(value.toString().charAt(0));
    setSelectedClass(classId)
  };

  const onChangexxx = (name) => {
    setCurrent(name);
  };

  const [fileList, setFileList] = useState([]);

  const handleDownloadStudent = async () => {
    try {
      const response = await axiosAdmin.get('/student/templates/post', {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student.xlsx';
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
    handleGetAllCodeClass()

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
        <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
          <Link to={"/admin/student"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              DS Sinh viên
            </div>
          </Link>
          <Link to={"/admin/student/store"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              Kho lưu trữ
            </div>
          </Link>
          <Link to={"/admin/student/create"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              Thêm sinh viên
            </div>
          </Link>
          <Link to={"/admin/student/update"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              Cập nhật
            </div>
          </Link>
          {/* <Link to={"/admin/student/po-plo"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              PO-PLO
            </div>
          </Link> */}
        </div>
      </div>
      <div className="w-full mt-5 rounded-lg">
        <Tabs tabs=
          {[
            {
              title: 'Nhập liệu bằng form',
              content:
                <div className="w-full h-[1000px] rounded-lg border">
                  <div className="w-full flex flex-col gap-2 max-w-[400px]">
                    <Select
                      mode="multiple"
                      maxCount={MAX_COUNT}
                      style={{ width: '100%' }}
                      placeholder="Chọn mã lớp"
                      onChange={(e) => handleClassChange(e)}
                      options={classOptions}
                    />
                    <Input
                      clearable
                      label="Student Code"
                      placeholder="Enter student code"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      id="student-code"
                    />
                    <Input
                      clearable
                      label="Email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="student-email"
                    />
                    <Input
                      clearable
                      label="Name"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="student-name"
                    />

                    <Button color="primary" onClick={handleSave} className="mt-5 px-20">
                      Save
                    </Button>

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
                            <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadStudent}>
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
                            <CustomUpload endpoint={'student'} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
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


export default CreateStudent;

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