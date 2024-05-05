import React from 'react';
import { Button } from "@nextui-org/react";
import { AxiosClient } from '../../../../service/AxiosClient';

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
            const response = await AxiosClient.post('pdf', {
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
    const CDR = [
        { CDR: 'CDR1' },
        { CDR: 'CDR2' },
        { CDR: 'CDR3' },
    ];

    const tieuchi = [
        { CDR: 'CDR1', tieuchi: 'TC1', point: 1.0 },
        { CDR: 'CDR2', tieuchi: 'TC3', point: 1.5 },
        { CDR: 'CDR2', tieuchi: 'TC4', point: 1.0 },
        { CDR: 'CDR2', tieuchi: 'TC5', point: 1.0 },
        { CDR: 'CDR3', tieuchi: 'TC6', point: 1.0 },
        { CDR: 'CDR2', tieuchi: 'TC7', point: 1.0 },
    ];
    let counter = 0;

    const tableRows = CDR.map((cdrItem, index) => {
        const criteria = tieuchi.filter(item => item.CDR === cdrItem.CDR);
        return (
            <React.Fragment key={index}>
                {criteria.map((criteriaItem, idx) => {
                    counter++;
                    return (
                        <tr key={`${index}-${idx}`}>
                            <td className='p-5 align-top border-black border-[1px]'>{counter}</td>
                            {idx === 0 && <td rowSpan={criteria.length} className='border-black border-[1px] p-2'>{cdrItem.CDR}</td>}
                            <td className='text-justify w-[352px]  border-black border-[1px] test p-4'>
                                <p> 1.1. Hình thức
                                    <br />
                                    1.Định dạng văn bản đúng quy định (font, size, khổ giấy, canh lề, văn bản, định dạng đoạn…)
                                    <br />
                                    2. Có danh mục hình, bảng (nếu có), mục lục, tài liệu tham khảo, danh mục từ viết tắt (nếu có)
                                    <br />
                                    3. Văn phong rõ ràng, mạch lạc, không lỗi chính tả
                                    <br />
                                    4. Mục lục, tài liệu tham khảo đúng quy định, kết luận
                                </p>
                            </td>
                            <td className='flex flex-col items-start w-full '>
                                <p className='text-left leading-6 ml-2'>Tổng điểm: {criteriaItem.point}</p>
                                <div className='flex flex-col gap-[20px] ml-2  border-black border-[1px] pb-2'>
                                    <div>
                                        <h1 className='font-bold'>{criteriaItem.tieuchi}</h1>
                                    </div>
                                    <div className="w-[262px] flex gap-2 text-xs items-center justify-center font-bold">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="border-black border-[1px] p-5 w-[20px] h-[20px] flex items-center justify-center rounded-full">
                                                {counter + i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </React.Fragment>
        );
    });

    return (
        <div>
            <DownloadDiv />
            <div className='flex justify-center text-base' id="downloadDiv">
                <table className="table-bordered w-[720px]" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                    <thead>
                        <tr className='border-black border-[1px]'>
                            <th className='p-2'>STT</th>
                            <th className='p-2'>CDR</th>
                            <th className='p-2'>Tieuchi</th>
                            <th className='p-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                    <tfoot>
                        <tr className=' border-black border-[1px]'>
                            <th colSpan={4} className='border-black border-[1px] p-4'></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Template;
