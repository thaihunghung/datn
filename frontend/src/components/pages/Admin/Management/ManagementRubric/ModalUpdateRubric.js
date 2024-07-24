import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { capitalize } from "../../Utils/capitalize";

function ModalUpdateRubric({ isOpen, onOpenChange, onSubmit, editRubric, setEditRubric, DataSubject }) {

  // Xử lý thay đổi các giá trị của các trường nhập liệu
  const handleChange = (e) => {
    const { rubricName, value } = e.target;
    setEditRubric((prev) => ({
      ...prev,
      [rubricName]: value,
    }));
  };

  // Xử lý thay đổi giá trị của Select
  const handleSelectChange = (value) => {
    setEditRubric((prev) => ({
      ...prev,
      subject_id: value,
    }));
  };

  const handleChangeComment = (e) => {
    const { comment, value } = e.target;
    setEditRubric((prev) => ({
      ...prev,
      [comment]: value,
    }));
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Edit Rubric</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.rubric_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Name"
                  name="rubricName"
                  value={editRubric.rubricName || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Comment"
                  name="comment"
                  placeholder="Enter your Comment"
                  value={editRubric.comment || ''}
                  onChange={handleChangeComment}
                />
                <Select
                  label="Subject"
                  name="subject_id"
                  defaultSelectedKeys={[editRubric.subject_id]}
                  value={editRubric?.subject_id}
                  onChange={handleSelectChange}

                  fullWidth
                > 
                  {DataSubject.map((subject) => (
                    <SelectItem key={subject?.subject_id} value={subject?.subject_id}>
                      {capitalize(subject?.subjectName)}
                    </SelectItem>
                  ))}
               </Select>
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
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.rubric_id);
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

export default ModalUpdateRubric;
