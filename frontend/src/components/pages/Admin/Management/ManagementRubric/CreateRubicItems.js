import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { message } from 'antd';
import { Select } from "antd";
import './Rubic.css';

const CreateRubicItems = (nav) => {
  const { id } = useParams();
  const { Option } = Select;
  const { loadData, rubricData, isOpen, onClose } = nav;

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);

  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedPlo, setSelectedPlo] = useState("");
  const [DataPlo, setDataPlo] = useState([]);
  const [Chapter, setDataChapter] = useState([]);
  const [DataClo, setDataClo] = useState([]);

  const [selectedClo, setSelectedClo] = useState("");

  const [score, setSelectedScore] = useState();

  const handleScoreChange = (value, option) => {
    setSelectedScore(value);
  };

  const handlePloSelectChange = (value, option) => {
    setSelectedPlo(value);
  };

  const handleChapterSelectChange = (value, option) => {
    setSelectedChapter(value);
  };

  const handleCloSelectChange = (value, option) => {
    setSelectedClo(value);
  };

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty()
  );

  const [convertedContent, setConvertedContent] = useState(null);

  const getOneRubricById = async () => {
    try {
      console.log("response.data");
      const response = await axiosAdmin.get(`/rubric/${id}`);
      
      console.log(response.data);
      if (response.status === 200) {
        const clo_ids = await axiosAdmin.get(`/subject/${response.data.subject_id}?include_clos=true`);
        console.log(clo_ids);
        //setDataClo(clo_ids.data)
      }

    } catch (error) { }
  }
  useEffect(() => {
    getOneRubricById()
  }, []);

  useEffect(() => {
    if (selectedClo) {
      setSelectedPlo(null)
      setSelectedChapter(null)
      const GetChapterByCloID = async (cloId) => {
        try {
          const response = await axiosAdmin.get(`/clo-chapter/clo/${cloId}/find-chapter`);
          console.log("Chapter ID", cloId);
          console.log(response.data);
          setDataChapter(response.data);
        } catch (error) {
          console.error('Error fetching Chapter by CLO ID:', error);
          throw error;
        }
      };

      const GetPloByCloID = async (cloId) => {
        try {
          const response = await axiosAdmin.get(`/plo-clo/clo/${cloId}/find-plo`);
          console.log("PLO ID", cloId);
          console.log(response.data);
          setDataPlo(response.data);
        } catch (error) {
          console.error('Error fetching PLO by CLO ID:', error);
          throw error;
        }
      };

      const timer = setTimeout(() => {
        GetChapterByCloID(selectedClo);
        GetPloByCloID(selectedClo);
      }, 1000); // 1-second delay

      return () => clearTimeout(timer);
    }
  }, [selectedClo]);

  useEffect(() => {
    if (editorState) {
      let html = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(html);
    }
  }, [editorState]);

  const handleSave = async () => {
    try {
      const data = {
        "maxScore": parseFloat(score),
        "data": {
          chapter_id: selectedChapter,
          clo_id: selectedClo,
          plo_id: selectedPlo,
          rubric_id: parseInt(id),
          description: convertedContent,
          maxScore: parseFloat(score)
        }
      };

      const response = await axiosAdmin.post(`/rubric-item/checkscore`, { data });
      if (response.status === 201) {
        message.success('Rubric item created successfully');
        rubricData()
        setSelectedClo("")
        setSelectedPlo("")
        setSelectedChapter("")
        setSelectedScore()
        loadData()
      } else if (response.status === 400) {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error saving rubric item:', error);
      message.error('Failed to save: An error occurred');
    } finally {
      // Regardless of the outcome, stop the spinner
    }
  };

  const DataScore = [
    { key: '1', Score: 0.25 },
    { key: '2', Score: 0.5 },
    { key: '3', Score: 0.75 },
    { key: '4', Score: 1 },
    { key: '4', Score: 1.25 },
    { key: '4', Score: 1.5 },
    { key: '4', Score: 1.75 },
    { key: '4', Score: 2 },
  ];

  const onCloseModal = () => {
    onClose(
      navigate(`/admin/management-rubric/${id}/rubric-items/list`)
    ); // This function can be called to close the modal
  };
  return (
    <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
      <Modal
        size="5xl"
        isOpen={isOpen}
        scrollBehavior="outside"
        hideCloseButton
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
              <ModalHeader className="flex flex-col gap-1 text-[#FF9908]"> Tạo mới</ModalHeader>
              <ModalBody>
                <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row  xl:flex-row  justify-center items-center gap-2'>
                  <div className='flex-1 w-full sm:w-full items-center p-5 pb-0 sm:pb-0 lg:pb-5 xl:pb-5  justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                    <div className='text-left w-full font-bold'>Chọn Clo:</div>
                    <Select
                      defaultValue="Chọn loại"
                      className="w-full h-full"
                      onChange={handleCloSelectChange}
                      value={selectedClo}
                    >
                      {DataClo.map((items) => (
                        <Option
                          key={items.clo_id}
                          value={items.clo_id}
                          textValue={items.cloName}
                        >
                          <span className='text-base text-wrap text-left'>{items.cloName}{". "}{items.description}</span>
                        
                        </Option>
                      ))}
                    </Select>
                      {/* <Tooltip content={items.description} className='font-bold'>
                            {items.cloName}
                          </Tooltip> */}
                    <div className='text-left w-full font-bold'>Chọn Plo:</div>
                    <Select
                      defaultValue="Chọn loại"
                      className="w-full h-full"
                      onChange={handlePloSelectChange}
                      value={selectedPlo}
                    >
                      {DataPlo.map((items) => (
                        <Option
                          key={items.plo_id}
                          value={items.plo_id}
                          textValue={items.ploName} // Assuming PLO is nested inside items
                        >
                          <span className='text-base text-wrap text-left' >{items.ploName}{". "}{items.description}</span>
                          {/* <Tooltip content={items.description} className="font-bold">
                            {items.ploName}
                          </Tooltip> */}
                        </Option>
                      ))}
                    </Select>
                    <div className='text-left w-full font-bold'>Chọn Chapter:</div>
                    <Select
                      defaultValue="Chọn loại"
                      value={selectedChapter}
                      onChange={handleChapterSelectChange}
                      size="large"
                      className="w-full h-full"
                    >
                      {Chapter.map((items) => (
                        <Option
                          key={items.chapter_id}
                          value={items.chapter_id}
                          textValue={items.chapterName}
                        >
                          <span className='text-base text-wrap text-left'>{items.chapterName}{". "}{items.description}</span>

                          {/* <Tooltip content={items.description} className='font-bold'>
                            {items.chapterName}
                          </Tooltip> */}
                        </Option>
                      ))}
                    </Select>

                    <div className='text-left w-full font-bold'>Nhập điểm:</div>
                    <Select
                      defaultValue="Chọn điểm"
                      value={score}
                      onChange={handleScoreChange}
                      size="large"
                      className="w-full"
                    >
                      {DataScore.map((TypeSubject) => (
                        <Select.Option
                          key={TypeSubject.key}
                          value={TypeSubject.Score}
                        >
                          {TypeSubject.Score}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className='flex flex-1 flex-col w-full sm:w-full items-start p-5 pb-[60px]'>
                    <span className='text-justify font-bold'>
                      Tiêu chí:
                    </span>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      wrapperClassName="wrapper-class w-full"
                      editorClassName="editor-class px-5 border w-full"
                      toolbarClassName="toolbar-class"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onCloseModal}>
                  Hủy
                </Button>
                <Button color="primary" onClick={handleSave}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateRubicItems;
