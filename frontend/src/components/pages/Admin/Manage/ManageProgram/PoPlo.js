// PoPlo.js
import { useEffect, useState } from "react";
import { Tooltip } from 'antd';
import { Link } from "react-router-dom";

import {
    Button,
    Modal, Chip,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
const PoPlo = (nav) => {
    const { setCollapsedNav } = nav;
    const { isOpen, onOpenChange } = useDisclosure();
  
    const [pos, setPos] = useState([]);
    const [plos, setPlos] = useState([]);
    const [poPlos, setPoPlos] = useState([]);
    const [comparePoPlos, setComparePoPlos] = useState([]);

    const GetAllPo = async () => {
        try {
            const response = await axiosAdmin.get('/po');
            setPos(response.data);
        } catch (error) {
            console.error('Error fetching POs:', error);
        }
    };

    const GetAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plo');
            setPlos(response.data)
        } catch (error) {
            console.error('Error fetching PLOs:', error);
        }
    };
    const handleSaveOrDelete= async ()=>{
        let luu = [];
        let xoa = [];
        // Lọc các phần tử trong setComparePoPlos mà không có trong setPoPlos để lưu
        luu = comparePoPlos.filter(compareItem => {
            return !poPlos.some(poPloItem => poPloItem.po_id === compareItem.po_id && poPloItem.plo_id === compareItem.plo_id);
        });

        // Lọc các phần tử trong setPoPlos mà không có trong setComparePoPlos để xóa
        xoa = poPlos.filter(poPloItem => {
            return !comparePoPlos.some(compareItem => compareItem.po_id === poPloItem.po_id && compareItem.plo_id === poPloItem.plo_id);
        });

        if(luu.length > 0) {
            console.log("Save:", luu);
            try {
                const response = await axiosAdmin.post('/po-plo/SaveOrDelete', {dataSave: luu})
                console.log(response.data);
            } catch (error) {
                console.log("Error:", error);
            }

        }
        if(xoa.length > 0) {
            console.log("Delete:", xoa);
            try {
                const response = await axiosAdmin.post('/po-plo/SaveOrDelete',{dataDelete: xoa})
                console.log(response.data);
            } catch (error) {
                    console.log("Error:", error);
            }
        }
    }
    const GetAllPoPlo = async () => {
        try {
            const response = await axiosAdmin.get('/po-plo');
            const po_plo_ids = response.data.map(item => ({ po_id: item.po_id, plo_id: item.plo_id }));
            console.log(po_plo_ids);

            setPoPlos(response.data.map(item => ({id: item.id, po_id: item.po_id, plo_id: item.plo_id })));
            setComparePoPlos(response.data.map(item => ({ po_id: item.po_id, plo_id: item.plo_id })))
            //console.log(response.data)
        } catch (error) {
            console.error('Error fetching PO-PLO mappings:', error);
        }
    };
    const [deleteId, setDeleteId] = useState(null);

    // Hàm xử lý thay đổi trạng thái của checkbox
    const handleCheckboxChange = (plo_id, po_id, checked) => {
        if (checked) {
            setComparePoPlos([...comparePoPlos, { plo_id, po_id }]);
        } else {
            setComparePoPlos(comparePoPlos.filter(item => !(item.plo_id === plo_id && item.po_id === po_id)));
        }
    };
    const hangleChangeidDelete = async (id) => {
        try {
            const response = await axiosAdmin.put(`/program/isDelete/${id}`);
            if (response) {
                console.log(response.data.message);
            }
        } catch (err) {
            console.log("Error: " + err.message);
        };
    }

    useEffect(() => {
        GetAllPo();
        GetAllPlo();
        GetAllPoPlo();
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <ConfirmAction
                onOpenChange={onOpenChange}
                isOpen={isOpen}
                onConfirm={() => {
                    if (deleteId) {
                        hangleChangeidDelete(deleteId);
                        setDeleteId(null);
                    }
                }}
            />
            <div>
                <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
                    <Link to={"/admin/manage-program"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            DS Chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/store"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Kho lưu trữ
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/create"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                            Tạo chương trình
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/update"}>
                        <div className="p-5 hover:bg-slate-600 hover:text-white">
                        update
                        </div>
                    </Link>
                    <Link to={"/admin/manage-program/po-plo"}>
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
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:block lg:block xl:block">STT</th>
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">PLO</th>
                            <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:hidden lg:block xl:block">Nội dung</th>
                            {pos.map((po_item) => (
                                <th key={po_item.po_id} className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">                        
                                    <Tooltip title={po_item.description}>
                                        <span>{po_item.poName}</span>
                                    </Tooltip>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {plos.map((plo_item, index) => (
                            <tr key={index}>
                                <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block">{index + 1}</td>
                                <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                    <span className="hidden sm:hidden lg:block xl:block">{plo_item.ploName}</span>
                                    <Tooltip title={plo_item.description} 
                                        className="block sm:block lg:hidden xl:hidden"
                                    >
                                        <span>{plo_item.ploName}</span>
                                    </Tooltip>
                                </td>
                                <td className="border p-2 text-left sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:hidden lg:block xl:block">{plo_item.description}</td>
                                {pos.map((po_item) => {
                                    const isFound = comparePoPlos.some(
                                        (item) => item.plo_id === plo_item.plo_id && item.po_id === po_item.po_id
                                    );
                                    const found = isFound ? true : false;
                                    return (
                                        <td key={po_item.po_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                            <input
                                                type="checkbox"
                                                checked={found}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    handleCheckboxChange(plo_item.plo_id, po_item.po_id, isChecked);
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


export default PoPlo;
function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
    const handleOnOKClick = (onClose) => {
        onClose();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Cảnh báo</ModalHeader>
                        <ModalBody>
                            <p className="text-[16px]">
                                Chương trình sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Huỷ
                            </Button>
                            <Button color="danger" className="font-medium" onPress={() => handleOnOKClick(onClose)}>
                                Xoá
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}