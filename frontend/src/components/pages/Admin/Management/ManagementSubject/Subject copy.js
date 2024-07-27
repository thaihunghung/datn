
import { useEffect, useState } from "react";
import { Table, Tooltip, Button, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavSubject from "../../Utils/DropdownAndNav/DropdownAndNavSubject";
import Cookies from 'js-cookie';

const Subject = (nav) => {
  const { setCollapsedNav } = nav;

  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');
  if (!teacher_id) {
    navigate('/login');
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    {
      title: "Tên Học phần",
      dataIndex: "name",
      render: (record) => (
        <div className="text-sm min-w-[100px]">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "Mã Học phần",
      dataIndex: "subjectCode",
      render: (record) => (
        <div className="text-sm min-w-[100px]">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "CĐR",
      dataIndex: "clos",
      render: (clos) => (
        <div>
          {clos.check ? (
            <Link to={`/admin/management-subject/${clos.id}/clo/update`}>
              {/* <Tooltip title="Chỉnh sửa"> */}
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
              >
                Cập nhật
                {/* <i className="fa-solid fa-pen ml-2"></i> */}
              </Button>
              {/* </Tooltip> */}
            </Link>
          ) : (
            <Link to={`/admin/management-subject/${clos.id}/clo/create`}>
              {/* <Tooltip title="Tạo mới"> */}
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
              >
                Tạo mới
                {/* <i className="fa-solid fa-pen ml-2"></i> */}
              </Button>
              {/* </Tooltip> */}
            </Link>
          )}
        </div>
      ),
    },
    {
      title: "Chương",
      dataIndex: "chapters",
      render: (Chapters) => (
        <div>
          {Chapters.checkChapter ? (
            <Link to={`/admin/management-subject/${Chapters.id}/chapter/update`}>
              <Tooltip title={Chapters.checkCLo === false ? "Vui lòng nhập Clo trước" : ""}>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  disabled={!Chapters.checkCLo}
                >
                  Cập nhật
                  {/* <i className="fa-solid fa-pen ml-2"></i> */}
                </Button>
              </Tooltip>
            </Link>
          ) : (
            <Link to={`/admin/management-subject/${Chapters.id}/chapter/create`}>
              <Tooltip title={Chapters.checkCLo === false ? "Vui lòng nhập Clo trước" : ""}>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  disabled={!Chapters.checkCLo}
                >
                  Tạo mới
                  {/* <i className="fa-solid fa-pen ml-2"></i> */}
                </Button>
              </Tooltip>
            </Link>
          )}
        </div>
      ),
    },

    {
      title: "TL",
      dataIndex: "numberCreditsTheory",
      render: (record) => (
        <div className="text-sm text-center">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "TH",
      dataIndex: "numberCreditsPractice",
      render: (record) => (
        <div className="text-sm text-center">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "typesubject",
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
          <Link to={`/admin/management-subject/update/${_id}`}>
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
              onClick={() => { onOpen(); setDeleteId(_id); }}
            >
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          </Tooltip>

        </div>
      ),
    },

  ];

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
  
  const getAllSubjectIsDeleteFalse = async () => {
    try {
      const response = await axiosAdmin.get(`/subjects/isDelete/false`);
      const updatedPoData = response.data.map((subject) => {
        const clos = {
          id: subject.subject_id,
          check: subject.CLO.length > 0 ? true : false
        };

        const chapters = {
          id: subject.subject_id,
          checkCLo: subject.CLO.length > 0 ? true : false,
          checkChapter: subject.CHAPTER.length > 0 ? true : false
        };

        return {
          key: subject.subject_id,
          name: subject.subjectName,
          subjectCode: subject.subjectCode,
          description: subject.description,
          numberCredits: subject.numberCredits,
          clos: clos,
          chapters: chapters,
          numberCreditsTheory: subject.numberCreditsTheory,
          numberCreditsPractice: subject.numberCreditsPractice,
          typesubject: subject.typesubject,
          action: subject.subject_id
        };
      });
      setSubjects(updatedPoData);
      console.log(response.data);
    } catch (error) {
      console.error("Error: " + error.message);
      message.error('Error fetching PO data');
    }
  };

  const handleSoftDelete = async () => {
    const data = {
      subject_id: selectedRowKeys,
    };
    console.log(data)
    try {
      const response = await axiosAdmin.put('/subjects/softDelete', { data });
      await getAllSubjectIsDeleteFalse();
      handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error("Error soft deleting subjects:", error);
      message.error('Error soft deleting subjects');
    }
  };

  const handleSoftDeleteById = async (_id) => {
    try {
      const response = await axiosAdmin.put(`/subject/${_id}/softDelete`);
      await getAllSubjectIsDeleteFalse();
      handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error(`Error toggling soft delete for subject with ID ${_id}:`, error);
      message.error(`Error toggling soft delete for subject with ID ${_id}`);
    }
  };

  useEffect(() => {   
    getAllSubjectIsDeleteFalse()
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
    <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">
      <ConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onConfirm={() => {
          if (deleteId) {
            handleSoftDeleteById(deleteId);
            setDeleteId(null);
          } else if (selectedRowKeys.length > 0) {
            handleSoftDelete();
            setSelectedRowKeys([]);
          }
        }}
      />

      <DropdownAndNavSubject/>
      <div className="w-full my-5">
        {selectedRowKeys.length !== 0 && (
          <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
            <p className="text-sm font-medium">
              <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
              Đã chọn {selectedRow.length} học phần
            </p>
            <div className="flex items-center gap-2">

              <Tooltip
                title={`Xoá ${selectedRowKeys.length} học phần`}
                getPopupContainer={() =>
                  document.querySelector(".Quick__Option")
                }
              >
                <Button isIconOnly variant="light" radius="full" onClick={onOpen}>
                  <i className="fa-solid fa-trash-can"></i>
                </Button>
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
        <div className="w-full overflow-auto">
          <Table className="table-po text-[#fefefe]"
            bordered
            loading={loading}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={subjects}
          />
        </div>
      </div>
    </div>
  );
}

export default Subject;

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

