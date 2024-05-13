import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { AxiosClient } from '../../../../service/AxiosClient';


import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { Collapse } from 'antd';


import { axiosAdmin } from "../../../../service/AxiosAdmin";

import "./css.css"

const DownloadDiv = () => {

    const handleDownload = async () => {
        const divContent = document.getElementById('downloadDiv').innerHTML;
        const htmlString = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Downloaded Div Content</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                @media print {
                    table { page-break-inside:auto }
                    .test { page-break-inside:avoid; page-break-after:auto }
                    thead { display:table-header-group }
                    tfoot { display:table-footer-group }
                    .hung { background-color: black !important; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
                </style>
            </head>
            <body>
                ${divContent}
            </body>
            </html>
        `;
        try {
            const response = await axiosAdmin.post('pdf', {
                html: htmlString
            }, { responseType: 'blob', withCredentials: true });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Button color="primary" onClick={handleDownload}>
            Download
        </Button>
    );
};

const Template = () => {

    const [selectedValues, setSelectedValues] = useState([]);
    const [RubicData, setRubicData] = useState([]);
    const [RubicItemsData, setRubicItemsData] = useState([]);

    const totalKeyNumber = selectedValues.reduce((total, value) => total + value.keyNumber, 0);

    const handleRadioChange = (index, qualityLevel_id, clo_id, keyNumber) => {
        setSelectedValues(prevValues => {
            const updatedValues = [...prevValues];
            updatedValues[index] = {
                qualityLevel_id: qualityLevel_id,
                clo_id: clo_id,
                keyNumber: keyNumber,
            };
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
            setRubicData(response.data.rubric);
            setRubicItemsData(response.data.rubric.rubricItems);
            console.log(response.data.rubric.rubricItems.qualityLevel);
        } catch (error) {
            console.error('Error fetching rubric data:', error);
            throw error;
        }
    };

    useEffect(() => {
        GetRubricData();
    }, []);

    return (
        <div>
            <DownloadDiv />
            <div className='w-full text-base' id="downloadDiv">
            <div class="container">
                <div class="header">
                    <div>CĐR</div>
                    <div>Tiêu chí</div>
                    <div>Tổng điểm</div>
                    <div>Mức độ chất lượng</div>
                </div>
                <div class="content">
                    Content Here
                </div>
                <div class="footer">
                    Footer Content
                </div>
            </div>


              
            </div>
        </div>
    );
};

export default Template;
{/* <div>Trường đại học trà vinh</div>
                <div>Khoa kỹ thuật công nghệ</div>
                <div className="text-2xl font-bold">PHIẾU ĐÁNH GIÁ THỰC TẬP ĐỒ ÁN CHUYÊN NGÀNH</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <div>họ và tên</div>
                <table className='border-collapse border border-[#ff8077] w-full h-full'>
                    <thead>
                        <tr className="border border-b-0 border-[#ff8077] h-[20px]">
                            <th className="border border-b-0 border-[#ff8077]">CĐR</th>
                            <th className="border border-b-0 border-[#ff8077]">Tiêu chí</th>
                            <th className="border border-b-0 border-[#ff8077]">Tổng điểm</th>
                            <th className="border border-b-0 border-[#ff8077]">Mức độ chất lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RubicItemsData.map((item, i) => (
                            <>
                                <tr key={item.rubricsItem_id} className="border border-b-0 border-[#ff8077] p-5">
                                    <td rowSpan={2} className="border border-b-0 border-[#ff8077] text-center">{item.CLO.cloName}</td>
                                    <td rowSpan={2} className="border border-b-0 border-[#ff8077] ">
                                        <span dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </td>
                                    <td rowSpan={2} className="border border-b-0 border-[#ff8077]">
                                        {item.score}
                                    </td>

                                    <td className="h-fit test">
                                        <div className="w-full flex justify-center items-center">
                                            {
                                                item.qualityLevel.map((quality, index) => (
                                                    <span className="flex-1 h-full text-center p-1">{quality.name}</span>
                                                ))
                                            }
                                        </div>
                                    </td>

                                </tr>
                                <tr className="border border-b-0 border-[#ff8077] p-5">
                                    <td className="h-fit test">
                                        <div className="w-full flex justify-center items-center">
                                            {
                                                item.qualityLevel.map((quality, index) => (
                                                    <span className="flex-1 h-full text-center p-1">{quality.keyNumber}</span>
                                                ))
                                            }
                                        </div></td>

                                </tr>

                            </>
                        ))}
                    </tbody>
                    <tfoot className="border border-t-0 border-[#ff8077] p-5">
                        <tr className="h-[20px]">
                            <td className="p-5"></td>
                            <td className="border-x border-[#ff8077] p-5"></td>
                            <td className="border-r border-[#ff8077] p-5"></td>
                            <td className="p-5"></td>
                        </tr>
                    </tfoot>
                </table> */}