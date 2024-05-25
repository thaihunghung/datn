import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubricItems from "../../Utils/DropdownAndNav/DropdownAndNavRubricItems";

const View = () => {
    const { id } = useParams();
    const [RubicItemsData, setRubicItemsData] = useState([]);
    const GetRubricData = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}/items`);
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
        <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
            <div className="w-full flex justify-end">
                <DropdownAndNavRubricItems />
            </div>
            <div className="w-[26cm] overflow-auto mx-auto">
                <table className='border-collapse border border-[#ff8077] mt-10 w-full h-full leading-8 font-medium'>
                    <thead>
                        <tr className="border border-b-0 border-[#ff8077] h-[20px]">
                            <th className="border border-b-0 border-[#ff8077]">CLO</th>
                            <th className="border border-b-0 border-[#ff8077]">PLO</th>
                            <th className="border border-b-0 border-[#ff8077]">Tiêu chí</th>
                            <th className="border border-b-0 border-r-0 border-[#ff8077]">Tổng điểm</th>
                            <th>
                                <table className="w-full h-full border-l border-[#ff8077]">
                                    <tr>
                                        <th>Mức độ chất lượng</th>
                                    </tr>
                                </table>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {RubicItemsData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            RubicItemsData.map((item, i) => (
                                <tr key={item.rubricsItem_id} className="border border-b-0 border-[#ff8077] p-5">
                                    <td className="border border-[#ff8077] text-center px-2">
                                        {item.CLO ? item.CLO.cloName : "N/A"}
                                    </td>
                                    <td className="border border-[#ff8077] text-center px-2">
                                        {item.PLO ? item.PLO.ploName : "N/A"}
                                    </td>
                                    <td className="border border-[#ff8077] text-justify px-2">
                                        <span dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </td>
                                    <td className="border border-r-0 border-[#ff8077] text-center px-2">
                                        {item.score}
                                    </td>
                                    <td>
                                        <table className="w-full h-full border-none">
                                            <tr className="w-full h-[10%]">
                                                {item.qualityLevel.map((quality, index, array) => (
                                                    <td key={index} className={`h-fit text-center p-1 border border-t-0 border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.level}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="w-full h-[80%]">
                                                {item.qualityLevel.map((quality, index, array) => (
                                                    <td key={index} className={`h-fit text-center p-1 border border-t border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.name}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr className="w-full h-[10%] border-t border-b-0 border-[#ff8077]">
                                                {item.qualityLevel.map((quality, index, array) => (
                                                    <td key={index} className={`h-fit text-center p-1 border border-b-0 border-[#ff8077] ${index === array.length - 1 ? 'border-r-0' : ''}`}>
                                                        {quality.keyNumber}
                                                    </td>
                                                ))}
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="border border-[#ff8077] p-5">
                        <tr className="h-[20px]">
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="">
                                <table className="w-full">
                                    <tr>
                                        <td></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    );
};

export default View;
