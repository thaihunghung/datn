import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tooltip, message } from 'antd';
import { Button } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
const CloPlo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id } = useParams();
    const { setCollapsedNav } = nav;

    const [clos, setClos] = useState([]);
    const [plos, setPlos] = useState([]);
    const [PloClos, setPloClos] = useState([]);
    const [comparePloClos, setComparePloClos] = useState([]);

    const [CloArr, setCloArr] = useState([]);


    const GetAllClo = async () => {
        try {
            const response = await axiosAdmin.get(`/clo/subject/${id}`);

            //console.log(response.data);
            setClos(response.data);
        } catch (error) {
            console.error('Error fetching POs:', error);
        }
    };

    const GetArrCloBySubjectID = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/${id}/clo-ids`);
            setCloArr(response.data);
            //console.log(response.data);
            //message.success('CLOs fetched successfully.');
        } catch (error) {
            console.error('Error fetching CLOs:', error);
            if (error.response && error.response.status === 404) {
               // message.error('No CLOs found for the given subject ID.');
            } else {
                message.error('An error occurred while fetching CLOs.');
            }
        }
    };

    const GetAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plo/isDelete/false');
            setPlos(response.data)
        } catch (error) {
            console.error('Error fetching PLOs:', error);
        }
    };
    const handleSaveOrDelete = async () => {
        // let luu = [];
        // let xoa = [];
        // luu = compareCloPlos.filter(compareItem => {
        //     return !poPlos.some(poPloItem => poPloItem.clo_id === compareItem.clo_id && poPloItem.plo_id === compareItem.plo_id);
        // });

        // xoa = poPlos.filter(poPloItem => {
        //     return !compareCloPlos.some(compareItem => compareItem.clo_id === poPloItem.clo_id && compareItem.plo_id === poPloItem.plo_id);
        // });

        // if (luu.length > 0) {
        //     try {
        //       const response = await axiosAdmin.clost('/po-plo', { dataSave: luu });
        //       message.success(response.data.message);
        //     } catch (error) {
        //       console.error("Error:", error);
        //       message.error(error.response?.data?.message || 'Error saving data');
        //     }
        //   }

        //   if (xoa.length > 0) {
        //     try {
        //       const response = await axiosAdmin.delete('/po-plo', { data: { dataDelete: xoa } });
        //       message.success(response.data.message);
        //     } catch (error) {
        //       console.error("Error:", error);
        //       message.error(error.response?.data?.message || 'Error deleting data');
        //     }
        //   }
        let luu = [];
        let xoa = [];
        luu = comparePloClos.filter(compareItem => {

            return !PloClos.some(cloPloItem => cloPloItem.clo_id === compareItem.clo_id && cloPloItem.plo_id === compareItem.plo_id);
        });

        xoa = PloClos.filter(cloPloItem => {
            return !comparePloClos.some(compareItem => compareItem.clo_id === cloPloItem.clo_id && compareItem.plo_id === cloPloItem.plo_id);
        });

        if (luu.length > 0) {
            try {
                const response = await axiosAdmin.post('/plo-clo', { dataSave: luu });
                message.success(response.data.message);
            } catch (error) {
                console.error("Error:", error);
                message.error(error.response?.data?.message || 'Error saving data');
            }
        }

        if (xoa.length > 0) {
            try {
                const response = await axiosAdmin.delete('/plo-clo', { data: { dataDelete: xoa } });
                message.success(response.data.message);
            } catch (error) {
                console.error("Error:", error);
                message.error(error.response?.data?.message || 'Error deleting data');
            }
        }
    }
    const GetAllCloPlo = async () => {
        try {
            //CloArr is []
            const data = {
                id_clos: CloArr
            }
            const response = await axiosAdmin.post('/plo-clo/id_clos', { data: data });
            console.log(response.data);
            console.log("hi");
            const po_plo_ids = response.data.map(item => ({ plo_id: item.plo_id, clo_id: item.clo_id }));
            console.log(po_plo_ids)

            setPloClos(response.data.map(item => ({ id_plo_clo: item.id_plo_clo, clo_id: item.clo_id, plo_id: item.plo_id })));
            setComparePloClos(response.data.map(item => ({ clo_id: item.clo_id, plo_id: item.plo_id })))
        } catch (error) {
            console.error('Error fetching PO-PLO mappings:', error);
        }
    };

    // Hàm xử lý thay đổi trạng thái của checkbox
    const handleCheckboxChange = (plo_id, clo_id, checked) => {
        if (checked) {
            setComparePloClos([...comparePloClos, { plo_id, clo_id }]);
        } else {
            setComparePloClos(comparePloClos.filter(item => !(item.plo_id === plo_id && item.clo_id === clo_id)));
        }
    };

    useEffect(() => {
        GetAllClo();
        GetArrCloBySubjectID()
        GetAllPlo();

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
    useEffect(() => {

        GetAllCloPlo();

    }, [CloArr]);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 relative">
            <div className="w-fit px-5 flex border justify-start text-base font-bold rounded-lg">
                <Link to={`/admin/management-subject/list`}>
                    <Tooltip title="Quay lại" color={'#ff9908'}>
                        <div className="p-5">
                            <i class="fa-solid fa-arrow-left text-xl"></i>
                        </div>
                    </Tooltip>
                </Link>

                <Link to={`/admin/management-subject/${id}/clo/update`}>
                    <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                        <div className={` ${isActive(`/admin/management-subject/${id}/clo/update`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                            Danh sách CLO
                        </div>
                    </div>
                </Link>

                <Link to={`/admin/management-subject/${id}/clo-plo`}>
                    <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                        <div className={` ${isActive(`/admin/management-subject/${id}/clo-plo`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                            CLO_PLO
                        </div>
                    </div>
                </Link>

                <Link to={`/admin/management-subject/${id}/clo/create`}>
                    <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                        <div className={` ${isActive(`/admin/management-subject/${id}/clo/create`) ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                            Tạo mới
                        </div>
                    </div>
                </Link>
            </div>
            <div className="px-5 mt-5 flex justify-end items-start relative">
                <div className="sticky left-0 top-0 z-50 block sm:hidden lg:hidden xl:hidden">
                    <table>
                        <thead>
                            <tr>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569] text-[#fefefe]">CLO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clos.map((clo_item, index) => (
                                <tr key={index} className="w-full h-full">
                                    <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                        <Tooltip title={clo_item.description} color={'#ff9908'}>
                                            <span>{clo_item.cloName}</span>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="h-full w-[400px] sm:w-[640px] lg:w-full xl:w-full overflow-auto">
                    <table className="border-collapse table-auto w-full">
                        <thead>
                            <tr>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block bg-[#475569]  text-[#fefefe]">CLO</th>
                                {plos.map((plo_item, index) => (
                                    <th key={index} className="p-2 lg:w-[8%] xl:w-[8%] text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569]  text-[#fefefe]">
                                        <Tooltip title={plo_item.description} color={'#ff9908'}>
                                            <span>{plo_item.ploName}</span>
                                        </Tooltip>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clos.map((clo_item, index) => (
                                <tr key={index} className="w-full h-full">
                                    <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block">
                                        <Tooltip title={clo_item.description} color={'#ff9908'}>
                                            <span>{clo_item.cloName}</span>
                                        </Tooltip>
                                    </td>
                                    {plos.map((plo_item) => {
                                        const isFound = comparePloClos.some(
                                            (item) => item.plo_id === plo_item.plo_id && item.clo_id === clo_item.clo_id
                                        );
                                        const found = isFound ? true : false;
                                        return (
                                            <td key={plo_item.plo_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={found}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        handleCheckboxChange(plo_item.plo_id, clo_item.clo_id, isChecked);
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>

            </div>
            <div className="w-full flex justify-center items-center">
                <Button color="primary" onClick={handleSaveOrDelete} className="mt-5 px-20 w-[300px]">
                    Lưu
                </Button>

            </div>

        </div>
    );
}


export default CloPlo;
