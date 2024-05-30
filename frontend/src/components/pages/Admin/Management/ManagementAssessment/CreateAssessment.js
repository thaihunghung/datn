// CreateAssessment.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button, Select, message } from 'antd';
import { Upload } from 'antd';
import CustomUpload from "../../CustomUpload/CustomUpload";
import { UploadOutlined } from '@ant-design/icons';

import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import DropdownAndNavGrading from "../../Utils/DropdownAndNav/DropdownAndNavGrading";
import { DatePicker, Space } from "antd";
const CreateAssessment = (nav) => {
    const { setCollapsedNav } = nav;
    const [activeTab, setActiveTab] = useState(0);

    const [description, setDescription] = useState("");
    const [place, setPlace] = useState("");
    const [rubric_id, setRubric_id] = useState();
    const [course_id, setCourse_id] = useState();

    const [DataRubric, setDataRubric] = useState([]);
    const [DataCourse, setCourseByTeacher] = useState([]);

    const [teacher, setTeacherByUser] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const onChangeDate = (date, dateString) => {
        setSelectedDate(dateString);
    };
    const handleDownloadStudent = async () => {
        try {
          
          const data = {
            id: course_id
          }
    
          console.log(data);
          const response = await axiosAdmin.post('/course-enrollment/templates/data', { data: data }, {
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
          }
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };
    const handleSave = async () => {
        try {
            const data = {
                course_id: course_id,
                rubric_id: rubric_id,
                description: description,
                place: place,
                date: selectedDate
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
    const getByUser = async () => {
        try {
            const response = await axiosAdmin.get(`/teacher/getByUser/${2}`);
            if (response.data) {
                setTeacherByUser(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.error("Error fetching teacher:", error);
            message.error('Error fetching teacher');
        }
    }

    const getCourseByTeacher = async (teacher) => {
        try {
            const response = await axiosAdmin.get(`/course/getByTeacher/${teacher}`);
            if (response.data) {
                setCourseByTeacher(response.data.course);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            message.error('Error fetching course');
        }
    }

    const getRubricBySubject = async (idSubject) => {
        try {
            const response = await axiosAdmin.get(`/rubric/getBySubject/${idSubject}`);

            setDataRubric(response.data);
        } catch (error) {
            console.error("Error fetching Rubric:", error);
            message.error('Error fetching Rubric');
        }
    }
    //id_teacher nhận trên cookie id_teacher =2
    useEffect(() => {
        getByUser()
        getCourseByTeacher(2)
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


    useEffect(() => {
        if (course_id) {
            const foundCourse = DataCourse.find(course => course.course_id === course_id);
            if (foundCourse) {

                getRubricBySubject(foundCourse.subject_id)
                // console.log("tìm thấy course với subject_id:", foundCourse.subject_id);
            } else {
                // console.log("Không tìm thấy course với course_id");
            }
        }
    }, [course_id]);
    const [fileList, setFileList] = useState([]);

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



    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <DropdownAndNavGrading />
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Tạo mới',
                            content:
                                <div className="w-full rounded-lg border flex flex-col sm:flex-col lg:flex-col xl:flex-col justify-center items-center">
                                    <div className="flex-1 p-5 flex flex-col gap-2">
                                        <Select
                                            defaultValue={"Chọn Course"}
                                            value={course_id}
                                            onChange={setCourse_id}
                                            size="large"
                                            className="w-full"
                                        >
                                            {DataCourse.map((Course) => (
                                                <Select.Option
                                                    key={Course.course_id}
                                                    value={Course.course_id}
                                                >
                                                    {Course.course_id}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                        <Button onClick={handleDownloadStudent} disabled={!course_id}>Download</Button>
                                        <Select
                                            defaultValue={"Chọn Rubric"}
                                            value={rubric_id}
                                            onChange={setRubric_id}
                                            size="large"
                                            className="w-full"
                                        >
                                            {DataRubric.map((Rubric) => (
                                                <Select.Option
                                                    key={Rubric.rubric_id}
                                                    value={Rubric.rubric_id}
                                                >
                                                    {Rubric.rubricName}
                                                </Select.Option>
                                            ))}
                                        </Select>

                                        <Input
                                            label="Description"
                                            placeholder="Enter your Description"
                                            value={description}
                                            onValueChange={setDescription}

                                        />
                                        <Input
                                            label="place"
                                            placeholder="Enter your place"
                                            value={place}
                                            onValueChange={setPlace}

                                        />

                                        <Space direction="vertical">
                                            <DatePicker
                                                className="w-[400px] h-[42px] mt-1"
                                                onChange={onChangeDate}
                                            />
                                        </Space>


                                        <div className="w-full flex justify-center items-center">
                                            <Button color="primary" onClick={handleSave} className="max-w-[300px] mt-5 px-20">
                                                Tạo
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col gap-2">
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
                                                <CustomUpload endpoint={'/assessment'} method={'POST'} Data={
                                                    {
                                                        course_id: course_id,
                                                        rubric_id: rubric_id,
                                                        description: description,
                                                        place: place,
                                                        date: selectedDate
                                                    }
                                                } fileList={fileList} setFileList={setFileList} />
                                            </div>
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


export default CreateAssessment;
