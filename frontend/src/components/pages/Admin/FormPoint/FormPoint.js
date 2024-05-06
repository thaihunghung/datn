import React, { useEffect, useState } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip, Button } from "@nextui-org/react";
import { Collapse } from 'antd';

import "./FormPoint.css"

const CDR = [
  { CDR: 'CLO1', CONTENT: 'chuẩn đầu ra 1' }
];
var demoTong = 1;

const rubics = [
{
    CLO: { id_clos: 1, CLO: 'CLO1', CONTENT: 'chuẩn đầu ra 1' },
    TieuChi: {
      id_Tieu_Chi: 1,
      Noidung: <div><div>"Tiêu chi 1"</div><div>"Tiêu chi 2"</div><div>"Tiêu chi 3"</div></div>,
      ten_Tieu_Chi: "Tiêu chí 1",
      DiemSo: 1,
    }
  },
  {
    CLO: { id_clos: 2, CLO: 'CLO2', CONTENT: 'chuẩn đầu ra 2' },
    TieuChi: {
      id_Tieu_Chi: 2,
      Noidung: <div><div>"Tiêu chi 1"</div><div>"Tiêu chi 2"</div><div>"Tiêu chi 3"</div></div>,
      ten_Tieu_Chi: "Tiêu chí 2",
      DiemSo: 1,
    }
  },
  {
    CLO: { id_clos: 3, CLO: 'CLO3', CONTENT: 'chuẩn đầu ra 3' },
    TieuChi: {
      id_Tieu_Chi: 3,
      Noidung: <div><div>"Tiêu chi 1"</div><div>"Tiêu chi 2"</div><div>"Tiêu chi 3"</div></div>,
      ten_Tieu_Chi: "Tiêu chí 3",
      DiemSo: 5,

    }
  }
]





