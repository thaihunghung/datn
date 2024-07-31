import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from '@nextui-org/react';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Tooltip, message } from 'antd';
import slugify from 'slugify';
import { Flex, Progress } from 'antd';

import { PlusIcon } from './PlusIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { SearchIcon } from './SearchIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { columns, fetchAssessmentData } from './Data/DataAssessment';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalCreateAssessment from './ModalCreateAssessment';
import ModalUpdateAssessment from './ModalUpdateAssessment';
import ModalOpenPdf from './ModalOpenPdf';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['description', 'status', 'courseName', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['description', 'status', 'action'];
const ManagementAssessment = (nav) => {
  const { setCollapsedNav } = nav;
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const descriptionString = searchParams.get('description');
  let descriptionURL;

  if (descriptionString) {
    try {
      const decodedDescription = decodeURIComponent(descriptionString);
      descriptionURL = decodedDescription;
      // console.log(descriptionURL); // Logging the result
    } catch (error) {
      console.error('Error processing description:', error);
    }
  }

  const teacher_id = Cookies.get('teacher_id');
  if (!teacher_id) {
    navigate('/login');
  }
  useEffect(() => {
    getAllRubricIsDeleteFalse()
    getCourseByTeacher()
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
  const [courseFilter, setCourseFilter] = useState('');

  const [assessments, setAssessment] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  });
  const [dateFilter, setDateFilter] = useState('newest');
  const [page, setPage] = useState(1);
  const loadAssessment = async () => {
    const response = await fetchAssessmentData(teacher_id);
    console.log(response);
    setAssessment(response);
  };
  useEffect(() => {
    loadAssessment();
    console.log("assessments loaded", assessments);
  }, [page, rowsPerPage, filterValue]);

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
        teacher.courseName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
   
    if (dateFilter === 'newest') {
      filteredAssessment.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateFilter === 'oldest') {
      filteredAssessment.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return filteredAssessment;
  }, [assessments, filterValue, dateFilter]);

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
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  function replaceCharacters(description) {
    let result = description.replace(/ /g, "_");
    result = result.replace(/-/g, "_");
    result = result.replace(/___/g, "_");
    result = result.toLowerCase();
    result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    result = result.replace(/_+/g, "_");
    result = result.replace(/^_+|_+$/g, "");
    return result;
  }

  const renderCell = React.useCallback((assessment, columnKey) => {
    const cellValue = assessment[columnKey];

    switch (columnKey) {
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'courseName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{assessment.courseName}</p>
          </div>
        );
      case 'assessmentCount':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>

        );
      case 'studentCount':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'status':
        return (
          <div className="flex flex-col">
            <div className="text-sm min-w-[100px]">

              <Flex vertical gap="middle">
                <Progress

                  percent={cellValue}
                  status="active"
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                />
              </Flex>
            </div>
          </div>
        );
      case 'action':
        const disc = replaceCharacters(cellValue);
        return (
          <div className="flex items-center justify-center w-full gap-2">

            <Tooltip title="Chấm điểm">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className='bg-[#FF9908]'
                onClick={() => handleNavigate(
                  `/admin/management-grading/${disc}/?description=${cellValue}`
                )}
              >
                <i className="fa-solid fa-feather-pointed text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip title="PDF">
              <Tooltip title="In phiếu chấm">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  className='bg-[#FEFEFE]'
                  onClick={() => { handleAddClickPDF(assessment.RubicData, assessment.RubicItemsData) }}
                >
                  <i className="fa-regular fa-file-pdf text-xl text-[#020401]"></i>
                </Button>
              </Tooltip>
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className="bg-[#AF84DD]"
                onClick={() => { handleEditClick(assessment.Assessment, assessment.description) }}
              >
                <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip title="Xoá">
              <Button
                className="bg-[#FF8077]"
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                onClick={() => { onOpen(); setDeleteId(assessment.action); }}
              >
                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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


  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className='block sm:hidden'>
          <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Assessments</h1>
        </div>
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
            {/* <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
              onClick={() => handleNavigate(
                `/admin/management-grading/create`
              )}
            >
              Tạo mới
            </Button> */}
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
            <span className="text-default-500">{assessments.length}</span> assessment(s)
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
  const [deleteId, setDeleteId] = useState(null);

  const handleSoftDeleteByDescription = async (description) => {
    const data = {
      descriptions: [description],
      isDelete: true
    }
    try {
      await axiosAdmin.put('/assessments/softDeleteByDescription', data );
      message.success(`Successfully toggled soft delete for assessments`);
      loadAssessment();
    } catch (error) {
      console.error(`Error toggling soft delete for assessments`, error);
      message.error(`Error toggling soft delete for assessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };
  const [editPDF, setEditPDF] = useState({});
  const [isAddModalOpenPDF, setIsAddModalOpenPDF] = useState(false);
  const handleAddClickPDF = (DataRubricPDF, DataRubricItems) => {
    setRubicDataPDF(DataRubricPDF)
    setDataRubricItems(DataRubricItems)
    setIsAddModalOpenPDF(true);
  };
  const [DataRubricPDF, setRubicDataPDF] = useState({});
  const [DataRubricItems, setDataRubricItems] = useState([]);
  

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editRubric, setEditRubric] = useState({
    course_id: '',
    rubric_id: '',
    description: '',
    place: '',
    date: ''
  });

  const handleEditFormSubmit = async () => {
    console.log("description:", oldDescription)

    console.log("description", editRubric)
    if (editRubric.description.includes('/')) {
      message.error("Description cannot contain '/' character.");
      return; 
  }

      
    try {
        const response = await axiosAdmin.patch('/assessments/updateByDescription', {
            description: oldDescription,
            updateData: editRubric
        });
        loadAssessment(); 
        message.success('Assessment updated successfully');
    } catch (error) {
        console.error("Error updating assessment:", error);
        message.error("Error updating assessment: " + (error.response?.data?.message || 'Internal server error'));
    }
};

  const [oldDescription, setOldDescription] = useState('')
  const handleEditClick = (Assessment, description) => {
    console.log("assessment", Assessment);
    console.log("description", description);
    setEditRubric(Assessment);
    setOldDescription(description)
    setIsEditModalOpen(true);
  };

  const [DataCourse, setCourseByTeacher] = useState([]);
  const [filterRubicData, setfilterRubicData] = useState([]);
  
  const getAllRubricIsDeleteFalse = async () => {
    try {
      const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
      const updatedRubricData = response.data.rubric.map((rubric) => {
        const status = {
          status: rubric.RubricItem.length === 0 ? false : true,
          _id: rubric.rubric_id
        };
        return {
          rubric_id: rubric.rubric_id,
          rubricName: rubric.rubricName,
          status: status,
          point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
          action: rubric.rubric_id
        };
      });
      setfilterRubicData(updatedRubricData);
      console.log(updatedRubricData);
    } catch (error) {
      console.error("Error: " + error.message);
      message.error('Error fetching Rubric data');
    }
  };
  
  const getCourseByTeacher = async () => {
    try {
      const response = await axiosAdmin.get(`/course/getByTeacher/${teacher_id}`);
      console.log(response.data.course);
      if (response.data) {
        setCourseByTeacher(response.data.course);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      message.error('Error fetching course');
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <ModalCreateAssessment
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        load={loadAssessment}
      />


      <ModalOpenPdf
        isOpen={isAddModalOpenPDF}
        onOpenChange={setIsAddModalOpenPDF}
        editRubric={editPDF}
        DataRubric={DataRubricPDF}
        DataRubricItems={DataRubricItems}
      />

      <ModalUpdateAssessment
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditFormSubmit}
        editRubric={editRubric}
        setEditRubric={setEditRubric}
        DataCourse={DataCourse}
        filterRubicData={filterRubicData}
      />
      <ConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onConfirm={() => {
          if (deleteId) {
            handleSoftDeleteByDescription(deleteId);
            setDeleteId(null);
          }
        }}
      />
      <div className='w-full flex justify-between'>
        <div className='h-full my-auto p-5 hidden sm:block'>
          <div>
            <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Assessments</h1>
          </div>
          <BackButton />
        </div>
        <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-start items-center flex gap-4 flex-col mb-4'>
          <div className='flex justify-center w-full flex-wrap items-center gap-1'>
            <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
              onClick={handleAddClick}
            >
              New
            </Button>

            <Button
              endContent={<PlusIcon />}
              onClick={() => handleNavigate(
                `/admin/management-grading/store`
              )}
            >
              Store
            </Button>
          </div>

          <div className='flex gap-2 h-fit justify-center sm:justify-start flex-wrap items-center'>
            <div className='flex gap-1 h-fit justify-start'>
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Columns
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
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Filter Date
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Date Filter"
                  closeOnSelect={true}
                  selectedKeys={new Set([dateFilter])}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] || 'newest';
                    setDateFilter(selectedKey);
                  }}
                >
                  <DropdownItem key="newest" className="capitalize">Newest</DropdownItem>
                  <DropdownItem key="oldest" className="capitalize">Oldest</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
            </div>
          </div>

        </div>
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
        //selectionMode="multiple"
        selectionMode="none"
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
    </>
  );
};

export default ManagementAssessment;

function ConfirmAction(props) {
  const { isOpen, onOpenChange, onConfirm } = props;
  const handleOnOKClick = (onpose) => {
    onpose();
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
        {(onpose) => (
          <>
            <ModalHeader>Cảnh báo</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                Assessment sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onpose}>
                Huỷ
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onpose)}>
                Xoá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

