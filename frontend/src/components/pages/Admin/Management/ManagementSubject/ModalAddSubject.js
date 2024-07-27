import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Divider,
  Button,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import { permissions } from "./Data";
import { capitalize } from "../../Utils/capitalize";
import { Tabs, Tab } from "@nextui-org/react";

function ModalAddSubject({
  isOpen,
  onOpenChange,
  onSubmit,
  newRubric,
  setNewRubric,
}) {
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRubric((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi giá trị của Select
  const handleSelectChange = (value) => {
    setNewRubric((prev) => ({
      ...prev,
      typesubject: value,
    }));
  };
  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/teacher/template/excel", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "Teacher.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const DataTypeSubject = [
    { key: 'Đại cương', TypeSubject: 'Đại cương' },
    { key: 'Cơ sở ngành', TypeSubject: 'Cơ sở ngành' },
    { key: 'Chuyên ngành', TypeSubject: 'Chuyên ngành' },
    { key: 'Thực tập và Đồ án', TypeSubject: 'Thực tập và Đồ án' },
  ];

  return (
    <Modal
      className="max-w-lg "
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Create Subject</ModalHeader>
            <ModalBody>
              <Tabs color={'bg-[#FF9908]'} aria-label="Tabs colors" radius="full">
                <Tab key="Form" title={
                  <>
                    <div className="text-xl font-bold text-[#6366F1]">
                      Nhập thông tin
                    </div>
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(newRubric, newRubric.subject_id);
                        onClose();
                      }}>
                      <Input
                        fullWidth
                        label="Name"
                        name="subjectName"
                        value={newRubric.subjectName || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Code"
                        name="subjectCode"
                        value={newRubric.subjectCode || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Description"
                        name="description"
                        value={newRubric.description || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Number Credits"
                        name="numberCredits"
                        type="number"
                        value={newRubric.numberCredits || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Number Credits Theory"
                        name="numberCreditsTheory"
                        type="number"
                        value={newRubric.numberCreditsTheory || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Number Credits Practice"
                        name="numberCreditsPractice"
                        type="number"
                        value={newRubric.numberCreditsPractice || ''}
                        onChange={handleChange}
                        required
                      />
                      <Select
                        label="Type of Subject"
                        name="typesubject"
                        defaultSelectedKeys={[newRubric.typesubject]}
                        value={newRubric?.typesubject}
                        onChange={handleSelectChange}
                        fullWidth
                      >
                        {DataTypeSubject.map((type) => (
                          <SelectItem key={type.key} value={type.TypeSubject}>
                            {capitalize(type.TypeSubject)}
                          </SelectItem>
                        ))}
                      </Select>
                    </form>
                  </>
                } />

                <Tab key="Excel" title={
                  <>
                    <div className="text-xl font-bold text-[#6366F1]">
                      Thêm giáo viên bằng file excel
                    </div>
                    <div className="flex justify-between m-1 w-full ">
                      <div className=" flex flex-col card p-3 justify-center items-center">
                        <h3>Tải Mẫu CSV</h3>
                        <Button
                          className="bg-sky-500/75 text-white"
                          onClick={handleDownloadTemplateExcel}
                        >
                          Tải xuống mẫu
                        </Button>
                      </div>
                      <div>
                        <div className="flex flex-col card p-3 justify-center items-center">
                          <h3>Upload File</h3>
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <Button
                              className="w-[125px]"
                              auto
                              flat
                              as="span"
                              color="primary"
                            >
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
                            <div className="mt-2">
                              <ul>
                                {fileList.map(
                                  (file, index) => (
                                    <li
                                      key={index}
                                      className="flex justify-between items-center"
                                    >
                                      <p>
                                        {file.name}
                                      </p>
                                      <Button
                                        auto
                                        flat
                                        color="error"
                                        size="xs"
                                        onClick={() =>
                                          handleRemoveFile(
                                            index
                                          )
                                        }
                                      >
                                        X
                                      </Button>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col card p-3 justify-center items-center  ">
                        <h3>Lưu file</h3>
                        <CustomUpload
                          endpoint="teacher"
                          method="POST"
                          setCurrent={setCurrent}
                          fileList={fileList}
                          setFileList={setFileList}
                        />
                      </div>
                    </div>
                  </>
                } />
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(newRubric);
                  onClose();
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalAddSubject;
