import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { AxiosClient } from '../../../../service/AxiosClient';


import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { Collapse } from 'antd';


import { axiosAdmin } from "../../../../service/AxiosAdmin";



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
        <div className="w-[26cm]">
            <DownloadDiv />
            <div className='w-full text-sm' id="downloadDiv">
                <div className="w-full pl-[2cm] pr-[1cm]">
                    <div className="w-full flex justify-center items-center">
                        <div className="w-[40%] flex flex-col justify-center items-center">
                            <div>TRƯỜNG ĐẠI HỌC TRÀ VINH</div>
                            <div className="font-bold">KHOA KỸ THUẬT CÔNG NGHỆ</div>
                            <div className="w-[40%] border-1 border-black"></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                            <div className="font-bold">Độc lập - Tự do - Hạnh Phúc</div>
                            <div className="w-[30%] border-1 border-black"></div>

                        </div>
                    </div>
                    <div className="text-xl font-bold w-full text-center my-5">PHIẾU ĐÁNH GIÁ THỰC TẬP ĐỒ ÁN CHUYÊN NGÀNH</div>
                    <div className="w-full text-left">1. Họ và tên (thành viên Chấm):</div>
                    <div className="w-full text-left">2. Chức danh, học vị:</div>
                    <div className="w-full text-left">3. Đơn vị công tác:</div>
                    <div className="w-full text-left">4. Tên đề tài:</div>
                    <div className="w-full py-5"></div>
                    <div className="w-full flex justify-start items-center"><span>5. Họ và tên sinh viên:</span><span className="flex-1">MSSV:</span></div>
                    <div className="w-full flex justify-start items-center gap-7"><span>6. Chuyên ngành:</span><span className="flex-1">Khóa:</span></div>
                    <div className="w-full text-left">7. Địa điểm:</div>
                    <div className="w-full text-left">8. Ý kiến đánh giá của thành viên Chấm Thực tập Đồ án Chuyên Ngành theo tín chỉ:</div>
                    <div className="w-full text-left italic mb-5">(Thành viên Chấm khoanh tròn vào ô điểm số tương ứng với cột mức chất lượng mà SV đạt được theo từng tiêu chí)</div>
                </div>
                <table className='border-collapse border border-[#ff8077] w-full h-full'>
                    <thead>
                        <tr className="border border-b-0 border-[#ff8077] h-[20px]">
                            <th className="border border-b-0 border-[#ff8077]">CĐR</th>
                            <th className="border border-b-0 border-[#ff8077]">Tiêu chí</th>
                            <th className="border border-b-0 border-r-0 border-[#ff8077]">Tổng điểm</th>


                            <th ><table className="w-full h-full border-l border-[#ff8077]"><tr><th>Mức độ chất lượng</th></tr></table></th>
                        </tr>
                    </thead>
                    <tbody>
                        {RubicItemsData.map((item, i) => (

                            <tr key={item.rubricsItem_id} className="border border-b-0 border-[#ff8077] p-5">
                                <td className="border  border-[#ff8077] text-center px-2">{item.CLO.cloName}</td>
                                <td className="border border-[#ff8077] test text-justify px-2">
                                    <span dangerouslySetInnerHTML={{ __html: item.description }} />
                                </td>
                                <td className="border border-r-0 border-[#ff8077] text-center px-2">
                                    {item.score}
                                </td>
                                <td>
                                    <table className="w-full h-full border-none">
                                        <tr className="w-full h-[10%]">
                                            {
                                                item.qualityLevel.map((quality, index, array) => (
                                                    <td className={`h-fit text-center p-1 border border-t-0 border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.level}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                        <tr className="w-full h-[80%]">
                                            {
                                                item.qualityLevel.map((quality, index, array) => (
                                                    <td className={`h-fit text-center p-1 border border-t border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.name}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                        <tr className="w-full h-[10%] border-t border-b-0 border-[#ff8077]">
                                            {
                                                item.qualityLevel.map((quality, index, array) => (
                                                    <td className={`h-fit text-center p-1 border border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.keyNumber}
                                                    </td>
                                                ))
                                            }
                                        </tr>

                                    </table>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                    <tfoot className="border border-[#ff8077] p-5">
                        <tr className="h-[20px]">
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className=""><table className="w-full"><tr><td></td></tr></table></td>
                        </tr>
                    </tfoot>
                </table>

                <div className="w-full pl-[2cm] pr-[1cm]" style={{ pageBreakInside: 'avoid' }}>
                    <div className="w-full text-left mt-2">
                        <span className="font-bold">9. Kết luận của thành viên Chấm đồ án: </span>
                        <span className="italic">(Lưu ý: Tổng điểm bài thi và điểm thưởng không quá 10 điểm)</span>
                    </div>
                    <div className="w-full text-left my-2">
                        <span className="pl-[50px]">Tổng điểm:..................(Bằng chữ:........................................................................) </span>
                    </div>
                    <div className="w-full text-left font-bold">
                        10. Ý kiến góp ý, bổ sung:
                    </div>
                    <div className="w-full flex mt-[50px] justify-end pl-[2cm] pr-[1cm] ">
                        <div className="w-[50%] mr-[20px] test">
                            <div className="w-full text-center test">
                                Trà Vinh,<span className="italic"> ngày     tháng     năm 2024</span>
                            </div>
                            <div className="w-full text-center font-bold test">
                                Thành viên Chấm báo cáo
                            </div>
                            <div className="w-full text-center test">
                                <span className="italic">(Ký & ghi rõ họ tên)</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Template;
