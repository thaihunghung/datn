import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { Collapse } from 'antd';
import "./FormPoint.css"

import { message } from 'antd';
import CustomUpload from "../Utils/CustomUpload/CustomUpload";

const props = {
  name: 'file',
  action: 'http://localhost:1509/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const CDR = [
  { CDR: 'CDR1', CONTENT: 'chuẩn đầu ra 1' }
];
var demoTong = 1;
const items = [
  {
    key: '1',
    label: <p className="font-bold text-justify leading-8">Tiêu chí</p>,
    children: <p className="text-justify leading-8">
      1.1. Hình thức
      <br />
      1. Định dạng văn bản đúng quy định (font, size, khổ giấy, canh lề, văn bản, định dạng đoạn…)
      <br />
      2. Có danh mục hình, bảng (nếu có), mục lục, tài liệu tham khảo, danh mục từ viết tắt (nếu có)
      <br />
      3. Văn phong rõ ràng, mạch lạc, không lỗi chính tả
      <br />
      4. Mục lục, tài liệu tham khảo đúng quy định, kết luận
    </p>,
  }
];
const FormPoint = () => {
  return ( 
    <div className="w-full p-2 py-0 flex flex-col lg:p-6 lg:py-0 xl:p-10 xl:py-0 leading-6 mt-10">
      <CustomUpload props={props}/>
      <div className="w-full flex flex-col p-2 py-0 mb-5  sm:p-5 sm:mb-5 sm:py-0 sm:flex-col lg:flex-row lg:mb-0 xl:flex-row xl:mb-0">
        <div className="w-full rounded-lg sm:rounded-lg lg:rounded-none xl:rounded-none text-justify lg:w-[48%] xl:w-[60%] border-[1px] border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full hidden p-2 bg-[#008000] sm:hidden lg:w-[20%] lg:block xl:w-[20%] xl:block border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] xl:border-r-[1px]  border-black">
            <p className="text-center font-bold  text-white">CĐR</p>
          </div>
          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2 bg-white sm:bg-white lg:bg-[#008000] xl:bg-[#008000] border-black rounded-lg sm:rounded-lg lg:rounded-none xl:rounded-none">
            <p className="text-center font-bold  text-[#008000] sm:text-[#008000] lg:text-white xl:text-white">Tiêu chí</p>
          </div>
        </div>
        <div className="hidden w-full bg-[#008000] sm:hidden lg:w-[52%] border-[1px] border-l-0  border-black lg:block xl:block xl:w-[40%] text-justify p-5 pb-0 pt-2">
          <p className="text-center font-bold  text-white">Điểm</p>
        </div>
      </div>
      <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row">
        <div className="w-full rounded-lg sm:rounded-lg lg:rounded-none xl:rounded-none text-justify lg:w-[48%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full p-2 lg:w-[20%] xl:w-[20%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-black">
            <div className="hidden sm:block lg:block xl:block">
              <div className="px-2 font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">{CDR[0].CDR + '. ' + CDR[0].CONTENT}</div>
            </div>
            <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
              <div className="w-fit ">
                <Tooltip content={CDR[0].CONTENT}>
                  <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal "><span className="border-[1px] rounded px-2 border-black">+</span>{CDR[0].CDR}</div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2">
            <div className="hidden sm:hidden lg:block xl:block text-justify leading-8">
              <p>
                1.1. Hình thức
                <br />
                1.Định dạng văn bản đúng quy định (font, size, khổ giấy, canh lề, văn bản, định dạng đoạn…)
                <br />
                2. Có danh mục hình, bảng (nếu có), mục lục, tài liệu tham khảo, danh mục từ viết tắt (nếu có)
                <br />
                3. Văn phong rõ ràng, mạch lạc, không lỗi chính tả
                <br />
                4. Mục lục, tài liệu tham khảo đúng quy định, kết luận
              </p>
            </div>
            <div className="block sm:block lg:hidden xl:hidden">
              <Collapse items={items} colorBorder="#FFD700" className="Collapse" defaultActiveKey={['1']} />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-full lg:w-[52%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-black">
          <div className="hidden pb-10  sm:pb-10 sm:block lg:pb-0 lg:block xl:block xl:pb-0">
            <RadioGroup
              label={`Tổng điểm là: ${demoTong}`}
              orientation="horizontal"
            >
              <div className="border-black border-1 rounded-lg w-full">
                <table className="w-full">
                  <tr>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-l-0 border-t-0"><Radio value="1">Đạt 0</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="2">Đạt 1</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="3">Đạt 2</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="4">Đạt 3</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0 border-r-0"> <Radio value="5">Đạt 4</Radio></td>
                  </tr>
                  <tr>
                    <td className="w-[100px] p-2 border-black border-1 border-l-0 text-center">
                      Yếu
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      Kém
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      TB
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      Khá
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-r-0 text-center">
                      Giỏi
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[100px] p-2 border-black border-1 border-l-0 border-b-0 text-center">
                      {`${demoTong * 0}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 25 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 50 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 75 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 border-r-0 text-center">
                      {`${demoTong * 100 / 100}`}
                    </td>
                  </tr>
                </table>
              </div>
            </RadioGroup>
          </div>
          <div className="block sm:hidden pb-10 sm:pb-10  lg:pb-0 xl:pb-0">
            <RadioGroup
              label={`Tổng điểm là: ${demoTong}`}
              color="warning"
            >
              <div className="border-black border-1 rounded-lg	">
                <table className="w-full">
                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-t-0  border-l-0 p-2">
                      <Radio value="0">Đạt 0</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-t-0">
                      Yếu
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0 border-t-0">
                      {`${demoTong * 0}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="1">Đạt 1</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      Kém
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 25 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="2">Đạt 2</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      TB
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 50 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="3">Đạt 3</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      Khá
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 75 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 border-b-0 p-2">
                      <Radio value="4">Đạt 4</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-b-0">
                      Giỏi
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-b-0 border-r-0">
                      {`${demoTong}`}
                    </td>
                  </tr>
                </table>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row">
        <div className="w-full rounded-lg sm:rounded-lg lg:rounded-none xl:rounded-none text-justify lg:w-[48%] xl:w-[60%] border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-black flex flex-col sm:flex-col lg:flex-row xl:flex-row">
          <div className="w-full p-2 lg:w-[20%] xl:w-[20%] border-b-1 sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-black">
            <div className="hidden sm:block lg:block xl:block">
              <div className="px-2 font-bold sm:font-bold lg:font-normal xl:font-normal text-[#008000] sm:text-[#008000] lg:text-black xl:text-black">{CDR[0].CDR + '. ' + CDR[0].CONTENT}</div>
            </div>
            <div className="block w-full h-fit sm:hidden sm:border-b-[1px] lg:hidden xl:hidden text-[#008000]">
              <div className="w-fit ">
                <Tooltip content={CDR[0].CONTENT}>
                  <div className="flex items-center justify-center gap-2 font-bold sm:font-bold lg:font-normal xl:font-normal "><span className="border-[1px] rounded px-2 border-black">+</span>{CDR[0].CDR}</div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="w-full p-0 sm:p-0 lg:p-2 xl:p-2">
            <div className="hidden sm:hidden lg:block xl:block text-justify leading-8">
              <p>
                1.1. Hình thức
                <br />
                1.Định dạng văn bản đúng quy định (font, size, khổ giấy, canh lề, văn bản, định dạng đoạn…)
                <br />
                2. Có danh mục hình, bảng (nếu có), mục lục, tài liệu tham khảo, danh mục từ viết tắt (nếu có)
                <br />
                3. Văn phong rõ ràng, mạch lạc, không lỗi chính tả
                <br />
                4. Mục lục, tài liệu tham khảo đúng quy định, kết luận
              </p>
            </div>
            <div className="block sm:block lg:hidden xl:hidden">
              <Collapse items={items} colorBorder="#FFD700" className="Collapse" defaultActiveKey={['1']} />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-full lg:w-[52%] xl:w-[40%] text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-black">
          <div className="hidden pb-10  sm:pb-10 sm:block lg:pb-0 lg:block xl:block xl:pb-0">
            <RadioGroup
              label={`Tổng điểm là: ${demoTong}`}
              orientation="horizontal"
            >
              <div className="border-black border-1 rounded-lg w-full">
                <table className="w-full">
                  <tr>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-l-0 border-t-0"><Radio value="1">Đạt 0</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="2">Đạt 1</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="3">Đạt 2</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0"><Radio value="4">Đạt 3</Radio></td>
                    <td className="w-[100px] align-middle text-left items-center p-2 border-black border-1 border-t-0 border-r-0"> <Radio value="5">Đạt 4</Radio></td>
                  </tr>
                  <tr>
                    <td className="w-[100px] p-2 border-black border-1 border-l-0 text-center">
                      Yếu
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      Kém
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      TB
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 text-center">
                      Khá
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-r-0 text-center">
                      Giỏi
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[100px] p-2 border-black border-1 border-l-0 border-b-0 text-center">
                      {`${demoTong * 0}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 25 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 50 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 text-center">
                      {`${demoTong * 75 / 100}`}
                    </td>
                    <td className="w-[100px] p-2 border-black border-1 border-b-0 border-r-0 text-center">
                      {`${demoTong * 100 / 100}`}
                    </td>
                  </tr>
                </table>
              </div>
            </RadioGroup>
          </div>
          <div className="block sm:hidden pb-10 sm:pb-10  lg:pb-0 xl:pb-0">
            <RadioGroup
              label={`Tổng điểm là: ${demoTong}`}
              color="warning"
            >
              <div className="border-black border-1 rounded-lg	">
                <table className="w-full">
                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-t-0  border-l-0 p-2">
                      <Radio value="0">Đạt 0</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-t-0">
                      Yếu
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0 border-t-0">
                      {`${demoTong * 0}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="1">Đạt 1</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      Kém
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 25 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="2">Đạt 2</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      TB
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 50 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 p-2">
                      <Radio value="3">Đạt 3</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2">
                      Khá
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-r-0">
                      {`${demoTong * 75 / 100}`}
                    </td>
                  </tr>

                  <tr>
                    <td className="w-[100px] align-middle text-center border-black border-1 border-l-0 border-b-0 p-2">
                      <Radio value="4">Đạt 4</Radio>
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-b-0">
                      Giỏi
                    </td>
                    <td className="w-[100px] align-middle text-center border-black border-1 p-2 border-b-0 border-r-0">
                      {`${demoTong}`}
                    </td>
                  </tr>
                </table>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FormPoint