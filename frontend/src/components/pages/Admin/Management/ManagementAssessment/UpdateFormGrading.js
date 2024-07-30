import React, { useEffect, useState } from "react";

import { Table, Tooltip, Button, message } from 'antd';

import { Collapse } from 'antd';
import { Slider } from "@nextui-org/react";

import "./FormGrading.css"
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const UpdateFormGrading = (nav) => {

  const { setCollapsedNav } = nav;

  const [selectedValues, setSelectedValues] = useState([]); // Initialize as array
  
  const [RubicData, setRubicData] = useState([]);
  const [RubicItemsData, setRubicItemsData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [Check, setCheck] = useState(0);
  const [defaultValue, setdefaultValue] = useState(0);

  const { assessment_id, rubric_id } = useParams();
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');

  if (!teacher_id) {
    navigate('/login');
  }

  const handleSliderChange = (index, value, rubricsItem_id, assessmentItem_id) => {
    console.log('index: ', index)
    setSelectedValues(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        assessmentItem_id: assessmentItem_id,
        assessment_id: assessment_id,
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
      setCheck(Check)
      setTotalScore(newTotalScore);
      return updatedValues;
    });
  };

  const handleSave = async () => {
    // console.log('Updated values', selectedValues);
    // console.log('totalScore', totalScore);
    
    try {
      const data = { totalScore: totalScore }

      await axiosAdmin.put(`/assessment/${assessment_id}/totalScore`, { data: data })
      const dataAssessmentItem = selectedValues.map(item => {
        const { maxScore, CheckGrading, ...rest } = item;
        return {
          ...rest,
          assessmentScore: maxScore
        };
      });

      for (const item of dataAssessmentItem) {
        const { assessmentItem_id, ...dataToUpdate } = item;
        try {
          await axiosAdmin.put(`/assessment-item/${assessmentItem_id}`, { data: dataToUpdate });
        } catch (error) {
          console.error(`Error updating assessment item with id ${assessmentItem_id}:`, error);
          // Handle error as needed
        }
      }
      message.success("update success")
    } catch (e) {
      console.error(e);
      message.error('Error saving data');
    }
  };

  const setValue = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        assessmentItem_id: subject?.AssessmentItems[0]?.assessmentItem_id,
        assessment_id: assessment_id,
        rubricsItem_id: subject?.rubricsItem_id,
        maxScore: subject?.AssessmentItems[0]?.assessmentScore,
        CheckGrading: true,
      };
    });
    console.log(updatedPoData);
    setSelectedValues(updatedPoData);
  }
  const GetRubricData = async () => {
    try {
      // /assessments/:assessment_id/items

      const response = await axiosAdmin.get(`/assessment/${assessment_id}/items`);
      //console.log(response?.data);
      setRubicData(response?.data?.Rubric)
      setRubicItemsData(response?.data?.Rubric?.RubricItems)
      // console.log("assessment")
      // console.log(response?.data?.Rubric?.RubricItems[0].AssessmentItems[0].assessmentScore)
      // console.log("RubricItems")
      // console.log(response?.data?.Rubric?.RubricItems[0]?.rubricsItem_id)

      handleSliderChange(0,response?.data?.Rubric?.RubricItems[0].AssessmentItems[0]?.assessmentScore,response?.data?.Rubric?.RubricItems[0]?.rubricsItem_id)
      const data = response?.data?.Rubric?.RubricItems
      setValue(data)

    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (setCheck === 0) {
      setTotalScore(0);
      setdefaultValue(0);
    }
    GetRubricData()
    const handleResize = () => {
      if (window.innerWidth < 1200) {
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
    <div className="w-full p-2 pb-[100px] py-0 flex flex-col leading-6 mt-10">

      <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-fit p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
        <p className="text-sm font-medium">
          <div className="flex justify-center items-center">
            <div> <i className="fa-solid fa-circle-check mr-3 text-emerald-500 "></i>
            </div>
            <div className="flex justify-center items-center gap-1 flex-col sm:flex-row lg:flex-row xl:flex-row">
              <span className="mr-2">Tổng điểm: {' ' + totalScore} </span>

              Tiêu chí: {Check}/{RubicItemsData.length}


            </div>
          </div>


        </p>
        <div className="flex items-center gap-2 ml-5">
          <Tooltip
            title="Lưu"
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              onClick={() => {
                handleSave();
              }}
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

            {/* Right Side */}
            <div className="w-full sm:w-full lg:w-[45%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-[#ff8077]" key={i}>
              <div className="flex flex-col gap-6 w-full max-w-md">
                {item.maxScore === 1 && (
                  <Slider
                    size="lg"
                    label={<span>Điểm tối đa: {item.maxScore} </span>}
                    showTooltip={true}
                    step={0.25}
                    // formatOptions={{style: "percent"}}
                    maxValue={item?.maxScore}
                    minValue={0}
                    defaultValue={item?.AssessmentItems[0]?.assessmentScore}
                    className="max-w-md"
                    marks={[
                      {
                        value: 0,
                        label: "0",
                      },
                      {
                        value: 0.25,
                        label: "0.25",
                      },
                      {
                        value: 0.5,
                        label: "0.5",
                      },
                      {
                        value: 0.75,
                        label: "0.75",
                      },
                      {
                        value: 1,
                        label: "1",
                      },
                    ]}
                    onChange={(value) => handleSliderChange(i, value, item?.rubricsItem_id, item?.AssessmentItems[0]?.assessmentItem_id)}
                  />
                )}

                {item.maxScore === 0.5 && (
                  <Slider
                    size="lg"
                    label={<span>Điểm tối đa: {item.maxScore} </span>}
                    showTooltip={true}
                    step={0.25}
                    // formatOptions={{style: "percent"}}
                    maxValue={item.maxScore}
                    minValue={0}
                    defaultValue={item.AssessmentItems[0].assessmentScore}
                    className="max-w-md"
                    marks={[
                      {
                        value: 0,
                        label: "0",
                      },
                      {
                        value: 0.25,
                        label: "0.25",
                      },
                      {
                        value: 0.5,
                        label: "0.5",
                      },
                    ]}
                    onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                  />
                )}

                {item.maxScore === 0.25 && (
                  <Slider
                    size="lg"
                    label={<span>Điểm tối đa: {item.maxScore} </span>}
                    showTooltip={true}
                    step={0.25}
                    // formatOptions={{style: "percent"}}
                    maxValue={item.maxScore}
                    minValue={0}
                    defaultValue={item.AssessmentItems[0].assessmentScore}
                    className="max-w-md"
                    marks={[
                      {
                        value: 0,
                        label: "Chưa đạt",
                      },
                      {
                        value: 0.25,
                        label: "Đạt",
                      },
                    ]}
                    onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                  />
                )}
              </div>
            </div>
          </div>
        ))
      }

    </div>
  )
}
export default UpdateFormGrading