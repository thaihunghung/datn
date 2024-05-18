
import { useEffect, useState } from "react";
import { Table, Tooltip, Button, message } from 'antd';
import { Link, useLocation } from "react-router-dom";
// import "./Po.css"
import {
  useDisclosure
} from "@nextui-org/react";

import {
  Modal, Chip,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const Subject = (nav) => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const { setCollapsedNav } = nav;
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
        <div className="text-sm">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   render: (record) => (
    //     <div className="text-sm">
    //       <p className="font-medium text-justify">{record}</p>
    //     </div>
    //   ),  
    // },
    {
      title: "CĐR học phần",
      dataIndex: "action",
      render: (_id) => (
        <Link to={`/admin/management-subject/${_id}/clo/update`}>
            <Tooltip title="Chỉnh sửa">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
              >
               Clo  <i className="fa-solid fa-pen ml-2"></i>
              </Button>
            </Tooltip>
          </Link>
      ),  
    },
    {
      title: "TL",
      dataIndex: "numberCreditsTheory",
      render: (_id) => (
        <div className="text-sm">
          <Link to={``}></Link>
        </div>
      ),
    },
    {
      title: "TH",
      dataIndex: "numberCreditsPractice",
      render: (record) => (
        <div className="text-sm">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "Loại học phần",
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
        <div className="flex flex-col items-center justify-center w-full gap-2">
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
      const response = await axiosAdmin.get('/subject/isDelete/false');
      const updatedPoData = response.data.map((subject) => {
        return {
          key: subject.subject_id,
          name: subject.subjectName,
          description: subject.description,
          numberCredits: subject.numberCredits,
          numberCreditsTheory: subject.numberCreditsTheory,
          numberCreditsPractice: subject.numberCreditsPractice,
          typesubject: subject.typesubject,
          action: subject.subject_id,
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
      po_id: selectedRowKeys,
    };
    console.log(data)
    try {
      const response = await axiosAdmin.put('/po/listId/soft-delete-multiple', { data });
      await getAllSubjectIsDeleteFalse();
      handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error("Error soft deleting POs:", error);
      message.error('Error soft deleting POs');
    }
  };

  const handleSoftDeleteById = async (_id) => {
    try {
      const response = await axiosAdmin.put(`/po/${_id}/toggle-soft-delete`);
      await getAllSubjectIsDeleteFalse();
      handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
      message.error(`Error toggling soft delete for PO with ID ${_id}`);
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
    <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
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

      <div className="flex justify-between px-5 w-full items-center">
        <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
          <Link to="/admin/management-subject/list">
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive("/admin/management-subject/list") ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Danh sách Subject
              </div>
            </div>
          </Link>
          <Link to="/admin/management-po/create">
            <div className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive("/admin/management-subject/list") ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                Tạo mới
              </div>
            </div>
          </Link>
        </div>
        <div>
          <Link to="/admin/management-po/store">
            <Tooltip title="Xoá">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"

              >
                <span className="text-base">Kho lưu trữ </span><i className="fa-solid ml-2 fa-trash-can"></i>
              </Button>
            </Tooltip></Link>
        </div>
      </div>
      <div className="w-full my-5 px-5">
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
        <div className="w-full ">
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
  const { isOpen, onOpenChange, onConfirm, datavalue } = props;
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
                {datavalue}              
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

