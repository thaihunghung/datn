
import { useEffect, useState } from "react";
import { Table, Tooltip, Button, message } from 'antd';
import { Flex, Progress } from 'antd';

import { Link, useNavigate } from "react-router-dom";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavGrading from "../../Utils/DropdownAndNav/DropdownAndNavGrading";
import Cookies from "js-cookie";

const ManagementAssessmentStore = (nav) => {
  const { setCollapsedNav } = nav;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');
  if (!teacher_id) {
    navigate('/login');
  }

  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessment] = useState([]);

  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    {
      title: "description",
      dataIndex: "description",
      render: (record) => (
        <div className="text-sm min-w-[100px]">
          <p className="font-medium">{record}</p>
        </div>
      ),
    },
    {
      title: "courseName",
      dataIndex: "courseName",
      render: (record) => (
        <div className="text-sm min-w-[100px]">
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
              <Tooltip title="Khôi phục">
                  <Button
                      isIconOnly
                      variant="light"
                      radius="full"
                      onClick={() => handleRestoreById(_id)}
                  >
                      <i className="fa-solid fa-clock-rotate-left"></i>
                  </Button>
              </Tooltip>
              <Tooltip title="Xoá vĩnh viễn">
                  <Button
                      isIconOnly
                      variant="light"
                      radius="full"
                      color="danger"
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

  const getAllAssessmentIsDeleteFalse = async () => {
    try {
      const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&isDelete=true`);
      const Data = response.data.map((items) => ({
        key: items?.description,
        description: items?.description,
        assessmentCount: items?.assessmentCount,
        studentCount: items?.studentCount,
        courseName: items?.courseName,
        status: items?.status,
        action: items?.description,
      }));
      setAssessment(Data);
      console.log(Data);
    } catch (error) {
      console.error("Error: " + error.message);
    }
  };

  const handleSoftDelete = async () => {
    const descriptions = selectedRowKeys
    try {
      await axiosAdmin.put('/assessments/softDeleteByDescription', { descriptions });
      message.success(`Successfully toggled soft delete for assessments`);
      getAllAssessmentIsDeleteFalse();
    } catch (error) {
      console.error(`Error toggling soft delete for assessments`, error);
      message.error(`Error toggling soft delete for assessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };

  const handleSoftDeleteById = async (description) => {
    const descriptions = [description]
    try {
      await axiosAdmin.put('/assessments/softDeleteByDescription', { descriptions });
      message.success(`Successfully toggled soft delete for assessments`);
      getAllAssessmentIsDeleteFalse();
    } catch (error) {
      console.error(`Error toggling soft delete for assessments`, error);
      message.error(`Error toggling soft delete for assessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };

  const handleRestoreById = async (description) => {
    const descriptions = [description]
    try {
      await axiosAdmin.put('/assessments/softDeleteByDescription', { descriptions });
      getAllAssessmentIsDeleteFalse();
      message.success(`Successfully toggled soft delete for assessments`);
     
    } catch (error) {
      console.error(`Error toggling soft delete for assessments`, error);
      message.error(`Error toggling soft delete for assessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };

  const handleRestore = async () => {
    const descriptions = selectedRowKeys
    try {
      await axiosAdmin.put('/assessments/softDeleteByDescription', { descriptions });
      getAllAssessmentIsDeleteFalse();
      message.success(`Successfully toggled soft delete for assessments`);
      
    } catch (error) {
      console.error(`Error toggling soft delete for assessments`, error);
      message.error(`Error toggling soft delete for assessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };



  useEffect(() => {
    getAllAssessmentIsDeleteFalse()
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

      <DropdownAndNavGrading />
      <div className="w-full my-5">
        {selectedRowKeys.length !== 0 && (
          <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
            <p className="text-sm font-medium">
              <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
              Đã chọn {selectedRow.length} Assessment
            </p>
            <div className="flex items-center gap-2">

              <Tooltip
                title={`Khôi phục ${selectedRowKeys.length} Assessment`}
                getPopupContainer={() =>
                  document.querySelector(".Quick__Option")
                }
              >
                <Button isIconOnly variant="light" radius="full" onClick={() => handleRestore()}>
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </Button>
              </Tooltip>
              <Tooltip
                title={`Xoá vĩnh viễn ${selectedRowKeys.length} Assessment`}
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
            dataSource={assessments}
          />
        </div>
      </div>
    </div>
  );
}

export default ManagementAssessmentStore;

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

