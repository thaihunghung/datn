import React, { useEffect, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip, Button } from "@nextui-org/react";
import { Collapse } from 'antd';

import "./FormPoint.css"
import { axiosAdmin } from "../../../../service/AxiosAdmin";

const demoTong = 1

const FormPoint = (nav) => {
  const { setCollapsedNav } = nav;
  const [selectedValues, setSelectedValues] = useState([]);

  const [RubicData, setRubicData] = useState([]);

  const [RubicItemsData, setRubicItemsData] = useState([]);
  const totalKeyNumber = selectedValues.reduce((total, value) => total + value.keyNumber, 0);

  const handleRadioChange = (index, qualityLevel_id, clo_id, keyNumber) => {

    setSelectedValues(prevValues => {
      // Create a copy of the previous values
      const updatedValues = [...prevValues];

      // Update the value at the specified index
      updatedValues[index] = {
        qualityLevel_id: qualityLevel_id,
        clo_id: clo_id,
        keyNumber: keyNumber,
      };
      // Return the updated values
      return updatedValues
    });

  };
  const handleSubmit = () => {
    console.log('Submit button clicked');
    console.log('Selected values:', selectedValues);
  };

  const GetRubricData = async () => {
    try {
      const response = await axiosAdmin.get(`/rubric/${1}/items`);
      setRubicData(response.data.rubric)
      setRubicItemsData(response.data.rubric.rubricItems)

      console.log(response.data.rubric.rubricItems.qualityLevel)
    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  useEffect(() => {
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
    <div className="w-full p-2 py-0 flex flex-col leading-6 mt-10">

      <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-1 w-full p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
        <p className="text-sm font-medium">
          <i className="fa-solid fa-circle-check mr-3 text-emerald-500 "></i>{" "}
          <span className="mr-2">Tổng điểm: {totalKeyNumber ? totalKeyNumber : ''}</span>
          <span>Tiêu chí: {selectedValues.length + '/' + RubicItemsData.length}</span>
        </p>
        <div className="flex items-center gap-2">

          <Tooltip
            title={`hi hi`}
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button isIconOnly variant="light" radius="full">
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          </Tooltip>
          <Tooltip
            title="Bỏ chọn"
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              onClick={() => {
                handleSubmit();
              }}
            >
              <i className="fa-solid fa-xmark text-[18px]"></i>
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full flex flex-col p-2 py-0 mb-2  sm:p-5 sm:mb-2 sm:py-0 sm:flex-col lg:flex-row lg:mb-0 xl:flex-row xl:mb-0">
        <div className="w-full text-justify lg:w-[55%] xl:w-[60%]   flex flex-col sm:flex-col lg:flex-row xl:flex-row">

          <div className="w-full hidden p-2 bg-[#FF8077] sm:hidden lg:w-[10%] lg:block xl:w-[10%] xl:block  sm:px-0">
            <p className=" text-[#020401] text-center">CĐR</p>
          </div>
          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2 bg-[#FF8077]  ">
            <p className="text-center font-bold hidden sm:hidden lg:block xl:block text-[#020401] p-5 sm:p-5 lg:p-0 xl:p-0">Tiêu chí</p>
            <p className="text-center font-bold block sm:block lg:hidden xl:hidden text-[#020401] p-5 sm:p-5 lg:p-0 xl:p-0">Chấm điểm</p>
          </div>
        </div>
        <div className="hidden w-full bg-[#FF8077] sm:hidden lg:w-[45%]   lg:block xl:block xl:w-[40%] text-justify p-5 pb-0 pt-2">
          <p className="text-center font-bold  text-[#020401]">Mức độ chất lượng</p>
        </div>
      </div>

      {
        RubicItemsData.map((item, i) => (
          <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row" key={item.rubricsItem_id}>
            {/* Left Side */}
            <div className="w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none text-justify lg:w-[55%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-[#ff8077] flex flex-col sm:flex-col lg:flex-row xl:flex-row">
              <div className="w-full p-2 lg:w-[10%] xl:w-[10%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#ff8077]">
                <div className="hidden sm:block lg:block xl:block">
                  <div className="text-center font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                    <Tooltip content={item.CLO.description}>{item.CLO.cloName}</Tooltip>
                  </div>
                </div>
                <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
                  <div className="w-fit ">
                    <Tooltip content={item.CLO.description}>
                      <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal ">
                        <span className="border-[1px] rounded px-2 border-[#ff8077]">+</span>{item.CLO.cloName}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="hidden flex flex-col sm:hidden lg:block xl:block text-justify leading-8 p-4" dangerouslySetInnerHTML={{ __html: item.description }} />
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
              <div className="pb-10 sm:pb-10 lg:pb-0 xl:pb-0">
                <div className="w-full flex flex-col border-collapse border border-[#ff8077]">
                  <div className="w-full">
                    <RadioGroup label={`Tổng điểm là: ${item.score}`} orientation="horizontal">
                      <div className="flex w-full justify-center items-center">
                        {item.qualityLevel.map((quality, index, array) => (
                          <div key={quality.qualityLevel_id} className="p-1 gap-2 flex-1 flex flex-col justify-center items-center">
                            {index === array.length - 1 ? (
                              <>
                                <span className="block sm:block lg:block xl:hidden">CD</span>
                                <span className="hidden sm:hidden lg:hidden xl:block">{quality.name}</span>
                              </>
                            ) : (
                              <span>{quality.name}</span>
                            )}
                            <Radio
                              value={quality.qualityLevel_id}
                              size="lg"
                              color="warning"
                              onChange={() =>
                                handleRadioChange(i, quality.qualityLevel_id, item.CLO.clo_id, quality.keyNumber)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex w-full justify-center items-center">
                    {item.qualityLevel.map((quality) => (
                      <div key={quality.qualityLevel_id} className="p-2 flex-1 flex justify-center items-center">
                        {<span>{quality.keyNumber}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex w-full justify-center items-center">
                    {item.qualityLevel.map((quality) => (
                      <div key={quality.qualityLevel_id} className="p-2 flex-1 flex justify-center items-center">
                        {<span>{quality.level}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }

    </div>
  )
}
export default FormPoint