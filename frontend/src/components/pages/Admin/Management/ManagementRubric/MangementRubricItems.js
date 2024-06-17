// MangementRubricItems.js

import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Table, Tooltip, Button, message } from 'antd';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubricItems from "../../Utils/DropdownAndNav/DropdownAndNavRubricItems";
import CreateRubicItems from "./CreateRubicItems";

const MangementRubricItems = (nav) => {
    const { id } = useParams();

    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { setCollapsedNav} = nav;
    // const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [isOpenModal1, setIsOpenModal1] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);

  const handleOpenModal1 = () => setIsOpenModal1(true);
  const handleCloseModal1 = () => setIsOpenModal1(false);

  const handleOpenModal2 = () => setIsOpenModal2(true);
  const handleCloseModal2 = () => setIsOpenModal2(false);



    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicItemsData, setRubicItemsData] = useState([]);
    const [rubicData, setRubicData] = useState({});

    const [deleteId, setDeleteId] = useState(null);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    const columns = [
        {
            title: "Tên CLO",
            dataIndex: "cloName",
            render: (record) => (
                <Tooltip color={"#FF9908"}
                    title={record.description}>
                    <div className="text-sm">
                        <p className="font-medium">{record.cloName}</p>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Tên PLO",
            dataIndex: "ploName",
            render: (record) => (
                <div className="text-sm">
                    <Tooltip color={"#FF9908"}
                        title={record.description}>
                        <p className="font-medium">{record.ploName}</p>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Tên Chapter",
            dataIndex: "chapterName",
            render: (record) => (
                <div className="text-sm">
                    <Tooltip color={"#FF9908"}
                        title={record.description}>
                        <p className="font-medium">{record.chapterName}</p>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Tiêu chí",
            dataIndex: "description",
            render: (record) => (
                <div className="text-sm text-justify text-wrap w-[500px]" dangerouslySetInnerHTML={{ __html: record }}></div>

            ),
        },
        {
            title: "Điểm",
            dataIndex: "maxScore",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center justify-center w-full">
                    <span>Form</span>
                </div>
            ),
            dataIndex: "action",
            render: (_id) => (
                <div className="flex items-center justify-center w-full gap-2">
                    <Link to={`/admin/management-rubric/${id}/rubric-items/${_id}`}>
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                            >
                                <i className="fa-solid fa-pen"></i>
                            </Button>
                        </Tooltip>
                    </Link>
                    <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm"
                            // onClick={() => { onOpen(); setDeleteId(_id); }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Tooltip>

                </div>
            ),
        },

    ];

    //dem va create
    const GetRubicAndItemsById = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}/items/isDelete/false`);
            const rubric = response.data?.rubric || {};
    
            const RubricData = {
                rubricName: rubric?.rubricName || 'Unknown',
                subjectName: rubric?.subject?.subjectName || 'Unknown',
            };
            console.log(RubricData);
    
            const updatedRubricData = rubric?.rubricItems?.map((item) => {
                const clo = {
                    cloName: item?.CLO?.cloName || 'Unknown',
                    description: item?.CLO?.description || 'No description',
                };
                const plo = {
                    ploName: item?.PLO?.ploName || 'Unknown',
                    description: item?.PLO?.description || 'No description',
                };
                const chapter = {
                    chapterName: item?.Chapter?.chapterName || 'Unknown',
                    description: item?.Chapter?.description || 'No description',
                };
                return {
                    key: item?.rubricsItem_id || 'Unknown',
                    cloName: clo,
                    ploName: plo,
                    chapterName: chapter,
                    description: item?.description || 'Unknown',
                    maxScore: item.maxScore,
                    action: item?.rubricsItem_id || 'Unknown',
                };
            }) || [];
    
            setRubicItemsData(updatedRubricData);
            setRubicData(RubricData);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching Rubric data');
        }
    };
    
    useEffect(() => {
        GetRubicAndItemsById()
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
            <DropdownAndNavRubricItems />
            <div className="my-5 flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-lg leading-8 italic font-bold text-[#FF9908] flex-1 text-justify">Tên học phần:{' '+rubicData.rubricName}</div>
                <div className="text-lg  leading-8 italic font-bold text-[#FF9908]  flex-1 text-justify">Tên rubric:{' '+rubicData.subjectName}</div>
            </div>
            <div className="flex flex-col">
                <div className="Quick__Option flex justify-between items-center sticky top-2 z-50 w-fit bg-[#fefefe]">
                        <div className={`w-fit p-2 rounded-lg border-2 bg-[#475569]`}>
                            <p className={`text-lg text-[#fefefe] text-left`}>Danh sách</p>
                        </div>
                    <div onClick={handleOpenModal1} className={`cursor-pointer w-fit p-2 rounded-lg border-2 border-[#FF8077] hover:bg-[#AF84DD]`}>
                        <p className={`text-lg text-[#475569] text-left w-full h-full`}>Tạo mới</p>
                    </div>
                </div>
                <div className="w-full">
                    {selectedRowKeys.length !== 0 && (
                        <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                            <p className="text-sm font-medium">
                                <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                                Đã chọn {selectedRow.length} rubric
                            </p>
                            <div className="flex items-center gap-2">

                                <Tooltip 
                                    title={`Xoá ${selectedRowKeys.length} rubric`}
                                    getPopupContainer={() =>
                                        document.querySelector(".Quick__Option")
                                    }
                                >
                                    {/* <Button isIconOnly variant="light" radius="full" onClick={onOpen}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </Button> */}
                                </Tooltip>
                                <Tooltip
                                    title="Bỏ chọn"
                                    getPopupContainer={() =>
                                        document.querySelector(".Quick__Option")
                                    }
                                >
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        radius="full"
                                        onClick={() => {
                                            handleUnSelect();
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark text-[18px]"></i>
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    )}
                    <div className="w-fit overflow-auto">
                        <Table className="table-po text-[#fefefe]"
                            bordered
                            loading={loading}
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={rubicItemsData}
                        />
                    </div>
                    <CreateRubicItems onOpen={handleOpenModal1} isOpen={isOpenModal1} onClose={handleCloseModal1} />
                    
                    {/* <CreateRubicItems onOpen={onOpen} isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} loadData={GetRubicAndItemsById}/> */}
                </div>
            </div>
        </div>
    );
}

export default MangementRubricItems;
