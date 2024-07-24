// MangementRubricItems.js

import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Tooltip, message } from 'antd';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input,
    Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, Pagination,
    useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
}
    from '@nextui-org/react';
// import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { PlusIcon } from '../ManagementAssessment/PlusIcon';
import { VerticalDotsIcon } from '../ManagementAssessment/VerticalDotsIcon';
import { SearchIcon } from '../ManagementAssessment/SearchIcon';
import { ChevronDownIcon } from '../ManagementAssessment/ChevronDownIcon';
import { capitalize } from '../../Utils/capitalize';

import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubricItems from "../../Utils/DropdownAndNav/DropdownAndNavRubricItems";
import Cookies from "js-cookie";
import { columns, fetchRubricItemsData } from "./DataRubricItems";
import CreateRubicItems from "./CreateRubicItems";
import BackButton from "../../Utils/BackButton/BackButton";
import ModalUpdateRubric from "./ModalUpdateRubric";
import ModalUpdateRubicItems from "./ModalUpdateRubicItems";
const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['ploName', 'cloName', 'chapterName', 'description', 'maxScore', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['description', 'action'];

const MangementRubricItems = (nav) => {
    const [assessments, setAssessment] = useState([]);


    const [CloData, setCloData] = useState([]);
    const [PloData, setPloData] = useState([]);

    
    const [ChapterData, setChapterData] = useState([]);
    
    const [filterValue, setFilterValue] = useState('');
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'age',
        direction: 'ascending',
    });

    const { id } = useParams();
    const { setCollapsedNav } = nav;

    const location = useLocation();
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const handleNavigate = (path) => {
        navigate(path);
    };

    // const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const handleOpenModalCreate = () => setIsOpenModalCreate(true);


    const handleCloseModalCreate = () => setIsOpenModalCreate(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRubric, setEditRubric] = useState({
        rubricsItem_id: "",
        chapter_id: "",
        clo_id: "",
        rubric_id: "",
        plo_id: "",
        description: "",
        maxScore: "",
        stt: "",
    });








    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicItemsData, setRubicItemsData] = useState([]);
    const [rubicData, setRubicData] = useState({});
    const [page, setPage] = useState(1);
    const pages = Math.ceil(assessments.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = React.useMemo(() => {
        let filteredAssessment = [...assessments];

        if (hasSearchFilter) {
            filteredAssessment = filteredAssessment.filter((teacher) =>
                teacher.description.toLowerCase().includes(filterValue.toLowerCase())
            );
        }


        return filteredAssessment;
    }, [assessments, filterValue]);
    const handleSelectionChange = (keys) => {
        // console.log('Keys:', keys);
        if (keys === 'all') {
            const startIndex = (page - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentPageUsers = filteredItems.slice(startIndex, endIndex).map(user => user.id.toString());
            setSelectedKeys(prevKeys => {
                const newKeys = new Set(currentPageUsers);
                // console.log('Setting new keys:', Array.from(newKeys));
                return newKeys;
            });
            return;
        }

        const keysArray = Array.isArray(keys) ? keys : Array.from(keys);
        const validKeys = keysArray.filter(key => typeof key === 'string' && !isNaN(key));
        //console.log('Valid Keys:', validKeys);
        setSelectedKeys(prevKeys => {
            const newKeys = new Set(validKeys);
            // console.log('Setting new keys:', Array.from(newKeys));
            return newKeys;
        });
    };
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);
    const [currentTeacher, setCurrentTeacher] = useState(null);


    

    const handleEditClick = (rubricitems, chapters, plos) => {
        console.log('handleEditClick');
        // console.log(chapters);
        // console.log(plos);
        setPloData(plos)
        setChapterData(chapters)
        setEditRubric(rubricitems);
      setIsEditModalOpen(true);
    };
    ///////////table content
    const renderCell = React.useCallback((rubric, columnKey) => {
        const cellValue = rubric[columnKey];

        switch (columnKey) {
            case 'description':
                return (
                    <div className="flex flex-col text-bold text-justify text-small capitalize min-w-[300px] max-w-[400px]"
                        dangerouslySetInnerHTML={{ __html: cellValue }}>
                    </div>
                );
            case 'ploName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.ploName.ploName}</p>
                        <p className="text-bold text-small capitalize">{rubric.ploName.description}</p>
                    </div>
                );
            case 'cloName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.cloName.cloName}</p>
                        <p className="text-bold text-small capitalize">{rubric.cloName.description}</p>
                    </div>
                );
            case 'chapterName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.chapterName.chapterName}</p>
                        <p className="text-bold text-small capitalize">{rubric.chapterName.description}</p>
                    </div>
                );
            case 'maxScore':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );

            case 'action':
                return (
                    <div className="flex items-center justify-center w-full gap-2">
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                                className="bg-[#AF84DD]"
                                onClick={() => {
                                     handleEditClick(rubric.rubricsItem, rubric.chapters, rubric.plos) 
                                }}
                                // onClick={() => handleNavigate(
                                //     `/admin/management-rubric/${id}/rubric-items/${rubric.action.id}`
                                // )}
                            >
                                <i className="fa-solid fa-pen"></i>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                size="sm"
                                //onClick={() => { onOpen(); setDeleteId(rubric.action.rubric_id); }}
                                className="bg-[#FF8077]"
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-center">
                    <Input
                        isClearable
                        classNames={{ base: 'w-full sm:max-w-[44%]', inputWrapper: 'border-1' }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">

                        {/* <Tooltip
            title=""
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button
              className="flex justify-center items-center p-4"
              isIconOnly
              variant="light"
              radius="full"
              onClick={()=>{
                //getSelectedItems
                //console.log('Option selected',());
                
                navigateGradingGroup(ValidKeys)
              }
              
              }
            >
              <span className="text-[#475569] text-lg font-bold">Chấm theo nhóm</span>
            </Button>
          </Tooltip> */}
                    </div>
                </div>
                <div className="w-full flex  sm:items-center sm:justify-between">
                    <p className="text-small text-default-400 min-w-[100px]">
                        <span className="text-default-500">{assessments.length}</span> teacher(s)
                    </p>
                    <div className="w-fit sm:w-auto flex items-center gap-2 ">
                        <p className="text-small text-default-400">Rows per page:</p>
                        <select
                            className="w-fit sm:w-auto rounded-lg border-default-200 bg-default-100 text-small transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            onChange={onRowsPerPageChange}
                            value={rowsPerPage}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, assessments, rowsPerPage, visibleColumns, onSearchChange, onRowsPerPageChange]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <p className="text-small">
                    {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${assessments.length} selected`}
                </p>
                <Pagination
                    showControls
                    isCompact
                    page={page}
                    total={pages}
                    onChange={(newPage) => setPage(newPage)}
                />
            </div>
        );
    }, [page, pages, selectedKeys, assessments]);

    useEffect(() => {
        //getAllAssessmentIsDeleteFalse()
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
        };
        handleResize();
        console.log(window.innerWidth)
        const handleVisibilityChange = () => {
            if (window.innerWidth < 500) {
                setVisibleColumns(new Set(COMPACT_VISIBLE_COLUMNS)); // Thay đổi visibleColumns khi cửa sổ nhỏ
            } else {
                setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS)); // Trả lại visibleColumns khi cửa sổ lớn
            }
        }
        handleVisibilityChange();

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const loadRubric = async () => {
            const { updatedRubricData, DataCLOArray,RubricData} = await fetchRubricItemsData(id);
            setAssessment(updatedRubricData);
            setCloData(DataCLOArray);
            setRubicData(RubricData);
        };
        loadRubric();
        // console.log("assessments loaded", assessments);
    }, [page, rowsPerPage, filterValue]);

    // const columns = [
    //     {
    //         title: "Tên CLO",
    //         dataIndex: "cloName",
    //         render: (record) => (
    //             <Tooltip color={"#FF9908"}
    //                 title={record.description}>
    //                 <div className="text-sm">
    //                     <p className="font-medium">{record.cloName}</p>
    //                 </div>
    //             </Tooltip>
    //         ),
    //     },
    //     {
    //         title: "Tên PLO",
    //         dataIndex: "ploName",
    //         render: (record) => (
    //             <div className="text-sm">
    //                 <Tooltip color={"#FF9908"}
    //                     title={record.description}>
    //                     <p className="font-medium">{record.ploName}</p>
    //                 </Tooltip>
    //             </div>
    //         ),
    //     },
    //     {
    //         title: "Tên Chapter",
    //         dataIndex: "chapterName",
    //         render: (record) => (
    //             <div className="text-sm">
    //                 <Tooltip color={"#FF9908"}
    //                     title={record.description}>
    //                     <p className="font-medium">{record.chapterName}</p>
    //                 </Tooltip>
    //             </div>
    //         ),
    //     },
    //     {
    //         title: "Tiêu chí",
    //         dataIndex: "description",
    //         render: (record) => (
    //             <div className="text-sm text-justify text-wrap w-[500px]" dangerouslySetInnerHTML={{ __html: record }}></div>

    //         ),
    //     },
    //     {
    //         title: "Điểm",
    //         dataIndex: "maxScore",
    //         render: (record) => (
    //             <div className="text-sm">
    //                 <p className="font-medium">{record}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         title: (
    //             <div className="flex items-center justify-center w-full">
    //                 <span>Form</span>
    //             </div>
    //         ),
    //         dataIndex: "action",
    //         render: (record) => (
    //             <div className="flex items-center justify-center w-full gap-2">
    //                 <Link to={`/admin/management-rubric/${id}/rubric-items/${record.id}`}>
    //                     <Tooltip title="Chỉnh sửa">
    //                         <Button
    //                             isIconOnly
    //                             variant="light"
    //                             radius="full"
    //                             size="sm"
    //                         >
    //                             <i className="fa-solid fa-pen"></i>
    //                         </Button>
    //                     </Tooltip>
    //                 </Link>
    //                 <Tooltip title="Xoá">
    //                     <Button
    //                         isIconOnly
    //                         variant="light"
    //                         radius="full"
    //                         size="sm"
    //                     // onClick={() => { onOpen(); setDeleteId(record.id); }}
    //                     >
    //                         <i className="fa-solid fa-trash-can"></i>
    //                     </Button>
    //                 </Tooltip>

    //             </div>
    //         ),
    //     },

    // ];
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


    //dem va create
    const GetRubicAndItemsById = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}/items?isDelete=false`);
            const rubric = response.data?.rubric || {};

            const RubricData = {
                rubricName: rubric?.rubricName || 'Unknown',
                subjectName: rubric?.subject?.subjectName || 'Unknown',
            };


            let count = 1;
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


                const action = {
                    id: item?.rubricsItem_id || 'Unknown',
                    number: count++
                }

                return {
                    key: item?.rubricsItem_id || 'Unknown',
                    cloName: clo,
                    ploName: plo,
                    chapterName: chapter,
                    description: item?.description || 'Unknown',
                    maxScore: item.maxScore,
                    action: action
                };
            }) || [];
            console.log(updatedRubricData);
            setRubicItemsData(updatedRubricData);
            setRubicData(RubricData);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching Rubric data');
        }
    };



    const handleEditFormSubmit = async (values, teacher_id) => {
        console.log("editRubric");
        console.log(editRubric);
        // if (!teacher_id) {
        //   console.error("No teacher selected for editing");
        //   return;
        // }

        // try {
        //   const res = await axiosAdmin.put(`/teacher/${teacher_id}`, { data: values });
        //   successNoti(res.data.message);
        //   setIsEditModalOpen(false);
        //   const { teachers, total } = await fetchTeachersData(page, rowsPerPage, filterValue);
        //   setTeachers(teachers);
        //   setTotalTeachers(total);
        // } catch (error) {
        //   console.error("Error updating teacher:", error);
        //   if (error.response && error.response.data && error.response.data.message) {
        //     errorNoti(error.response.data.message);
        //   } else {
        //     errorNoti("Error updating teacher");
        //   }
        // }
    };
    return (
        <>
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-start items-center flex gap-4 flex-col mb-4'>
                    <div className='flex justify-center w-full flex-wrap items-center gap-1'>
                        <Button
                            className='bg-[#AF84DD] '
                            endContent={<PlusIcon />}
                            // onClick={() => handleNavigate(
                            //     `/admin/management-rubric/create`
                            // )}

                            onClick={handleOpenModalCreate}
                        >
                            New
                        </Button>
                        <Button
                            className='bg-[#FF8077]'
                            endContent={<PlusIcon />}
                        // onClick={onOpen}
                        >
                            Delete
                        </Button>


                        <Button
                            endContent={<PlusIcon />}
                        >
                            store
                        </Button>

                    </div>



                    <div className='flex gap-1 h-fit justify-start'>
                        <Dropdown>
                            <DropdownTrigger className="sm:flex">
                                <Button endContent={<ChevronDownIcon className="font-semibold" />} size="sm" variant="flat">
                                    
                                    <span className="font-medium">Columns</span> 
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize text-base">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="sm:flex">
                                <Button endContent={<ChevronDownIcon className="font-semibold" />} size="sm" variant="flat">
                                   <span className="font-medium">Filter</span> 
                                </Button>
                            </DropdownTrigger>

                        </Dropdown>
                    </div>

                </div>
            </div>
            <div className="p-5 w-full flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-lg w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">Tên học phần:{' ' + rubicData.rubricName}</div>
                <div className="text-lg w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">Tên rubric:{' ' + rubicData.subjectName}</div>
            </div>
            <Table
                aria-label="Example table with dynamic content"
                bottomContent={bottomContent}
                classNames={{
                    base: 'overflow-visible',
                    wrapper: 'min-h-[400px]',
                    table: 'overflow-visible',
                    th: 'text-small',
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                // selectionMode="none"
                sortDescriptor={sortDescriptor}
                onSelectionChange={handleSelectionChange}
                onSortChange={setSortDescriptor}
                topContent={topContent}
            >

                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            // align={column.uid === 'actions' ? 'center' : 'start'}
                            align={'center'}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ModalUpdateRubicItems
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editRubric={editRubric}
                setEditRubric={setEditRubric}
                CloData={CloData}
                ChapterData={ChapterData}  
                PloData={PloData} 
                //DataSubject={DataSubject}
            />
            <CreateRubicItems onOpen={handleOpenModalCreate} isOpen={isOpenModalCreate} onClose={handleCloseModalCreate} />


        </>

    );
}

export default MangementRubricItems;



