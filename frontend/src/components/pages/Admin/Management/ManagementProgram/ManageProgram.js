import { useEffect, useState } from "react";
import { message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const ManageProgram = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { setCollapsedNav } = nav;
    const [programData, setProgramData] = useState([]);

    const allProgramNotIsDelete = async () => {
        try {
            const program = await axiosAdmin.get('/program/isDelete/false');
            setProgramData(program.data)
            console.log(program.data);
        } catch (error) {
            console.error("Error fetching program data:", error);
            message.error(error.message || 'Error fetching program data');
        };
    }
    useEffect(() => {
        allProgramNotIsDelete()
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
    }, []);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500">
            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to="/admin/management-program/description">
                        <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/description") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/create">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]" >
                            <div className={` ${isActive("/admin/management-program/create") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                                Tạo chương trình
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/management-program/update">
                        <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                            <div className={` ${isActive("/admin/management-program/update") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                                Chỉnh sửa
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="w-full border mt-5 rounded-lg">
                <div className="w-full border-collapse border">
                    <div className="w-full">
                        <div className="w-full border-1 bg-[#475569] text-white text-center">Mô tả</div>
                    </div>
                    <div className="border-1 text-justify leading-8 p-5">
                        <div className="w-full text-2xl text-[#475569] mb-5 font-bold">{programData?.programName}</div>

                        <div dangerouslySetInnerHTML={{ __html: programData?.description }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManageProgram;
