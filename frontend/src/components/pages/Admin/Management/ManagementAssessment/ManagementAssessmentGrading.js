import React, { useEffect, useState } from 'react';
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

import { PlusIcon } from './PlusIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { SearchIcon } from './SearchIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { columns, fetchAssessmentDataGrading, statusOptions } from './DataAssessmentGrading';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import BackButton from '../../Utils/BackButton/BackButton';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['totalScore', 'action', 'class', 'student'];
const COMPACT_VISIBLE_COLUMNS = ['student', 'action'];

const ManagementAssessmentGrading = (nav) => {
  const { setCollapsedNav } = nav;
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');
  if (!teacher_id) {
    navigate('/login');
  }
  const location = useLocation();
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

  const [assessments, setAssessment] = useState([]);
  const [ValidKeys, setValidKeys] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [Couse_id, setCouse_id] = useState();
  const [rubric_id, setRubric_id] = useState();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);

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

    const handleVisibilityChange = () => { 
      if (window.innerWidth < 500) {
        setVisibleColumns(new Set(COMPACT_VISIBLE_COLUMNS)); // Thay đổi visibleColumns khi cửa sổ nhỏ
      } else {
        setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS)); // Trả lại visibleColumns khi cửa sổ lớn
      }
    }
    handleVisibilityChange();
    console.log(window.innerWidth)


    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadTeachers = async () => {
      const { Assessment, Rubric_id, Course_id, Classes } = await fetchAssessmentDataGrading(teacher_id, descriptionURL, filterValue);
      setAssessment(Assessment);
      setRubric_id(Rubric_id);
      setCouse_id(Course_id);
      setClasses(Classes);
    };
    loadTeachers();
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
        teacher.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      // Tìm đối tượng trong statusOptions có totalScore khớp với statusFilter
      const selectedStatus = statusOptions.find(option =>
        option.totalScore === statusFilter // So sánh totalScore của tùy chọn với giá trị của statusFilter
      );
      if (selectedStatus) {
        filteredAssessment = filteredAssessment.filter((teacher) =>
          teacher.totalScore === selectedStatus.totalScore
        );
      }
    }

    if (classFilter !== 'all') {
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.class === classFilter
      );
    }

    return filteredAssessment;
  }, [assessments, filterValue, statusFilter, classFilter]);

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


  const getSelectedItems = () => {
    const selectedItems = assessments.filter((item) => selectedKeys.has(item.id.toString()));
    //console.log('Get Selected Items', selectedItems);
    return selectedItems;
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
  const renderCell = React.useCallback((assessment, columnKey) => {
    const cellValue = assessment[columnKey];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.id}</p> */}
          </div>
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'class':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>

        );
      case 'totalScore':
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[assessment.totalScore]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case 'student':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{assessment.student.studentCode}</p>
            <p className="text-bold text-small capitalize">{assessment.student.name}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );

      case 'action':
        return (
          <div className="flex items-center justify-center w-full gap-2">
            {assessment.action.totalScore === 0 ? (
              <Tooltip title="Chấm điểm">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  className='bg-[#AF84DD]'
                  onClick={() => handleNavigate(
                    `/admin/management-grading/${slugify(assessment.action.description, { lower: true, replacement: '_' })}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`
                  )}
                >
                  <i className="fa-solid fa-feather-pointed text-xl text-[#020401]"></i>
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Chỉnh sửa">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  className='bg-[#FF9908]'
                  onClick={() => handleNavigate(
                    `/admin/management-grading/update/${slugify(assessment.action.description, { lower: true, replacement: '_' })}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`
                  )}
                >
                  <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Xoá">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className='bg-[#FF8077]'
                onClick={() => { onOpen(); }}
              >
                {/* setDeleteId(assessment.action.assessment_id); */}
                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>

          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const getStudentCode = (data, key) => {
    for (let item of data) {
      // && item.totalScore === 0
      if (item.id === key) {
        return {
          Assessment: key,
          studentCode: item.student.studentCode
        }
      }
    }
    return null;
  };

  const checkstotalscore = (data, key) => {
    for (let item of data) {
      if (item.id === key) {
        return {
          assessment_id: key,
          totalScore: item.totalScore,
          checktotalScore: item.totalScore === 0 ? true : false
        };
      }
    }
    return null;
  };


  useEffect(() => {
    console.log('Selected keys have changed:', Array.from(selectedKeys));
    // Ensure `getSelectedItems` uses the latest `selectedKeys`
    const selectedItems = getSelectedItems();
    console.log('Selected Items after keys changed:', selectedItems);
  }, [selectedKeys]);

  const navigateGradingGroup = () => {
    setTimeout(() => {
      const selectedItems = getSelectedItems();
      //console.log('Selected Items after timeout:', selectedItems);
      if (selectedItems.length === 0) {
        message.error('Please select at least one student');
        return;
      }
      if (selectedItems.length > 4) {
        message.error('Please select no more than 4 students');
        return;
      }

      const ids = selectedItems.map(item => item.id);


      const checkStotalScore = ids.map((key) => checkstotalscore(assessments, key));
      const hasUncheckedAssessment = checkStotalScore.some((item, index) => {
        if (item.checktotalScore === false) {
          message.error(`Sinh viên đã chọn thứ ${index + 1} đã chấm điểm.`);
          return true;
        }
        return false;
      });

      if (hasUncheckedAssessment) {
        return;
      }
      const listStudentCodes = ids.map((key) => getStudentCode(assessments, key));
      // console.log("checkStotalScore");
      // console.log(checkStotalScore);
      // console.log("listStudentCodes");
      // console.log(listStudentCodes);
      const studentCodesString = encodeURIComponent(JSON.stringify(listStudentCodes));
      const disc = replaceCharacters(descriptionURL);
      // console.log("studentCodesString");
      // console.log(studentCodesString);
      // console.log("disc");
      // console.log(disc);
      navigate(`/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}`);
    }, 100);
  };

  function replaceCharacters(description) {
    // Replace spaces with underscores
    let result = description.replace(/ /g, "_");
    // Replace hyphens with underscores
    result = result.replace(/-/g, "_");
    return result;
  }

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
        <div className="flex justify-between gap-3 items-end">
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
  }, [filterValue, assessments, rowsPerPage, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange]);

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className='w-full flex justify-between'>
        <div className='h-full my-auto p-5 hidden sm:block'>
          <BackButton />
        </div>
        <div className='w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-start items-center flex gap-4 flex-col mb-4'>
          <div className='flex justify-center w-full flex-wrap items-center gap-1'>
            <Button
              className='bg-[#FF9908] '
              onClick={() => {
                //const selectedItems = getSelectedItems();
                //console.log('Selected Items:', selectedItems);
                //console.log('Selected Keys:', Array.from(selectedKeys));
                navigateGradingGroup();
              }}
              endContent={<PlusIcon />}
            >
              Chấm nhóm
            </Button>
            <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
            >
              Tạo mới
            </Button>
            <Button
              className='bg-[#FF8077] '
              endContent={<PlusIcon />}
            >
              Xóa
            </Button>
            <Button
              endContent={<PlusIcon />}
            >
              kho lưu trữ
            </Button>

          </div>

          
          <div className='flex gap-1 justify-start'>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                  Lọc trạng thái
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={true}
                selectedKeys={new Set([statusFilter === 'all' ? 'all' : statusFilter.toString()])} // Chuyển đổi thành Set
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] || 'all';
                  setStatusFilter(selectedKey === 'all' ? 'all' : parseInt(selectedKey, 10));
                }}
              >
                <DropdownItem key="all" className="capitalize">All Statuses</DropdownItem>
                {statusOptions.map((option) => (
                  <DropdownItem key={option.totalScore} className="capitalize">
                    {option.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
                  Lọc lớp
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Class Filter"
                closeOnSelect={true}
                selectedKeys={new Set([classFilter])} // Chuyển đổi classFilter thành Set
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] || 'all';
                  setClassFilter(selectedKey);
                }}
              >
                <DropdownItem key="all" className="capitalize">All Classes</DropdownItem>
                {classes.map((classOption) => (
                  <DropdownItem key={classOption.value} className="capitalize">
                    {classOption.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
        selectionMode="multiple"
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                  egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManagementAssessmentGrading;


