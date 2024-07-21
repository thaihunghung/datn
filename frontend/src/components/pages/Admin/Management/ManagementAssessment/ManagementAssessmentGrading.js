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
import { columns, fetchAssessmentData, statusOptions } from './Data';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['totalScore','action', 'class','student'];

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
      console.log(descriptionURL); // Logging the result
    } catch (error) {
      console.error('Error processing description:', error);
    }
  }

  const [teachers, setTeachers] = useState([]);
  const [filterValue, setFilterValue] = useState('');
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
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const loadTeachers = async () => {
      const { Assessment, Rubric_id, Course_id } = await fetchAssessmentData(teacher_id, descriptionURL, filterValue);
      setTeachers(Assessment);
      setRubric_id(Rubric_id)
      setCouse_id(Course_id)
 
    };
    loadTeachers();
  }, [page, rowsPerPage, filterValue]);

  const pages = Math.ceil(teachers.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAssessment = [...teachers];
    if (hasSearchFilter) {
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.description.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== 'all') {
      const selectedStatus = statusOptions.find(option => statusFilter.has(option.uid));
      if (selectedStatus) {
        filteredAssessment = filteredAssessment.filter((teacher) =>
          teacher.totalScore === selectedStatus.totalScore
        );
      }
    }


    return filteredAssessment;
  }, [teachers, filterValue, statusFilter]);

  const handleSelectionChange = (keys) => {
    console.log('Keys received in handler:', keys);

    if (keys === 'all') {
      // Xác định các mục trên trang hiện tại
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const currentPageUsers = filteredItems.slice(startIndex, endIndex).map(user => user.id.toString());

      setSelectedKeys(new Set(currentPageUsers));
      return;
    }

    const keysArray = Array.isArray(keys) ? keys : Array.from(keys);
    console.log('Keys converted to array:', keysArray);
    const validKeys = keysArray.filter(key => typeof key === 'string' && !isNaN(key));
    console.log('Valid Keys:', validKeys);

    setSelectedKeys(new Set(validKeys));
  };

  const getSelectedItems = () => {
    return teachers.filter((item) => selectedKeys.has(item.id.toString()));
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
            {assessment.action.totalScore === 0 ? (<Link to={`/admin/management-grading/${slugify(assessment.action.description, { lower: true, replacement: '_' })}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`}>
              <Tooltip title="Chấm điểm">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  className='bg-[#AF84DD]'
                >
                  <i className="fa-solid fa-feather-pointed"></i>
                </Button>
              </Tooltip>
            </Link>) : (<Link to={`/admin/management-grading/update/${slugify(assessment.action.description, { lower: true, replacement: '_' })}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`}>
              <Tooltip title="Chỉnh sửa">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  className='bg-[#FF9908]'
                >
                  <i className="fa-solid fa-pen"></i>
                </Button>
              </Tooltip>
            </Link>)}


            <Tooltip title="Xoá">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className='bg-[#FF8077]'
                onClick={() => { onOpen();  }}
              >
                {/* setDeleteId(assessment.action.assessment_id); */}
                <i className="fa-solid fa-trash-can"></i>
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
      if (item.key === key ) {
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
      if (item.key === key) {
        return {
          assessment_id: key,
          totalScore: item.totalScore,
          checktotalScore: item.totalScore === 0 ? true : false
        };
      }
    }
    return null;
  };

  const [currentSelectedKeys, setCurrentSelectedKeys] = useState(new Set());

  useEffect(() => {
    // Cập nhật currentSelectedKeys khi selectedKeys thay đổi
    setCurrentSelectedKeys(selectedKeys);
  }, [selectedKeys]);



  const navigateGradingGroup = () => {
    setTimeout(() => {
      const keysArray = Array.from(selectedKeys);
      const numericKeys = keysArray.map(key => parseInt(key, 10));
  
      console.log(numericKeys);
      console.log("keysArray");
      console.log(keysArray);
      console.log("teachers");
  
      if (keysArray.length === 0) {
        message.error('Please select at least one student');
        return;
      }
      if (keysArray.length > 4) {
        message.error('Please select no more than 4 students');
        return;
      }
  
      const checkStotalScore = keysArray.map((key) => checkstotalscore(teachers, key));
      const listStudentCodes = keysArray.map((key) => getStudentCode(teachers, key));
      console.log(checkStotalScore);
  
      const studentCodesString = encodeURIComponent(JSON.stringify(listStudentCodes));
  
      const disc = replaceCharacters(descriptionURL);
      // navigate(`/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}`);
    }, 0);
  }
  
  

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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                  SV chưa chấm
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                // disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
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
            <Button color="primary" size="sm" startContent={<PlusIcon />}>
              New Teacher
            </Button>
            <Tooltip
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
              onClick={() => {
                navigateGradingGroup();
              }}
            >
              <span className="text-[#475569] text-lg font-bold">Chấm theo nhóm</span>
            </Button>
          </Tooltip>
          </div>
        </div>
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-default-400">
            <span className="text-default-500">{teachers.length}</span> teacher(s)
          </p>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <p className="text-small text-default-400">Rows per page:</p>
            <select
              className="w-full sm:w-auto rounded-lg border-default-200 bg-default-100 text-small transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
  }, [filterValue, teachers, rowsPerPage, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <p className="text-small">
          {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${teachers.length} selected`}
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
  }, [page, pages, selectedKeys, teachers]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
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
                Subject sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?

              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Huỷ
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                Xoá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
