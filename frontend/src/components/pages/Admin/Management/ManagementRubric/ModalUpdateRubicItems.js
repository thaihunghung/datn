import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
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
  Tooltip
} from "@nextui-org/react";

import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Rubic.css';
import { capitalize } from '../../Utils/capitalize';

function ModalUpdateRubicItems({ isOpen, onOpenChange, onSubmit, editRubric, setEditRubric, CloData, ChapterData, PloData }) {
  //function ModalUpdateRubric() {
  const handleChange = (e) => {
    const { rubricName, value } = e.target;
    setEditRubric((prev) => ({
      ...prev,
      [rubricName]: value,
    }));
  };

  // Xử lý thay đổi giá trị của Select
  const handleSelectChangeClo = (value) => {
    setEditRubric((prev) => ({
      ...prev,
      clo_id: value,
    }));
  };
  const handleSelectChangePlo = (value) => {
    setEditRubric((prev) => ({
      ...prev,
      plo_id: value,
    }));
  };
  const handleSelectChangeChapter = (value) => {
    setEditRubric((prev) => ({
      ...prev,
      chapter_id: value,
    }));
  };

  const handleChangeComment = (e) => {
    const { comment, value } = e.target;
    setEditRubric((prev) => ({
      ...prev,
      [comment]: value,
    }));
  };


  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedPlo, setSelectedPlo] = useState('');

  const [DataPlo, setDataPlo] = useState([]);
  const [Chapter, setDataChapter] = useState([]);
  const [DataClo, setDataClo] = useState([]);
  const [selectedClo, setSelectedClo] = useState('');
  const [score, setSelectedScore] = useState();
  const [RubricItems, setRubricItems] = useState({});

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);



  // useEffect(() => {
  //   if (selectedClo) {
  //     setSelectedPlo(null);
  //     setSelectedChapter(null);

  //     const GetChapterByCloID = async (cloId) => {
  //       try {
  //         const response = await axiosAdmin.get(`/clo-chapter?clo_id=${cloId}`);
  //         setDataChapter(response.data);
  //       } catch (error) {
  //         console.error('Error fetching Chapter by CLO ID:', error);
  //       }
  //     };

  //     const GetPloByCloID = async (cloId) => {
  //       try {
  //         const response = await axiosAdmin.get(`/plo-clo?clo_id=${cloId}`);
  //         setDataPlo(response.data);
  //       } catch (error) {
  //         console.error('Error fetching PLO by CLO ID:', error);
  //       }
  //     };

  //     const timer = setTimeout(() => {
  //       GetChapterByCloID(selectedClo);
  //       GetPloByCloID(selectedClo);
  //       setSelectedPlo(RubricItems.plo_id);
  //       setSelectedChapter(RubricItems.chapter_id);
  //     }, 100); // 1-second delay

  //     return () => clearTimeout(timer);
  //   }
  // }, [selectedClo]);

  useEffect(() => {
    if (editorState) {
      let html = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(html);
    }
  }, [editorState]);

  // useEffect(() => {
  //   if (CloData) {
  //     setDataClo(CloData);
  //   }
  // }, [CloData]);
  // useEffect(() => {
  //   if (ChapterData) {
  //     setDataChapter(ChapterData);
  //     console.log("ChapterData");
  //     console.log(editRubric.chapter_id);
  //   }
  // }, [ChapterData]);

  // useEffect(() => { 
  //   if (PloData) {
  //     console.log("PloData");
  //     console.log(editRubric.plo_id);
  //     setDataPlo(PloData);
  //   }
  // }, [PloData]);

  useEffect(() => {

    setDataClo(CloData);
    setDataChapter(ChapterData);


    console.log("ChapterData");
    console.log(editRubric);
    console.log("ChapterData");
    console.log(editRubric.chapter_id);
    console.log(ChapterData);



    setDataPlo(PloData);
    if (editRubric) {
      const contentState = convertFromHTML(editRubric.description);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [editRubric]);





  // const options = [];
  // for (let i = 0.5; i <= 2; i += 0.5) {
  //   options.push(
  //     <Option key={i} value={i} textValue={`${i}`}>
  //       {`${i}`}
  //     </Option>
  //   );
  // }

  // const DataScore = [
  //   { key: '1', Score: 0.25 },
  //   { key: '2', Score: 0.5 },
  //   { key: '3', Score: 0.75 },
  //   { key: '4', Score: 1 },
  //   { key: '4', Score: 1.25 },
  //   { key: '4', Score: 1.5 },
  //   { key: '4', Score: 1.75 },
  //   { key: '4', Score: 2 },
  // ];

  return (
    <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-1 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
      {/* <Modal
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
        onOpenChange
      > */}
      <Modal isOpen={isOpen} scrollBehavior="outside"
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
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#FF9908]"> Edit Rubric items</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(editRubric, editRubric.rubricsItem_id);
                    onClose();
                  }}>
                  <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row  xl:flex-row  justify-center items-center gap-2'>
                    <div className='flex-1 w-full sm:w-full items-center p-1 pb-0 sm:pb-0 lg:pb-5 xl:pb-5  justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                      <div className='text-left w-full font-bold'>Chọn Clo:</div>
                      {/* <Select
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
                    </Select> */}
                      <Select
                        label="Lựa chọn"
                        name="clo_id"
                        defaultSelectedKeys={[editRubric.clo_id]}
                        value={editRubric?.clo_id}
                        onChange={handleSelectChangeClo}
                        className="text-wrap max-w-[500px]"
                                                fullWidth
                      >
                        {DataClo.map((clo) => (
                          <SelectItem key={clo?.clo_id} value={clo?.clo_id} className="text-wrap">
                            {`${clo?.cloName}. ${clo.description}`}
                          </SelectItem>
                        ))}
                      </Select>
                      {/* <Tooltip content={items.description} className='font-bold'>
                            {items.cloName}
                          </Tooltip> */}
                      <div className='text-left w-full font-bold'>Chọn Plo:</div>
                      <Select
                        label="Lựa chọn"
                        name="plo_id"
                        defaultSelectedKeys={[editRubric.plo_id]}
                        value={editRubric?.plo_id}
                        // onChange={}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {DataPlo.map((plo) => (
                          <SelectItem key={plo?.plo_id} value={plo?.plo_id} className="text-wrap">

                            {(`${plo?.ploName}. ${plo.description}`)}
                          </SelectItem>
                        ))}
                      </Select>



                      <div className='text-left w-full font-bold'>Chọn Chapter:</div>
                      <Select
                        label="Lựa chọn"
                        name="chapter_id"
                        
                        defaultSelectedKeys={[editRubric.chapter_id]}
                        value={editRubric?.chapter_id}
                        // onChange={}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {ChapterData.map((chapter) => (
                          <SelectItem key={chapter?.chapter_id} value={chapter?.chapter_id} className="text-wrap">
                            {(`${chapter?.chapterName}. ${chapter.description}`)}
                          </SelectItem>
                        ))}
                      </Select>

                      <div className='text-left w-full font-bold'>Nhập điểm:</div>
                      {/* <Select
                      defaultValue="Chọn điểm"
                      value={score}
                      onChange={handleScoreChange}
                      // size="large"
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
                    </Select> */}
                    </div>

                    <div className='flex flex-1 flex-col w-full sm:w-full items-start p-1 pb-[60px]'>
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
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light"
                  onClick={onClose}

                >
                  Hủy
                </Button>
                <Button color="primary"
                //onClick={handleSave}
                >
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

export default ModalUpdateRubicItems;
