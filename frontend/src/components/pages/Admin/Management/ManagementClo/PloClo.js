// PloClo.js
import { useEffect, useState } from "react";
import { Tooltip } from 'antd';
import { Link } from "react-router-dom";

import {
    Button,
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

import "./modify_h_full.css"
const PloClo = (nav) => {
    const { setCollapsedNav } = nav;  
    const [clos, setClos] = useState([]);
    const [plos, setPlos] = useState([]);
    const [PloClos, setPloClos] = useState([]);
    const [comparePloClos, setComparePloClos] = useState([]);
    const [hidden, setHidden] = useState(false);

    const GetAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plo');
            setPlos(response.data)
        } catch (error) {
            console.error('Error fetching PLOs:', error);
        }
    };
    const GetAllClo = async () => {
        try {
            const response = await axiosAdmin.get('/clo/subject/1');
            setClos(response.data);
        } catch (error) {
            console.error('Error fetching clos:', error);
        }
    };

   
    const handleSaveOrDelete = async () => {
        let luu = [];
        let xoa = [];
        // Lọc các phần tử trong setComparePloClos mà không có trong setPloClos để lưu
        luu = comparePloClos.filter(compareItem => {
            return !PloClos.some(PloCloItem => PloCloItem.clo_id === compareItem.clo_id && PloCloItem.plo_id === compareItem.plo_id);
        });
    
        // Lọc các phần tử trong setPloClos mà không có trong setComparePloClos để xóa
        xoa = PloClos.filter(PloCloItem => {
            return !comparePloClos.some(compareItem => compareItem.clo_id === PloCloItem.clo_id && compareItem.plo_id === PloCloItem.plo_id);
        });
    
        if (luu.length > 0) {
            console.log("Save:", luu);
            try {
                const response = await axiosAdmin.post('/plo-clo/SaveOrDelete', { dataSave: luu });
                console.log(response.data);
            } catch (error) {
                console.log("Error:", error);
            }
        }
        if (xoa.length > 0) {
            console.log("Delete:", xoa);
            try {
                const response = await axiosAdmin.post('/plo-clo/SaveOrDelete', { dataDelete: xoa });
                console.log(response.data);
            } catch (error) {
                console.log("Error:", error);
            }
        }
    }
    
    const GetAllPloClo = async () => {
        try {
            const response = await axiosAdmin.get('/plo-clo');
            const id_plo_clos = response.data.map(item => ({ clo_id: item.clo_id, plo_id: item.plo_id }));
            console.log(id_plo_clos);

            setPloClos(response.data.map(item => ({id_plo_clo: item.id_plo_clo, clo_id: item.clo_id, plo_id: item.plo_id })));
            setComparePloClos(response.data.map(item => ({ clo_id: item.clo_id, plo_id: item.plo_id })))
            //console.log(response.data)
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
        GetAllPlo();
        GetAllPloClo();
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
        <div className="flex w-full flex-col justify-center leading-8 p-5 sm:p-5 lg:p-10 xl:p-10 bg-[#f5f5f5]-500">
            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to={"/admin/management-program"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            DS Chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/store"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Kho lưu trữ
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/create"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Tạo chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/update"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                        update
                        </div>
                    </Link>
                    <Link to={"/admin/management-program/po-plo"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            PO-PLO
                        </div>
                    </Link>
                    
                </div>
            </div>

            <div className="w-full border mt-5 rounded-lg">
                <table className="table-auto w-full border-collapse border">
                    <thead>
                        <tr>
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white">STT</th>
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white">PLO</th>
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white hidden sm:hidden lg:block xl:block">Nội dung</th>
                            {clos.map((clo_item) => (
                                <th key={clo_item.clo_id} className="p-2 lg:w-[8%] xl:w-[8%] text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-slate-600 text-white">                        
                                    <Tooltip title={clo_item.description} color={'yellow'}>
                                        <span>{clo_item.cloName}</span>
                                    </Tooltip>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                            {plos.map((plo_item, index) => (
                                <tr key={index} className="w-full h-full">
                                    {/* p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 */}
                                <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                {index + 1}
                                </td>
                                    <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                        <span className="hidden sm:hidden lg:block xl:block">{plo_item.ploName}</span>
                                        <Tooltip title={plo_item.description} 
                                            color={'yellow'}
                                            className="block sm:block lg:hidden xl:hidden"
                                        >
                                            <span>{plo_item.ploName}</span>
                                        </Tooltip>
                                    </td>
                                    <td className="border p-2 text-left sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:hidden lg:block xl:block">
                                        <span className="w-[100px]">{plo_item.description}</span>
                                    </td>
                                    {clos.map((clo_item) => {
                                        const isFound = comparePloClos.some(
                                            (item) => item.plo_id === plo_item.plo_id && item.clo_id === clo_item.clo_id
                                        );
                                        const found = isFound ? true : false;
                                        return (
                                            <td key={clo_item.clo_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
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
                <Button color="primary" onClick={handleSaveOrDelete} className="mt-5 px-20">
                    Lưu
                </Button>
            </div>
        </div>
    );
}


export default PloClo;
