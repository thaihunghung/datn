import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import axios from "axios";
import { columns, fetchTeachersData, permissions } from "./Data";
import { capitalize } from "../../Utils/capitalize";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Link, useNavigate } from "react-router-dom";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "teacherCode", "permissionName", "typeTeacher", "actions"];

export default function App(props) {
  const navigate = useNavigate();
  const { setCollapsedNav, successNoti, errorNoti } = props;
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState(new Set(permissions.map(p => p.id)));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    permission: "",
    typeTeacher: "",
  });
  const [editTeacher, setEditTeacher] = useState({
    id: "",
    name: "",
    email: "",
    permission: "",
    typeTeacher: "",
  });

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    const loadTeachers = async () => {
      const { teachers, total } = await fetchTeachersData(page, rowsPerPage);
      setTeachers(teachers);
      setTotalTeachers(total);
    };

    loadTeachers();
  }, [page, rowsPerPage]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredTeachers = [...teachers];
    console.log("aaa", filteredTeachers)
    console.log("aaar", statusFilter)


    if (hasSearchFilter) {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter.size !== permissions.length) {
      console.log("dd", statusFilter)
      filteredTeachers = filteredTeachers.filter((teacher) =>
        Array.from(statusFilter).includes(teacher.permission.toString())
      );
      console.log("xx", filteredTeachers.permission)
    }

    return filteredTeachers;
  }, [teachers, filterValue, statusFilter]);

  const pages = Math.ceil(totalTeachers / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((teacher, columnKey) => {
    const cellValue = teacher[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: teacher.avatar }}
            description={teacher.email}
            name={cellValue}
          >
            {teacher.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{teacher.team}</p>
          </div>
        );
      case "permissionName":
        const permissionName = permissions.find(p => p.id === cellValue)?.name || cellValue;
        return <span>{permissionName}</span>;
      case "permission":
        return (
          <Chip className="capitalize" color={statusColorMap[teacher.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleViewClick(teacher.teacher_id)}>
                  View
                </DropdownItem>
                <DropdownItem onClick={() => handleEditClick(teacher)}>Edit</DropdownItem>
                <DropdownItem onClick={() => handleDeleteClick(teacher)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleViewClick = (teacherId) => {
    navigate(`${teacherId}/profile`);
  };

  const handleDeleteClick = async () => {
    try {
      const selectedIds = Array.from(selectedKeys).map((key) => ({ id: key }));
      const response = await axiosAdmin.patch('/teachers/delete', { data: selectedIds });
      if (response.status === 200) {
        const { teachers, total } = await fetchTeachersData(page, rowsPerPage);
        setTeachers(teachers);
        setTotalTeachers(total);
        setIsAddModalOpen(false);
        successNoti("Xóa thành công");
        handleClearSelection();
      } else {
        console.error("Failed to delete teacher");
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditClick = (teacher) => {
    setCurrentTeacher(teacher);
    setEditTeacher(teacher); // Set the current teacher data to the editTeacher state
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosAdmin.post("/teacher", newTeacher);
      if (response.status === 200) {
        const { teachers, total } = await fetchTeachersData(page, rowsPerPage);
        setTeachers(teachers);
        setTotalTeachers(total);
        handleClearSelection();
      } else {
        console.error("Failed to add teacher");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleEditFormSubmit = async (values, teacher_id) => {
    if (!teacher_id) {
      console.error("No teacher selected for editing");
      return;
    }

    try {
      const res = await axiosAdmin.put(`/teacher/${teacher_id}`, { data: values });
      successNoti(res.data.message);
      setIsEditModalOpen(false);
      const { teachers, total } = await fetchTeachersData(page, rowsPerPage);
      setTeachers(teachers);
      setTotalTeachers(total);
    } catch (error) {
      console.error("Error updating teacher:", error);
      if (error.response && error.response.data && error.response.data.message) {
        errorNoti(error.response.data.message);
      } else {
        errorNoti("Error updating teacher");
      }
    }
  };

  const handleBlockClick = async () => {
    try {
      const selectedIds = Array.from(selectedKeys).map((key) => ({ id: key }));
      const response = await axiosAdmin.patch('/teachers/block', { data: selectedIds });
      if (response.status === 200) {
        const { teachers, total } = await fetchTeachersData(page, rowsPerPage);
        setTeachers(teachers);
        setTotalTeachers(total);
        setIsAddModalOpen(false);
        successNoti("Chặn thành công");
        handleClearSelection();
      } else {
        console.error("Failed to block teacher");
      }
    } catch (error) {
      console.error('Error blocking teacher:', error);
    }
  };

  const handleDownloadClick = async () => {
    try {
      const selectedIds = Array.from(selectedKeys).map((key) => ({ id: key }));
      const response = await axiosAdmin.post('/teacher/template/data', { data: selectedIds }, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setPage(1);
        handleClearSelection();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedKeys(new Set([]));
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<i className="fa-solid fa-magnifying-glass"></i>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<i className="fa-solid fa-chevron-down"></i>} variant="flat">
                  Permission
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  setStatusFilter(keys === "all" ? new Set(permissions.map(p => p.id)) : keys);
                }}
              >
                {permissions.map((status) => (
                  <DropdownItem key={status.id} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<i className="fa-solid fa-chevron-down"></i>} variant="flat">
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
            <Button color="primary" endContent={<i className="fa-solid fa-plus"></i>} onClick={handleAddClick}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalTeachers} teachers</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    totalTeachers,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page <= 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page >= pages} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

  const selectedItemsBar = useMemo(() => {
    return (
      selectedKeys.size > 0 && (
        <div className="flex justify-between items-center text-[#FEFEFE] bg-[#FF8077] py-2 px-4 rounded-lg mb-4">
          <div>{selectedKeys.size} selected</div>
          <div className="flex gap-3 ">
            <Tooltip showArrow={true} content={`Tải file excel ${selectedKeys.size} giáo viên`}>
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleDownloadClick}>
                Download
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} content={`Chặn ${selectedKeys.size} giáo viên`}>
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleBlockClick}>
                Block
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} content={`Chuyển ${selectedKeys.size} vào thùng rác`}>
              <Button className="text-[#FEFEFE]" variant="light" color="danger" onClick={() => handleDeleteClick()}>
                Delete
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} content="Bỏ chọn">
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleClearSelection}>
                X
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    );
  }, [selectedKeys, handleDownloadClick, handleBlockClick, handleDeleteClick, handleClearSelection]);

  return (
    <>
      {selectedItemsBar}
      <Table
        className="text-left"
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No teachers found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.teacher_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmAction
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleFormSubmit}
        newTeacher={newTeacher}
        setNewTeacher={setNewTeacher}
      />
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditFormSubmit}
        editTeacher={editTeacher}
        setEditTeacher={setEditTeacher}
      />
    </>
  );
}

function ConfirmAction({ isOpen, onOpenChange, onConfirm, message }) {
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
            <ModalHeader>Warning</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                {message}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                Ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function AddTeacherModal({ isOpen, onOpenChange, onSubmit, newTeacher, setNewTeacher }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setNewTeacher((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Add New Teacher</ModalHeader>
            <ModalBody>
              <div>Thêm giáo viên bằng file excel</div>
              <div className="flex justify-between m-1">
                <div className="card p-3">
                  <h3>Tải Mẫu CSV</h3>
                  <Button> Tải xuống mẫu </Button>
                </div>
                <div className="card p-3">
                  <h3>Gửi lại mẫu</h3>
                  <Button> Select File </ Button>
                </div>
                <div className="card p-3">
                  <h3>Lưu Dữ liệu</h3>
                  <Button disabled> Start Upload </Button>
                </div>
              </div>

              <Divider className="my-4" />

              <div>Nhập thông tin</div>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  onSubmit(e);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Name"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Permission"
                  name="permission"
                  value={newTeacher.permission}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Type"
                  name="typeTeacher"
                  value={newTeacher.typeTeacher}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Status"
                  name="status"
                  value={newTeacher.status}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {permissions.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {capitalize(status.name)}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function EditTeacherModal({ isOpen, onOpenChange, onSubmit, editTeacher, setEditTeacher }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setEditTeacher((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Teacher</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editTeacher, editTeacher.teacher_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Name"
                  name="name"
                  value={editTeacher.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editTeacher.email}
                  onChange={handleChange}
                  required
                />
                {/* <Input
                  fullWidth
                  label="Permission"
                  name="permission"
                  value={editTeacher.permission}
                  onChange={handleChange}
                  required
                /> */}
                <Select
                  label="Permission"
                  name="permission"
                  value={editTeacher.permission}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {permissions.map((permission) => (
                    <SelectItem key={permission.id} value={permission.id}>
                      {capitalize(permission.name)}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  fullWidth
                  label="Type"
                  name="typeTeacher"
                  value={editTeacher.typeTeacher}
                  onChange={handleChange}
                  required
                />

              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  onSubmit(editTeacher, editTeacher.teacher_id);
                  onClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
