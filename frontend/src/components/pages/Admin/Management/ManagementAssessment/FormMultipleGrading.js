import React, { useEffect, useState } from "react";

import { Table, Tooltip, Button, message } from 'antd';
import { Select } from "antd";


import { Collapse } from 'antd';
import { Slider } from "@nextui-org/react";

import "./FormGrading.css"
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import RubricSlider from "../../Utils/RubricSlider/RubricSlider";

const FormMultipleGrading = (nav) => {

  const { setCollapsedNav } = nav;
  const { Option } = Select;
  const [selectedValues1, setSelectedValues1] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [selectedValues4, setSelectedValues4] = useState([]);

  const [RubicData, setRubicData] = useState([]);
  const [RubicItemsData, setRubicItemsData] = useState([]);
  const [totalScore1, setTotalScore1] = useState(0);
  const [totalScore2, setTotalScore2] = useState(0);
  const [totalScore3, setTotalScore3] = useState(0);
  const [totalScore4, setTotalScore4] = useState(0);


  const [Check1, setCheck1] = useState(0);
  const [Check2, setCheck2] = useState(0);
  const [Check3, setCheck3] = useState(0);
  const [Check4, setCheck4] = useState(0);


  const [defaultValue, setdefaultValue] = useState(0);

  const [ListStudentOJ, setListStudentOJ] = useState([]);
  const [Assessment, setAssessment] = useState([]);


  const { assessment_id, description, rubric_id, couse_id } = useParams();
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');

  if (!teacher_id) {
    navigate('/login');
  }
  const location = useLocation();


  const searchParams = new URLSearchParams(location.search);
  const studentCodesString = searchParams.getAll('student-code');

  let studentCodes = [];
  let listStudentCodes = [];
  if (studentCodesString) {
    try {
      const studentCodes = JSON.parse(decodeURIComponent(studentCodesString));
      listStudentCodes = studentCodes.map((key) => key.studentCode);
      //console.log(listStudentCodes)
    } catch (error) {
      console.error('Error parsing student codes:', error);
    }
  }
  // Assessment: key,
  // studentCode: item.student.studentCode  
  // console.log(studentCodes);
  // const DataScore = [
  //   { key: '1', Score: 0.25 },
  //   { key: '2', Score: 0.5 },
  //   { key: '3', Score: 0.75 },
  //   { key: '4', Score: 1 },
  //   { key: '4', Score: 1.25 },
  //   { key: '4', Score: 1.5 },
  //   { key: '4', Score: 1.75 },
  //   { key: '4', Score: 2 },
  // ];

  const [Student, setStudent] = useState(listStudentCodes);

  const handleStudentChange = (value, option) => {
    if (value.length > 4) {
      message.warning('You can only select up to 4 student.');
      return;
    }
    //console.log('value');
    setStudent(value);
  };
  const handleSliderChange1 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues1(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
        rubricsItem_id: rubricsItem_id,
        maxScore: value,
        CheckGrading: true,
      };

      const newTotalScore = updatedValues.reduce((acc, curr) => {
        if (curr && typeof curr.maxScore === 'number') {
          return acc + curr.maxScore;
        }
        return acc;
      }, 0);

      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      setCheck1(Check)
      setTotalScore1(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange2 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues2(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
        rubricsItem_id: rubricsItem_id,
        maxScore: value,
        CheckGrading: true,
      };

      const newTotalScore = updatedValues.reduce((acc, curr) => {
        if (curr && typeof curr.maxScore === 'number') {
          return acc + curr.maxScore;
        }
        return acc;
      }, 0);

      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      setCheck2(Check)
      setTotalScore2(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange3 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues3(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
        rubricsItem_id: rubricsItem_id,
        maxScore: value,
        CheckGrading: true,
      };

      const newTotalScore = updatedValues.reduce((acc, curr) => {
        if (curr && typeof curr.maxScore === 'number') {
          return acc + curr.maxScore;
        }
        return acc;
      }, 0);

      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      setCheck3(Check)
      setTotalScore3(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange4 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues4(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
        rubricsItem_id: rubricsItem_id,
        maxScore: value,
        CheckGrading: true,
      };

      const newTotalScore = updatedValues.reduce((acc, curr) => {
        if (curr && typeof curr.maxScore === 'number') {
          return acc + curr.maxScore;
        }
        return acc;
      }, 0);

      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      setCheck4(Check)
      setTotalScore4(newTotalScore);
      return updatedValues;
    });
  };

  const updateSelectedValues = (studentIds, selectedValues, assessments) => {
    return selectedValues.map(item => {
      const matchingAssessment = assessments.find(assessment => assessment.student_id === studentIds);

      if (matchingAssessment) {
        const { assessment_id, totalScore } = matchingAssessment;
        const { maxScore, student_id, CheckGrading, ...rest } = item;
        return {
          ...rest,
          assessment_id: assessment_id,
          CheckSave: totalScore === 0,
          assessmentScore: maxScore
        };
      }
      return item;
    });
  };

  const CheckSave = (items) => {
    for (const [itemIndex, item] of items.entries()) {
      for (const [entryIndex, entry] of item.entries()) {
        if (!entry.CheckSave) {
          message.error(`Lưu không thành công do SV${itemIndex + 1}, đã được chấm`);
          return false;
        }
      }
    }
    return true;
  }
  const Save = async (dataSaveAssessment, Score) => {
    try {
      const data = { totalScore: Score }

      await axiosAdmin.put(`/assessment/${dataSaveAssessment[0].assessment_id}/updateStotalScore`, { data: data })

      const dataAssessmentItem = dataSaveAssessment.map(item => {
        const { CheckSave, ...rest } = item;
        return {
          ...rest,
        };
      });

      const response = await axiosAdmin.post(`/assessment-item`, { data: dataAssessmentItem })
      if (response.status === 201) {
        message.success('Data saved successfully');
      }
    } catch (e) {
      console.error(e);
      message.error('Error saving data');
    }
  }

  const handleLogicSave = async () => {
    const checkStudent = (selectedValues, studentIndex) => {
      let count = 0;
      const studentIds = [];

      for (let i = 0; i < selectedValues.length; i++) {
        const item = selectedValues[i];
        if (item.hasOwnProperty('student_id')) {
          //console.log(`Đối tượng có thuộc tính student_id:`, item);
          count++;
          studentIds.push(item.student_id); // Extracting student_id
          break; // Exit loop early
        } else {
          //console.log(`Đối tượng không có thuộc tính student_id:`, item);
        }
      }

      if (count === 0) {
        message.error(`Chưa chấm điểm cho SV${studentIndex}`);
        return { valid: false, studentIds: [] };
      }
      return { valid: true, studentIds };
    };

    let allStudentIds = [];

    switch (Student.length) {
      case 1:
        {
          const result = checkStudent(selectedValues1, 1);
          if (!result.valid) return;

          const findAssessment1 = updateSelectedValues(result.studentIds[0], selectedValues1, Assessment)


          const items = [findAssessment1]
          const check = CheckSave(items)
          console.log(items)
          if (check) {
            Save(findAssessment1, totalScore1) 
          }
        }
        break;
      case 2:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          if (!result1.valid) return;

          if (!result2.valid) return;

          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)

          const items = [findAssessment1, findAssessment2]
          const check = CheckSave(items)
          console.log(items)
          if (check) {
            Save(findAssessment1, totalScore1)
            Save(findAssessment2, totalScore2)
          }
        }
        break;
      case 3:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          const result3 = checkStudent(selectedValues3, 3);
          if (!result1.valid) return;

          if (!result2.valid) return;

          if (!result3.valid) return;

          // console.log("Assessment",Assessment);
          // console.log("student_id",result1.studentIds[0]);
          // console.log("selectedValues1",selectedValues1);

          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)
          const findAssessment3 = updateSelectedValues(result3.studentIds[0], selectedValues3, Assessment)

          const items = [findAssessment1, findAssessment2, findAssessment3]
          const check = CheckSave(items)
          console.log(items)
          if (check) {
            Save(findAssessment1, totalScore1)
            Save(findAssessment2, totalScore2)
            Save(findAssessment3, totalScore3)
          }

          //

          // const test2 =updateSelectedValues(result2.studentIds, selectedValues2, Assessment)
          // const test3 =updateSelectedValues(result3.studentIds, selectedValues3, Assessment)


          // allStudentIds = [test1, test2, test3]
          // allStudentIds = [...result1.studentIds, ...result2.studentIds, ...result3.studentIds];
        }
        break;
      case 4:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          const result3 = checkStudent(selectedValues3, 3);
          const result4 = checkStudent(selectedValues4, 4);
          if (!result1.valid) return;

          if (!result2.valid) return;

          if (!result3.valid) return;

          if (!result4.valid) return;

          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)
          const findAssessment3 = updateSelectedValues(result3.studentIds[0], selectedValues3, Assessment)
          const findAssessment4 = updateSelectedValues(result4.studentIds[0], selectedValues4, Assessment)


          const items = [findAssessment1, findAssessment2, findAssessment3, findAssessment4]
          const check = CheckSave(items)
          console.log(items)
          if (check) {
            Save(findAssessment1, totalScore1)
            Save(findAssessment2, totalScore2)
            Save(findAssessment3, totalScore3)
            Save(findAssessment4, totalScore4)
          }
        }
        break;
      default:
        message.error('Số lượng sinh viên không hợp lệ');
        return;
    }
  };


  const setValue1 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues1(updatedPoData);
  }
  const setValue2 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues2(updatedPoData);
  }
  const setValue3 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues3(updatedPoData);
  }
  const setValue4 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        // assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues4(updatedPoData);
  }

  const GetRubricData = async () => {
    try {
      const response = await axiosAdmin.get(`/rubric/${rubric_id}/items/isDelete/false`);
      //console.log(response.data);
      setRubicData(response.data.rubric)
      setRubicItemsData(response.data.rubric.rubricItems)
      const data = response.data.rubric.rubricItems
      setValue1(data)
      setValue2(data)
      setValue3(data)
      setValue4(data)
    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  const GetAssesmentByDicriptions = async () => {
    // try {
    //   const response = await axiosAdmin.get(`/course-enrollment/${couse_id}`);
    //   console.log("response?.data");
    //   console.log(response?.data);
    //   if (response?.data) {
    //     setStudentData(response?.data);
    //   }

    // } catch (error) {
    //   console.error('Error fetching student data:', error);
    //   throw error;
    // }
    try {
      const response = await axiosAdmin.get(`/assessments/${description}/teacher/${teacher_id}`);
      if (response.data) {
        setAssessment(response?.data);
      }
      console.log("assessments");
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  const getStudentBySelect = (data, studentCode) => {
    for (let item of data) {
      if (item.Student && item.Student.studentCode === studentCode) {
        // Trả về đối tượng Student của item này nếu trùng khớp
        return item.Student;
      }
    }
    return null;
  };

  useEffect(() => {
    if (Student) {
      //console.log("Student:", Student); // Array of student codes

      // Map student codes to student IDs from StudentData
      const listStudentIds = Student.map(code => getStudentBySelect(Assessment, code));
      setListStudentOJ(listStudentIds)
      //console.log("Student:", listStudentIds)
      GetRubricData()
      setTotalScore1(0)
      setTotalScore2(0)
      setTotalScore3(0)
      setTotalScore4(0)
      //console.log("List of Student IDs:", listStudentIds);
    }
  }, [Student, Assessment]);



  useEffect(() => {
    if (setCheck1 === 0) {
      setTotalScore1(0);
      setdefaultValue(0);
    }
    if (setCheck2 === 0) {
      setTotalScore2(0);
      setdefaultValue(0);
    }
    if (setCheck3 === 0) {
      setTotalScore1(0);
      setdefaultValue(0);
    }
    if (setCheck4 === 0) {
      setTotalScore2(0);
      setdefaultValue(0);
    }

    GetAssesmentByDicriptions()
    GetRubricData();

    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    setTimeout(() => {
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(setTimeout); // Clean up the timeout on component unmount
    };
  }, []);

  return (
    <div className="w-full p-2 pb-[100px] py-0 flex flex-col leading-6 mt-10">

      <div className='text-left w-full font-bold'>Chọn sinh viên</div>
      <Select
        mode="multiple"
        value={Student}
        onChange={handleStudentChange}
        size="large"
        className=" max-w-[600px] w-full my-2 bg-[white]"
      >
        {Assessment.map((Student) => (
          <Select.Option
            key={Student?.Student?.student_id}
            value={Student?.Student?.studentCode}
            disabled={Student?.totalScore > 0}
          >
            <span className="p-2">{Student?.Student?.studentCode}{" - "}{Student?.Student?.name}</span>

          </Select.Option>
        ))}
      </Select>

      <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-fit p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
        <p className="text-sm font-medium">
          <div className="flex justify-center items-center">
            <div> <i className="fa-solid fa-circle-check mr-3 text-emerald-500 "></i>
            </div>
            <div className="flex justify-center items-center gap-1 flex-col sm:flex-row lg:flex-row xl:flex-row">
              {
                ListStudentOJ.length === 0 && (
                  <span className="mr-2"></span>
                )
              }
              {
                ListStudentOJ.length === 1 && (
                  <span className="mr-2">SV1: {' ' + totalScore1} </span>
                )
              }
              {
                ListStudentOJ.length === 2 && (
                  <>
                    <span className="mr-2">SV1: {' ' + totalScore1} </span>
                    <span className="mr-2">SV2: {' ' + totalScore2} </span>
                  </>
                )
              }
              {
                ListStudentOJ.length === 3 && (
                  <>
                    <span className="mr-2">SV1: {' ' + totalScore1} </span>
                    <span className="mr-2">SV2: {' ' + totalScore2} </span>
                    <span className="mr-2">SV3: {' ' + totalScore3} </span>
                  </>
                )
              }
              {
                ListStudentOJ.length === 4 && (
                  <>
                    <span className="mr-2">SV1: {' ' + totalScore1} </span>
                    <span className="mr-2">SV2: {' ' + totalScore2} </span>
                    <span className="mr-2">SV3: {' ' + totalScore3} </span>
                    <span className="mr-2">SV4: {' ' + totalScore4} </span>
                  </>
                )
              }
              {/* Tiêu chí: {Check1}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check2}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check3}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check4}/{RubicItemsData.length} */}

            </div>
          </div>


        </p>
        <div className="flex items-center gap-2 ml-5">
          <Tooltip
            title={Student.length === 0 ? 'Vui lòng chọn sinh viên' : 'Lưu'}
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              onClick={() => {
                handleLogicSave();
              }}
              disabled={Student.length === 0}
            >
              <i className="fa-solid fa-floppy-disk text-[18px] "></i>
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full flex flex-col p-2 py-0 mb-2  sm:p-5 sm:mb-2 sm:py-0 sm:flex-col lg:flex-row lg:mb-0 xl:flex-row xl:mb-0">
        <div className="w-full text-justify lg:w-[55%] xl:w-[60%]   flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full hidden p-2 bg-[#475569] sm:hidden lg:w-[100px] lg:block xl:w-[100px] xl:block">
            <p className=" text-[#fefefe] text-center font-bold">PLO</p>
          </div>
          <div className="w-full hidden p-2 bg-[#475569] sm:hidden lg:w-[100px] lg:block xl:w-[100px] xl:block">
            <p className=" text-[#fefefe] text-center font-bold">CĐR</p>
          </div>
          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2 bg-[#475569]">
            <p className="text-center font-bold hidden sm:hidden lg:block xl:block text-[#fefefe] p-5 sm:p-5 lg:p-0 xl:p-0">Tiêu chí</p>
            <p className="text-center font-bold block sm:block lg:hidden xl:hidden text-[#fefefe] p-5 sm:p-5 lg:p-0 xl:p-0">Chấm điểm</p>
          </div>
        </div>
        <div className="hidden w-full bg-[#475569] sm:hidden lg:w-[45%]   lg:block xl:block xl:w-[40%] text-justify p-5 pb-0 pt-2">
          <p className="text-center font-bold  text-[#fefefe]">Điểm đạt</p>
        </div>
      </div>
      {
        RubicItemsData.map((item, i) => (
          <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row" key={item.rubricsItem_id}>
            {/* Left Side */}
            <div className="w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none text-justify lg:w-[55%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-[#ff8077] flex flex-col sm:flex-col lg:flex-row xl:flex-row">
              <div className="w-full hidden sm:hidden lg:block xl:block p-2 lg:w-[100px] xl:w-[100px] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#ff8077]">

                <div className="flex justify-center items-center h-full w-full p-2">
                  <div className="text-center font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                    <Tooltip content={item.PLO.description}>{item.PLO.ploName}</Tooltip>
                  </div>
                </div>

              </div>
              <div className="w-full p-2 lg:w-[100px] xl:w-[100px] border-b-1 
              sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] 
              lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#ff8077]
              flex justify-center items-center
              ">
                <div className="hidden sm:block lg:block xl:block flex-1 p-2">
                  <div className="text-center font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                    <Tooltip content={item.CLO.description}>{item.CLO.cloName}</Tooltip>
                  </div>
                </div>
                <div className="hidden sm:block lg:hidden xl:hidden flex-1">
                  <div className="text-center font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                    <Tooltip content={item.PLO.description}>{item.PLO.ploName}</Tooltip>
                  </div>
                </div>

              </div>
              <div className="w-full">
                <div className="flex flex-col hidden sm:hidden lg:block xl:block text-justify leading-8 p-4" dangerouslySetInnerHTML={{ __html: item.description }} />
                <div className="block sm:block lg:hidden xl:hidden">
                  <Collapse
                    items={[
                      {
                        key: '1',
                        label: <p className="text-justify text-base">Tiêu chí</p>,
                        children: (
                          <div className="text-justify leading-8 flex flex-col  p-2 px-5 sm:p-2 sm:px-5 lg:p-5 xl:p-5" dangerouslySetInnerHTML={{ __html: item.description }} />
                        )
                      }
                    ]}
                    colorBorder="#FFD700"
                    className="Collapse"
                    defaultActiveKey={['1']}
                  />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-full lg:w-[45%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-[#ff8077]" key={i}>
              {
                ListStudentOJ.length === 0 && (
                  // Hiển thị 0 RubricSlider khi không có sinh viên được chọn
                  <>
                  </>
                )
              }
              {
                ListStudentOJ.length === 1 && (
                  // Hiển thị 1 RubricSlider khi có 1 sinh viên được chọn
                  <>
                    <RubricSlider
                      studentID={ListStudentOJ[0]?.student_id}
                      studentCode={ListStudentOJ[0]?.studentCode}
                      StudentName={ListStudentOJ[0]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange1}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                  </>
                )
              }
              {
                ListStudentOJ.length === 2 && (
                  // Hiển thị 2 RubricSlider khi có 2 sinh viên được chọn
                  <>
                    <RubricSlider
                      studentID={ListStudentOJ[0]?.student_id}
                      studentCode={ListStudentOJ[0]?.studentCode}
                      StudentName={ListStudentOJ[0]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange1}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[1]?.student_id}
                      studentCode={ListStudentOJ[1]?.studentCode}
                      StudentName={ListStudentOJ[1]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange2}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                  </>
                )
              }
              {
                ListStudentOJ.length === 3 && (
                  // Hiển thị 3 RubricSlider khi có 3 hoặc nhiều hơn sinh viên được chọn
                  <>
                    <RubricSlider
                      studentID={ListStudentOJ[0]?.student_id}
                      studentCode={ListStudentOJ[0]?.studentCode}
                      StudentName={ListStudentOJ[0]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange1}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[1]?.student_id}
                      studentCode={ListStudentOJ[1]?.studentCode}
                      StudentName={ListStudentOJ[1]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange2}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[2]?.student_id}
                      studentCode={ListStudentOJ[2]?.studentCode}
                      StudentName={ListStudentOJ[2]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange3}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                  </>
                )
              }
              {
                ListStudentOJ.length === 4 && (
                  // Hiển thị 3 RubricSlider khi có 3 hoặc nhiều hơn sinh viên được chọn
                  <>
                    <RubricSlider
                      studentID={ListStudentOJ[0]?.student_id}
                      studentCode={ListStudentOJ[0]?.studentCode}
                      StudentName={ListStudentOJ[0]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange1}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[1]?.student_id}
                      studentCode={ListStudentOJ[1]?.studentCode}
                      StudentName={ListStudentOJ[1]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange2}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[2]?.student_id}
                      studentCode={ListStudentOJ[2]?.studentCode}
                      StudentName={ListStudentOJ[2]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange3}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                    <RubricSlider
                      studentID={ListStudentOJ[3]?.student_id}
                      studentCode={ListStudentOJ[3]?.studentCode}
                      StudentName={ListStudentOJ[3]?.name}
                      maxScore={item.maxScore}
                      index={i}
                      defaultValue={defaultValue}
                      handleSliderChange={handleSliderChange4}
                      rubricsItem_id={item.rubricsItem_id}
                    />
                  </>
                )
              }
            </div>
          </div>
        ))
      }

    </div>
  )
}
export default FormMultipleGrading