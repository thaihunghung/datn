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

import { PlusIcon } from './PlusIcon';
import { VerticalDotsIcon } from './VerticalDotsIcon';
import { SearchIcon } from './SearchIcon';
import { ChevronDownIcon } from './ChevronDownIcon';
import { columns, fetchAssessmentDataGrading, fetchDataCheckTeacherAllot, fetchStudentDataByCourseId, statusOptions } from './Data/DataAssessmentGrading';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalCreateOneAssessment from './ModalCreateOneAssessment';
import CustomUpload from '../../CustomUpload/CustomUpload';

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
  const [StudentAll, setStudentAll] = useState([]);
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [editRubric, setEditRubric] = useState({
    teacher_id: "",
    course_id: "",
    rubric_id: "",
    description: "",
    student_id: "",
    place: "",
    date: "",
  });
  const [filterValue, setFilterValue] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [fileList, setFileList] = useState([]);
  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
  };



  const params = new URLSearchParams(window.location.search);
  const filterScore = params.get('FilterScore');


  const [statusFilter, setStatusFilter] = useState(filterScore ? filterScore : 'all');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [Couse_id, setCouse_id] = useState();
  const [rubric_id, setRubric_id] = useState();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);

  // const params = new URLSearchParams(window.location.search);
  // const filterScore = params.get('FilterScore');

  // // Cập nhật state nếu có giá trị 'FilterScore'
  // if (filterScore) {
  //   setStatusFilter(filterScore);
  // //  setSelectedKeys(new Set([filterScore]));
  // }

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





  const [RubricArray, setRubricArray] = useState([]);
  const [CourseArray, setCourseArray] = useState([]);
  const loadTeachers = async () => {
    const { metaAssessment, Rubric_id, Course_id, Classes, RubricArray, CourseArray } = await fetchAssessmentDataGrading(teacher_id, descriptionURL, filterValue);
    console.log("metaAssessment");
    console.log(metaAssessment);
    setAssessment(metaAssessment);
    setRubric_id(Rubric_id);
    setCouse_id(Course_id);
    setClasses(Classes);

    setRubricArray(RubricArray);
    setCourseArray(CourseArray);
  };

  useEffect(() => {
    loadTeachers();
  }, [page, rowsPerPage, filterValue]);

  useEffect(() => {
    const checkTeacherExistence = async () => {
      try {
        const teacher_id = Cookies.get('teacher_id');
        const meta_assessment_id = assessments[0]?.meta_assessment_id;
        const exist = await fetchDataCheckTeacherAllot(teacher_id, meta_assessment_id);

        if (exist.exists) {
          message.success("Teacher exists in the assessment.");
        } else {
          message.error("Teacher does not exist in the assessment.");
          handleNavigate('/admin/management-grading')
        }
      } catch (error) {
        console.error("Error checking teacher existence:", error.message);
      }
    };
    if (teacher_id && assessments[0]?.id)
      checkTeacherExistence();
  }, [assessments]);



  const loadStudentAllCourse = async (Couse_id) => {
    try {
      const response = await fetchStudentDataByCourseId(Couse_id);
      setStudentAll(response);

    } catch (error) {
      console.error("Error loading student data:", error);
    }
  };
  useEffect(() => {
    loadStudentAllCourse(Couse_id);
  }, [Couse_id]);

  useEffect(() => {
    if (Array.isArray(StudentAll) && Array.isArray(assessments)) {
      const filtered = StudentAll.filter(student =>
        !assessments.some(assessment => assessment.student.student_id === student.student_id)
      );
      setFilteredStudents(filtered);
    }
  }, [StudentAll, assessments]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleFormSubmit = async () => {
    console.log("description", editRubric);
    if (!editRubric.student_id || editRubric.student_id.length === 0) {
      message.error('Please select at least one student.');
      return;
    }

    try {
      for (const studentId of editRubric.student_id) {
        const data = {
          teacher_id: editRubric.teacher_id || "",
          course_id: editRubric.course_id || "",
          rubric_id: editRubric.rubric_id || "",
          description: editRubric.description || "",
          student_id: studentId,
          place: editRubric.place,
          date: editRubric.date,
        };

        const response = await axiosAdmin.post('/assessment', { data: data });
        console.log('Assessment response:', response.data);
      }
      loadTeachers();
      setEditRubric((prev) => ({
        ...prev,
        student_id: "",
      }));
      message.success('Assessment updated successfully');
    } catch (error) {
      console.error("Error updating assessment:", error);
      message.error("Error updating assessment: " + (error.response?.data?.message || 'Internal server error'));
    }
  };


  const handleAddClick = () => {

    console.log(editRubric);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (assessments) {
      setEditRubric((prev) => ({
        ...prev,
        description: assessments[0]?.action?.description,
      }));
      setEditRubric((prev) => ({
        ...prev,
        date: assessments[0]?.action?.date,
      }));
      setEditRubric((prev) => ({
        ...prev,
        place: assessments[0]?.action?.place,
      }));
      setEditRubric((prev) => ({
        ...prev,
        rubric_id: assessments[0]?.action?.rubric_id,
      }));
      setEditRubric((prev) => ({
        ...prev,
        course_id: assessments[0]?.action?.course_id,
      }));
      setEditRubric((prev) => ({
        ...prev,
        teacher_id: assessments[0]?.action?.teacher_id,
      }));
    }
  }, [assessments]);

  const [deleteId, setDeleteId] = useState(null);

  const pages = Math.ceil(assessments.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const uniqueSortedDisription = useMemo(() => {
    const desriptionSet = new Set();
    assessments.forEach(item => desriptionSet.add(item.description));
    const uniqueDesriptionsArray = Array.from(desriptionSet);

    // Hàm so sánh tùy chỉnh để sắp xếp theo phần số cuối
    uniqueDesriptionsArray.sort((a, b) => {
        const numA = parseInt(a.match(/\d+$/));
        const numB = parseInt(b.match(/\d+$/));
        return numA - numB;
    });
    // console.log("uniqueDesriptionsArray")
    // console.log(assessments)
    return uniqueDesriptionsArray;
}, [assessments]);


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
      // Chuyển đổi statusFilter thành số
      const statusFilterNumber = parseInt(statusFilter, 10);

      // Lọc các đối tượng dựa trên totalScore
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.totalScore === statusFilterNumber
      );
    }

    if (classFilter !== 'all') {
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.class === classFilter
      );
    }

    if (descriptionFilter && descriptionFilter !== '') {
      filteredAssessment = filteredAssessment.filter(item =>
          item.description === descriptionFilter
      );
      }

    return filteredAssessment;
  }, [assessments, filterValue, statusFilter, classFilter, descriptionFilter]);

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
      case 'generalDescription':
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
        const disc = replaceCharacters(assessment.action.description);
        const urlcreate = statusFilter === 0 ? `/admin/management-grading/${disc}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}?FilterScore=0`
          :
          `/admin/management-grading/${disc}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`

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
                    urlcreate
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
                    statusFilter === 0 ?
                      `/admin/management-grading/update/${disc}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}?FilterScore=0`
                      :
                      `/admin/management-grading/update/${disc}/student-code/${assessment.action.studentCode}/assessment/${assessment.action.assessment_id}/rubric/${assessment.action.rubric_id}`

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
                onClick={() => { onOpen(); setDeleteId(assessment.action.assessment_id) }}
              >
                {/* ; */}
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
      const url = statusFilter === 0 ? `/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}&&FilterScore=0` : `/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}`
      navigate(url);
    }, 100);
  };

  const handleDownloadTemplateExcel = async () => {

    const assessmentMetaIds = assessments.map(item => item.meta_assessment_id);
    if (assessmentMetaIds.length === 0) {
      message.error(`Không tồn tại sinh viên`);
    }

    try {
      const data = { id: assessmentMetaIds };
      console.log("data");
      console.log(data);
      const response = await axiosAdmin.post('meta-assessment/templates/data', { data: data }, {
        responseType: 'blob'
      });


      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'UpdateDescription.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };



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
  const handleSoftDelete = async () => {
    const data = {
      assessment_id: Array.from(selectedKeys),
    };
    console.log(data)
    try {
      const response = await axiosAdmin.delete('/assessments/multiple', { params: data });

      await loadTeachers();

      message.success(response.data.message);
    } catch (error) {
      console.error("Error deleting:", error);
      message.error('Error deleting');
    }
  };

  const handleSoftDeleteById = async (_id) => {
    try {
      const response = await axiosAdmin.delete(`/assessment/${_id}`);
      await loadTeachers();
      message.success(response.data.message);
    } catch (error) {
      console.error(`Error toggling delete for with ID ${_id}:`, error);
      message.error(`Error toggling delete for with ID ${_id}`);
    }
  };

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
              Group
            </Button>
            <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
              onClick={handleAddClick}
            >
              New
            </Button>
            <Button
              className='bg-[#FF8077] '
              endContent={<PlusIcon />}
              onClick={onOpen}
              disabled={selectedKeys.size === 0}
            >
              Deletes
            </Button>

          </div>


          <div className='flex gap-1 justify-start'>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                  Filter score
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
                  Filter class
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
            <Dropdown>
                            <DropdownTrigger className="sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                    Filter by PLO
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Filter by PLO"
                                closeOnSelect={true}
                                selectedKeys={new Set([descriptionFilter])} // Chuyển đổi descriptionFilter thành Set
                                selectionMode="single"
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] || ''; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                                    setDescriptionFilter(selectedKey);
                                }}
                            >
                                <DropdownItem key="" className="capitalize">
                                    All PLOs
                                </DropdownItem>
                                {uniqueSortedDisription.map((ploName) => (
                                    <DropdownItem key={ploName} className="capitalize">
                                        {ploName}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
          </div>

        </div>
      </div>
      <ConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onConfirm={() => {
          if (deleteId) {
            handleSoftDeleteById(deleteId);
            setDeleteId(null);
          } else if (selectedKeys.size > 0) {
            handleSoftDelete();
            setSelectedKeys(new Set());
          }
        }}
      />
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
      <div className="flex flex-wrap gap-6 justify-center items-start">


        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tải Mẫu CSV</h3>
          <Button
            className="bg-sky-500 text-white w-[125px] disabled:opacity-50"
            onClick={handleDownloadTemplateExcel}
          //disabled={!newRubric.rubric_id}
          >
            Tải Sinh viên
          </Button>
        </div>




        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload File</h3>
          <label htmlFor="file-upload" className="cursor-pointer w-[125px]">
            <Button className="w-full bg-blue-500 text-white" auto flat as="span" color="primary">
              Chọn file
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
          />
          {fileList.length > 0 && (
            <div className="mt-2 w-full">
              <ul className="space-y-2">
                {fileList.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                  >
                    <p className="text-gray-700">{file.name}</p>
                    <Button
                      auto
                      flat
                      color="error"
                      size="xs"
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={() => handleRemoveFile(index)}
                    >
                      X
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Lưu file</h3>
          <CustomUpload
            endpoint={'/meta-assessment/updateDescription'}
            fileList={fileList}
            setFileList={setFileList}
            LoadData={loadTeachers}
          />
        </div>
      </div>
      <ModalCreateOneAssessment
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleFormSubmit}
        editRubric={editRubric}
        setEditRubric={setEditRubric}
        DataCourse={CourseArray}
        RubicData={RubricArray}
        StudentData={filteredStudents}
      />
    </>
  );
};

export default ManagementAssessmentGrading;


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
                Assessment sẽ được xóa và không thể khôi phục lại, tiếp tục thao tác?
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