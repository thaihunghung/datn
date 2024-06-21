import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Pagination,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  SelectItem,
  Avatar,
  ModalContent,
  Tooltip,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import './Course.css';
import CustomUpload from "../../CustomUpload/CustomUpload";

const Course = (props) => {
  const { setCollapsedNav, successNoti, errorNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCourses, setTotalCourses] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [form, setForm] = useState({
    courseName: "",
    class_id: "",
    teacher_id: "",
    subject_id: "",
    semester_id: "",
    academic_year_id: "",
    yearX: "",
    yearY: "",
  });

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYear] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredAcademicYears, setFilteredAcademicYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicYearSearchText, setAcademicYearSearchText] = useState("");
  const [showYearInputs, setShowYearInputs] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);

  const toggleYearInputs = () => setShowYearInputs(!showYearInputs);

  const getAcronym = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  useEffect(() => {
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
  }, [setCollapsedNav]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAdmin.get("/course-course-enrollment");
        setCourses(response.data);
        setFilteredCourses(response.data);
        setTotalCourses(response.data.length);
      } catch (err) {
        console.error("Error fetching courses: ", err.message);
        successNoti('Error fetching courses', 'Please try again later');
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axiosAdmin.get("/class");
        setClasses(response.data);
        setFilteredClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes: ", err.message);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosAdmin.get("/teacher");
        setTeachers(response.data);
      } catch (err) {
        console.error("Error fetching teachers: ", err.message);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosAdmin.get("/subjects");
        setSubjects(response.data);
        setFilteredSubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects: ", err.message);
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await axiosAdmin.get("/semester");
        setSemesters(response.data);
      } catch (err) {
        console.error("Error fetching semesters: ", err.message);
      }
    };

    const fetchAcademicYear = async () => {
      try {
        const response = await axiosAdmin.get("/academic-year");
        setAcademicYear(response.data);
        setFilteredAcademicYears(response.data);
      } catch (err) {
        console.error("Error fetching academic year: ", err.message);
      }
    };

    fetchCourses();
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
    fetchSemesters();
    fetchAcademicYear();
  }, [successNoti, isEditModalOpen, isMoreModalOpen, isSettingsModalOpen]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
  };

  const handleEditSubmit = async () => {
    console.log("save", form)
    try {
      const selectedClass = classes.find(cls => cls.class_id === form.class_id);
      const selectedSubject = subjects.find(subject => subject.subject_id === form.subject_id);

      if (!selectedClass || !selectedSubject) {
        throw new Error("Invalid class or subject selection");
      }

      const data = {
        courseName: form.courseName,
        class_id: form.class_id,
        teacher_id: form.teacher_id,
        subject_id: form.subject_id,
        semester_id: form.semester_id,
        academic_year_id: form.academic_year_id,
        // id_semester_academic_year: form.id_semester_academic_year,
        courseCode: `${selectedClass.classCode} - ${selectedSubject.subjectCode}`
      };

      await axiosAdmin.put(`/course/${selectedCourse.course_id}`, { data: data });
      successNoti('Update Successful', 'The course has been updated successfully.');
      const response = await axiosAdmin.get("/course-course-enrollment");
      setCourses(response.data);
      setFilteredCourses(response.data);
      setTotalCourses(response.data.length);
      handleCloseEditModal();
    } catch (err) {
      console.error("Error updating course: ", err.message);
      successNoti('Error updating course', 'Please try again later.');
    }
  };

  const handleSaveAcademicYear = async () => {
    console.log("vao")
    try {
      const response = await axiosAdmin.post('/academic-year', { data: form.yearX })

      if (response.status === 201) {
        successNoti("Tạo năm học mới thành công")
        setForm(prevForm => ({
          ...prevForm,
          academic_year_id: response.data.academic_year_id,
        }));
      }

      if (response.status === 200) {
        successNoti(`Đã chọn ${response.data.description}`)
        setForm(prevForm => ({
          ...prevForm,
          academic_year_id: response.data.academic_year_id,
        }));
      }
    } catch (error) {
      errorNoti("Năm không hợp lệ")
      console.error('Error saving academic year:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenSettingsModal = (course) => {
    setSelectedCourse(course);
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenEditModal = (course) => {
    console.log("form click", form)
    setSelectedCourse(course);
    setForm({
      courseName: course.courseName,
      class_id: course.class_id,
      teacher_id: course.teacher_id,
      subject_id: course.subject_id,
      semester_id: course.SemesterAcademicYear.semester.semester_id,
      academic_year_id: course.SemesterAcademicYear.academic_year.academic_year_id,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenMoreModal = (course) => {
    setSelectedCourse(course);
    setIsMoreModalOpen(true);
  };

  const handleCloseMoreModal = () => {
    setIsMoreModalOpen(false);
    setSelectedCourse(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const filteredCoursesForCards = filteredCourses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.class.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * pageSize;
  const indexOfFirstCourse = indexOfLastCourse - pageSize;
  const currentCourses = filteredCoursesForCards.slice(indexOfFirstCourse, indexOfLastCourse);

  const validateYear = (value) => {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10;
    const yearPattern = /^(19|20)\d{2}$/;
    return yearPattern.test(value) && parseInt(value) >= 1900 && parseInt(value) <= maxYear;
  };

  const isInvalid = React.useMemo(() => {
    if (form.yearX === "") return false;
    return validateYear(form.yearX) ? false : true;
  }, [form.yearX]);

  const handleYearXChange = (e) => {
    const yearX = e.target.value;
    setForm({
      ...form,
      yearX: yearX,
      yearY: yearX ? String(parseInt(yearX) + 1) : ''
    });
  };

  //More modal

  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get(`/course-enrollment/course/${selectedCourse.course_id}/student`, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Student.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };


  return (
    <>
      <nav className="text-lg mb-4 text-left">
        <Link to="/admin" className="text-blue-500 hover:underline">Home</Link>
        <span> / Course</span>
      </nav>
      <h2>Course List</h2>

      <Input
        clearable
        bordered
        fullWidth
        placeholder="Search courses, class, teacher"
        css={{ mb: 20 }}
        onChange={handleSearch}
      />

      <div className="grid grid-cols-2 gap-5 m-5">
        {currentCourses.map((course) => (
          <div key={course.course_id}>
            <Card bordered>
              <CardHeader>
                <Link to={`${course.course_id}`}>
                  <div className="flex flex-col items-center justify-center h-[85px] w-full bg-gray-200 text-[24px] text-[#1890ff]
                    lg:h-[160px] lg:w-[200px] lg:text-[36px]
                    md:h-[120px] md:w-[150px] md:text-[32px]
                    ms:h-[100px] ms:w-[130px] ms:text-[28px]
                    ">
                    {course.subject.subjectName.charAt(0)}
                  </div>
                </Link>
                <div className="flex-1 ml-4">
                  <p>{`${course.courseCode} ${course.courseName}`}</p>
                  <p>{course.class.className}</p>
                  <p>{course.teacher.name}</p>
                </div>
              </CardHeader>
              <CardBody>
                <p>{`${course.SemesterAcademicYear.semester.descriptionShort} - ${course.SemesterAcademicYear.academic_year.description}`}</p>
                <p>{`Số học sinh: ${course.enrollmentCount}`}</p>
              </CardBody>
              <CardFooter className="flex gap-5">
                {/* <Tooltip>
                  <Button onClick={() => handleOpenSettingsModal(course)}>Ẩn</Button>
                </Tooltip> */}
                <Tooltip content="Các thao tác với sinh viên">
                  <Button onClick={() => handleOpenMoreModal(course)}>Student</Button>
                </Tooltip>
                <Tooltip content="Chỉnh sửa môn học">
                  <Button onClick={() => handleOpenEditModal(course)}>Edit</Button>
                </Tooltip>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <Pagination
        total={totalCourses}
        initialPage={currentPage}
        pageSize={pageSize}
        onChange={handlePageChange}
        css={{ mt: '16px', textAlign: 'center' }}
      />

      {/* Settings Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        size="2xl"
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#fefefe] dark:bg-[#19172c] text-[#292f46]",
          // header: "border-b-[1px] border-[#292f46]",
          // footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
              <ModalBody>
                <p>
                  Settings content goes here.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={handleCloseSettingsModal}>
                  Close
                </Button>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={handleCloseSettingsModal}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isEditModalOpen}
        onOpenChange={(isOpen) => setIsEditModalOpen(isOpen)}
        radius="lg"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#fefefe] dark:bg-[#19172c] text-[#292f46]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Course</ModalHeader>
              <ModalBody>
                <Input
                  clearable
                  bordered
                  fullWidth
                  label="Course Name"
                  name="courseName"
                  value={form.courseName}
                  onChange={handleFormChange}
                  css={{ mb: 20 }}
                />
                <Select
                  labelPlacement="outside"
                  variant="underlined"
                  label="Học phần"
                  placeholder="Lựa chọn học phần"
                  defaultSelectedKeys={[form.subject_id]}
                  value={form.class_id}
                  onChange={(e) => setForm({ ...form, subject_id: parseInt(e.target.value) })}
                  css={{ mb: 20 }}
                >
                  {subjects.map((item) => (
                    <SelectItem key={item.subject_id} value={item.subject_id}>
                      {item.subjectName}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex items-center mb-4 justify-end">
                  {showYearInputs == false && (
                    <Select
                      variant="underlined"
                      labelPlacement="outside"
                      label="Năm học"
                      placeholder="Chọn năm học"
                      defaultSelectedKeys={[form.academic_year_id]}
                      value={form.academic_year_id}
                      onChange={(e) => setForm({ ...form, academic_year_id: parseInt(e.target.value) })}
                      css={{ mb: 20 }}
                    >
                      {academicYears.map((item) => (
                        <SelectItem key={item.academic_year_id} value={item.academic_year_id}>
                          {item.description}
                        </SelectItem>
                      ))}
                    </Select>
                  )}

                  <Tooltip showArrow={true} content="Click để tạo năm học mới">
                    <Button
                      isIconOnly
                      onClick={toggleYearInputs}
                      className="ml-2">
                      <i class="fa-solid fa-plus"></i>
                    </Button>
                  </Tooltip>

                </div>
                {showYearInputs && (
                  <div>
                    <div className="absolute -mt-14 text-small font-semibold">
                      Nhập năm bắt đầu, năm kết thúc tự động tăng 1
                    </div>
                    <div className="flex justify-between items-center gap-2 mt-0 justify-items-center">
                      <p>Năm học</p>
                      <div className="flex items-center gap-4 w-[80%] justify-items-center text-center text-sm">
                        <Input
                          className="text-center"
                          isInvalid={isInvalid}
                          type="number"
                          label="Năm bắt đầu"
                          value={form.yearX}
                          onChange={handleYearXChange}
                          variant="bordered"
                        />
                        <p> - </p>
                        <Input
                          isInvalid={isInvalid}
                          type="number"
                          label="Năm kết thúc"
                          readOnly
                          value={form.yearY}
                          onChange={(e) => setForm({ ...form, yearY: e.target.value })}
                          variant="bordered"
                        />
                        <Button onClick={() => handleSaveAcademicYear()}>
                          Chọn
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Select
                  variant="underlined"
                  labelPlacement="outside"
                  label="Học ký"
                  placeholder="Chọn học kỳ"
                  defaultSelectedKeys={[form.semester_id]}
                  value={form.semester_id}
                  onChange={(e) => setForm({ ...form, semester_id: parseInt(e.target.value) })}
                  css={{ mb: 20 }}
                >
                  {semesters.map((item) => (
                    <SelectItem key={item.semester_id} value={item.semester_id}>
                      {item.descriptionLong}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  labelPlacement="outside"
                  label="Lớp học"
                  placeholder="Chọn lớp học"
                  defaultSelectedKeys={[form.class_id]}
                  value={form.class_id}
                  onChange={(e) => setForm({ ...form, class_id: parseInt(e.target.value) })}
                  css={{ mb: 20 }}
                >
                  {classes.map((item) => (
                    <SelectItem key={item.class_id} value={item.class_id}>
                      {item.className}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  items={teachers}
                  onChange={(e) => setForm({ ...form, teacher_id: parseInt(e.target.value) })}
                  value={form.teacher_id}
                  defaultSelectedKeys={[form.teacher_id]}
                  label="Assigned to"
                  placeholder="Select a user"
                  labelPlacement="outside"
                  classNames={{
                    base: "max-w-xs",
                    trigger: "h-12",
                  }}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.data.key} className="flex items-center gap-2">
                        <Avatar
                          alt={item.data.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={item.data.imgURL}
                        />
                        <div className="flex flex-col">
                          <span>{item.data.name}</span>
                          <span className="text-default-500 text-tiny">({item.data.email})</span>
                        </div>
                      </div>
                    ));
                  }}
                >
                  {(teacher) => (
                    <SelectItem key={teacher.teacher_id} textValue={teacher.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar alt={teacher.name} className="flex-shrink-0" size="sm" src={teacher.imgURL} />
                        <div className="flex flex-col">
                          <span className="text-small">{teacher.name}</span>
                          <span className="text-tiny text-default-400">{teacher.email}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                {/* Add other fields similarly */}
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={handleCloseEditModal}>
                  Close
                </Button>
                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20" onPress={handleEditSubmit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* More Modal */}
      <Modal
        size="2xl"
        backdrop="opaque"
        isOpen={isMoreModalOpen}
        onOpenChange={setIsMoreModalOpen}
        radius="lg"
        classNames={{
          body: "py-6",
          // backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#fefefe] dark:bg-[#19172c] text-[#292f46]",
          // header: "border-b-[1px] border-[#292f46]",
          // footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Môn học {selectedCourse.courseCode} - {selectedCourse.courseName}</ModalHeader>
              <ModalBody>
                <div>Thêm học sinh bằng file excel</div>
                <div className="flex justify-between m-1">
                  <div className="card p-3">
                    <h3>Tải Mẫu CSV</h3>
                    <Button onClick={handleDownloadTemplateExcel}> Tải xuống mẫu </Button>
                  </div>
                  <div className="card p-3">
                    <div>
                      <h3>Upload File</h3>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button auto flat as="span" color="primary">
                          Select File
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                      />
                      {/* Display the filenames below the button */}
                      {/* Display the filenames below the button with a remove button */}
                      {fileList.length > 0 && (
                        <div className="mt-2">
                          <ul>
                            {fileList.map((file, index) => (
                              <li key={index} className="flex justify-between items-center">
                                <p>{file.name}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card p-3">
                    <h3>Upload Data</h3>
                    <CustomUpload
                      Data={selectedCourse.course_id}
                      endpoint='course-enrollment'
                      method="POST"
                      fileList={fileList}
                      setFileList={setFileList}
                      setCurrent={setCurrent}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="foreground" variant="light" onPress={handleCloseMoreModal}>
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

export default Course;