const FormPoint = (nav) => {
  const { setCollapsedNav } = nav;
  const [selectedValues, setSelectedValues] = useState([]);
  const handleRadioChange = (index, cloId, tieuChiId, maTieuChuan) => {
    setSelectedValues(prevValues => {
      // Create a copy of the previous values
      const updatedValues = [...prevValues];
      
      // Update the value at the specified index
      updatedValues[index] = {
        cloId: cloId,
        tieuChiId: tieuChiId,
        maTieuChuan: maTieuChuan
      };
  
      // Return the updated values
      return updatedValues;
    });
  };
  const handleSubmit = () => {
    console.log('Submit button clicked');
    console.log('Selected values:', selectedValues);
  };
  useEffect(() => {
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
      <button 
        onClick={handleSubmit} 
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
      <div className="w-full flex flex-col p-2 py-0 mb-2  sm:p-5 sm:mb-2 sm:py-0 sm:flex-col lg:flex-row lg:mb-0 xl:flex-row xl:mb-0">
        <div className="w-full text-justify lg:w-[55%] xl:w-[60%] border-[1px] border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full hidden p-2 bg-[#008000] sm:hidden lg:w-[20%] lg:block xl:w-[20%] xl:block border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] xl:border-r-[1px]  border-black">
            <p className="text-center font-bold px-5 lg:w-[100px] xl:w-[100px] text-white">CĐR</p>
          </div>


          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2 bg-[#008000]  border-black">
            <p className="text-center font-bold hidden sm:hidden lg:block xl:block text-white p-5 sm:p-5 lg:p-0 xl:p-0">Tiêu chí</p>
            <p className="text-center font-bold block sm:block lg:hidden xl:hidden text-white p-5 sm:p-5 lg:p-0 xl:p-0">Chấm điểm</p>
          </div>
        </div>
        <div className="hidden w-full bg-[#008000] sm:hidden lg:w-[45%] border-[1px] border-l-0  border-black lg:block xl:block xl:w-[40%] text-justify p-5 pb-0 pt-2">
          <p className="text-center font-bold  text-white">Mức độ chất lượng</p>
        </div>
      </div>

      {
        rubics.map((item, i) => (
          <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row">
            <div className="w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none text-justify lg:w-[55%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
              <div className="w-full p-2 lg:w-[20%] xl:w-[20%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-black">
                <div className="hidden sm:block lg:block xl:block ">
                  <div className="px-5 py-3 lg:w-[100px] xl:w-[100px] font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                    {item.CLO.CLO + '. ' + item.CLO.CONTENT}
                  </div>
                </div>

                <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
                  <div className="w-fit ">
                    <Tooltip content={item.CLO.CONTENT}>
                      <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal ">
                        <span className="border-[1px] rounded px-2 border-black">
                          + </span>{item.CLO.CLO}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="hidden sm:hidden lg:block xl:block text-justify leading-8 p-4">
                  <p>{item.TieuChi.ten_Tieu_Chi}</p>
                  {/* {item.TieuChi.map((tieuchuan, index) => (
                    <div key={index} className="text-justify leading-8">

                      <p>{tieuchuan.Noidung}</p>

                    </div>
                  ))} */}
                </div>

                <div className="block sm:block lg:hidden xl:hidden">
                  <Collapse items=
                    {
                      [
                        {
                          key: '1',
                          label: <p className="text-justify text-lg">{item.TieuChi.ten_Tieu_Chi}</p>,
                          children: (
                            <div className="text-justify p-2 px-5 sm:p-2 sm:px-5 lg:p-5 xl:p-5">
                              {/* {item.TieuChi.map((tc, index) => (
                                <div key={index} className="text-lg">{tc.Noidung}</div>
                              ))} */}
                            </div>
                          )
                        }
                      ]
                    } 
                    colorBorder="#FFD700" 
                    className="Collapse"
                    defaultActiveKey={['1']} 
                   />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-full lg:w-[45%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-black">

              <div className="pb-10 sm:pb-10 lg:pb-0 xl:pb-0">
                <RadioGroup label={`Tổng điểm là: ${item.TieuChi.DiemSo}`} orientation="horizontal">
                  <table className="w-full border-collapse border border-black">
                    <tbody>
                      <tr>
                        {/* {item.TieuChi.map((tc, index) => (
                          <td key={index} className="p-2 text-center border border-black">
                            <div className="flex flex-col items-center gap-2">
                              <span>{`Đạt ${index}`}</span>
                              <Radio 
                                size="lg"
                                value={index}
                                onChange={() => handleRadioChange(i, item.CLO.id_clos, index, item.TieuChi.id_Tieu_Chi)}
                              >

                              </Radio>
                            </div>
                          </td>
                        ))} */}
                      </tr>
                      <tr>
                        {/* {item.TieuChi.map((tc, index) => (
                          <td key={index} className="p-2 text-center border border-black">
                            <div className="flex flex-col items-center gap-2">
                              <span>{demoTong * 0}</span>
                              <span>{demoTong * 0.25}</span>
                              <span>{demoTong * 0.5}</span>
                              <span>{demoTong * 0.75}</span>
                              <span>{demoTong}</span>
                            </div>
                          </td>
                        ))} */}
                      </tr>
                    </tbody>
                  </table>
                </RadioGroup>
              </div>
            </div>
          </div>
        ))
      }















      {/* <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row">
        <div className="w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none text-justify lg:w-[55%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full p-2 lg:w-[20%] xl:w-[20%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-black">
            <div className="hidden sm:block lg:block xl:block ">
              <div className="px-5 py-3 lg:w-[100px] xl:w-[100px] font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                {CDR[0].CDR + '. ' + CDR[0].CONTENT}
              </div>
            </div>

            <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
              <div className="w-fit ">
                <Tooltip content={CDR[0].CONTENT}>
                  <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal ">
                    <span className="border-[1px] rounded px-2 border-black">
                      + </span>{CDR[0].CDR}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="hidden sm:hidden lg:block xl:block text-justify leading-8 p-4">
              <p>tieu chi 1</p>
              {Tieuchuan.map((tieuchuan, index) => (
                <div key={index} className="text-justify leading-8">

                  <p>{tieuchuan.TenTieuChuan}</p>

                </div>
              ))}
            </div>

            <div className="block sm:block lg:hidden xl:hidden">
              <Collapse items={items} colorBorder="#FFD700" className="Collapse" defaultActiveKey={['1']} />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-full lg:w-[45%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-black">

          <div className="pb-10 sm:pb-10 lg:pb-0 xl:pb-0">
            <RadioGroup label={`Tổng điểm là: ${demoTong}`} orientation="horizontal">
              <table className="w-full border-collapse border border-black">
                <tbody>
                  <tr>
                    {Tieuchuan.map((tc, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          <span>{`Đạt ${index}`}</span>
                          <Radio value={tc.MaTieuChuan} size="lg"></Radio>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {MucDo_CL.map((MDCL, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          {MDCL.TenMucDo_CL}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {Tieuchuan.map((tc, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          {index === 0 && <span>{demoTong * 0}</span>}
                          {index === 1 && <span>{demoTong * 0.25}</span>}
                          {index === 2 && <span>{demoTong * 0.5}</span>}
                          {index === 3 && <span>{demoTong * 0.75}</span>}
                          {index === 4 && <span>{demoTong}</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row">
        <div className="w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none text-justify lg:w-[55%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full p-2 lg:w-[20%] xl:w-[20%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-black">
            <div className="hidden sm:block lg:block xl:block">
              <div className="px-5 py-3 lg:w-[100px] xl:w-[100px] font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">
                {CDR[0].CDR + '. ' + CDR[0].CONTENT}
              </div>
            </div>

            <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
              <div className="w-fit ">
                <Tooltip content={CDR[0].CONTENT}>
                  <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal ">
                    <span className="border-[1px] rounded px-2 border-black">
                      + </span>{CDR[0].CDR}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="hidden sm:hidden lg:block xl:block text-justify leading-8 p-4">
              <p>tieu chi 2</p>
              {Tieuchuan1.map((tieuchuan, index) => (
                <div key={index} className="text-justify leading-8">


                  <p>{tieuchuan.TenTieuChuan}</p>

                </div>
              ))}
            </div>

            <div className="block sm:block lg:hidden xl:hidden">
              <Collapse items={items1} colorBorder="#FFD700" className="Collapse" defaultActiveKey={['1']} />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-full lg:w-[45%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-black">

          <div className="pb-10 sm:pb-10 lg:pb-0 xl:pb-0">
            <RadioGroup label={`Tổng điểm là: ${demoTong}`} orientation="horizontal">
              <table className="w-full border-collapse border border-black">
                <tbody>
                  <tr>
                    {Tieuchuan1.map((tc, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          <span>{`Đạt ${index}`}</span>
                          <Radio value={tc.MaTieuChuan} size="lg"></Radio>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {MucDo_CL1.map((MDCL, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          {MDCL.TenMucDo_CL}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    {Tieuchuan1.map((tc, index) => (
                      <td key={index} className="p-2 text-center border border-black">
                        <div className="flex flex-col items-center gap-2">
                          {Tieuchuan1.length === 5 && index === 0 && <span>{demoTong * 0}</span>}
                          {Tieuchuan1.length === 5 && index === 1 && <span>{demoTong * 0.25}</span>}
                          {Tieuchuan1.length === 5 && index === 2 && <span>{demoTong * 0.5}</span>}
                          {Tieuchuan1.length === 5 && index === 3 && <span>{demoTong * 0.75}</span>}
                          {Tieuchuan1.length === 5 && index === 4 && <span>{demoTong}</span>}

                          {Tieuchuan1.length === 3 && index === 0 && <span>{demoTong * 0}</span>}
                          {Tieuchuan1.length === 3 && index === 1 && <span>{demoTong * 0.5}</span>}
                          {Tieuchuan1.length === 3 && index === 2 && <span>{demoTong}</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </RadioGroup>
          </div>
        </div>
      </div> */}

    </div>
  )
}
export default FormPoint