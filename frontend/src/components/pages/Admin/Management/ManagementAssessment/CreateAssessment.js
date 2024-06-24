// CreateAssessment.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Select, message } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import DropdownAndNavGrading from "../../Utils/DropdownAndNav/DropdownAndNavGrading";
import { DatePicker, Space } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";

const CreateAssessment = (nav) => {
    const { setCollapsedNav } = nav;
    const [activeTab, setActiveTab] = useState(0);
    const [current, setCurrent] = useState(0);

    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };
    const [description, setDescription] = useState("");
    const [place, setPlace] = useState("");
    const [rubric_id, setRubric_id] = useState();
    const [course_id, setCourse_id] = useState();
    const [courseName, setCourseName] = useState("");


    const [DataRubric, setDataRubric] = useState([]);
    const [filterRubicData, setfilterRubicData] = useState([]);

    const [RubicDataCompe, setRubicDataCompe] = useState([]);

    
    const [defaultRubric, setDefaultRubric] = useState("Chọn Rubric");

    const [DataCourse, setCourseByTeacher] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const onChangeDate = (date, dateString) => {
        setSelectedDate(dateString);
    };

    const handleCourseChange = (value, option) => {
        const selectedCourse = DataCourse.find(course => course.course_id === value);
        if (selectedCourse) {
            setCourse_id(selectedCourse.course_id);
            setCourseName(selectedCourse.courseCode + "_" + selectedCourse.courseName)
            getRubricBySubject(selectedCourse.subject_id);
            setRubric_id(null);
        }
    };

    const getRubricBySubject = async (idSubject) => {
        try {
            const response = await axiosAdmin.get(`/subject/${idSubject}/rubrics/teacher/${teacher_id}`);
            if (response.data) {
                //console.log(response.data);
                setDataRubric(response.data);
            }
           
        } catch (error) {
            console.error("Error fetching Rubric:", error);
        }
    }

    useEffect(() => {
        const filteredData = filterRubicData.filter(filterItem =>
            DataRubric.some(dataItem => dataItem.rubric_id === filterItem.rubric_id)
        );
        setRubicDataCompe(filteredData);
        setDefaultRubric('Chọn Rubric');
        console.log("Filtered Data:", filteredData);
    }, [DataRubric, filterRubicData]);

    const handleDownloadStudent = async () => {
        try {
            const data = {
                id: course_id
            }
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

    //id_teacher nhận trên cookie id_teacher =2
    useEffect(() => {
        const getAllRubricIsDeleteFalse = async () => {
            try {
                const response = await axiosAdmin.get(`/rubrics/teacher/${teacher_id}/checkscore`);
                const updatedRubricData = response.data.rubric.map((rubric) => {
                    const status = {
                        status: rubric.RubricItem.length === 0 ? false : true,
                        _id: rubric.rubric_id
                    };
                    return {
                        rubric_id: rubric.rubric_id,
                        rubricName: rubric.rubricName,
                        status: status,
                        point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
                        action: rubric.rubric_id
                    };
                });
                setfilterRubicData(updatedRubricData);
                console.log(updatedRubricData);
            } catch (error) {
                console.error("Error: " + error.message);
                message.error('Error fetching Rubric data');
            }
        };
    
        const getCourseByTeacher = async () => {
            try {
                const response = await axiosAdmin.get(`/course/getByTeacher/${teacher_id}`);
                console.log(response.data.course);
                if (response.data) {
                    setCourseByTeacher(response.data.course);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                message.error('Error fetching course');
            }
        };
    
        getCourseByTeacher();
        getAllRubricIsDeleteFalse();
    
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
    }, [setCollapsedNav, teacher_id]);
    

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
    const itemStep = [
        { title: 'Bước 1', description: 'Lấy tất cả sinh viên' },
        { title: 'Bước 2', description: 'Tải lại sinh viên' },
        { title: 'Bước 3', description: 'Tạo lần chấm' }
    ]
    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">

            <DropdownAndNavGrading />
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Tạo mới',
                            content:
                                <div className="w-full rounded-lg border flex flex-col sm:flex-col lg:flex-col xl:flex-col justify-center items-center">
                                    <div className="w-full p-5 flex flex-col gap-5">
                                        <div className="w-full flex flex-col sm:flex-col lg:flex-row xl:flex-row justify-center gap-5">
                                            <Select
                                                defaultValue={"Chọn Course"}
                                                value={course_id}
                                                onChange={handleCourseChange}
                                                size="large"
                                                className="w-full"
                                            >
                                                {DataCourse.map((Course) => (
                                                    <Select.Option
                                                        key={Course.course_id}
                                                        value={Course.course_id}
                                                    >
                                                                                                               
                                                        {Course.courseCode}{' - '}{Course.courseName}
                                                    </Select.Option>
                                                ))}
                                            </Select>

                                            <Select
                                                defaultValue={defaultRubric}
                                                value={rubric_id}
                                                onChange={setRubric_id}
                                                size="large"
                                                className="w-full"
                                            >
                                                {RubicDataCompe.map((Rubric) => (
                                                    <Select.Option
                                                        key={Rubric.rubric_id}
                                                        value={Rubric.rubric_id}
                                                        disabled={Rubric?.status?.status===false}
                                                    >
                                                        {Rubric.rubricName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            </div>


                                        <div className="flex flex-col gap-5">
                                            <div className="w-full flex flex-col sm:flex-col lg:flex-row xl:flex-row justify-center gap-5">
                                            <Input
                                                label="Description"
                                                placeholder="Báo cáo kết thúc môn lần thứ"

                                                value={description}
                                                onValueChange={setDescription}

                                            />
                                            <Input
                                                label="place"
                                                placeholder="Enter your place"
                                                value={place}
                                                onValueChange={setPlace}

                                            />
                                            </div>
                                            <div className="w-full">
                                            <div className="w-full text-left">
                                                <span className="font-bold">Chọn ngày đánh giá:</span>
                                            </div>
                                            <div className="w-full flex justify-start items-center">
                                            <Space direction="vertical">
                                                <DatePicker
                                                    className="w-full sm:min-w-[350px] lg:min-w-[400px] xl:min-w-[400px]  h-[42px] mt-1"
                                                    onChange={onChangeDate}
                                                />
                                            </Space>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <DownloadAndUpload endpoint={'/assessment'} method={'POST'}
                                        props={props}
                                        itemStep={itemStep}
                                        Data={
                                            {
                                                teacher_id: teacher_id,
                                                course_id: course_id,
                                                rubric_id: rubric_id,
                                                description: description,
                                                courseName: courseName,
                                                place: place,
                                                date: selectedDate
                                            }
                                        }
                                        fileList={fileList} setFileList={setFileList}
                                        handleDownload={handleDownloadStudent}
                                        handleOnChangeTextName={handleOnChangeTextName}
                                        current={current}
                                        setCurrent={setCurrent}
                                        disabled={!course_id}
                                    />
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
