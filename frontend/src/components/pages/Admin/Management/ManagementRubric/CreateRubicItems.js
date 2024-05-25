import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Link, useLocation, useParams } from "react-router-dom";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Rubic.css';

import { Button } from "@nextui-org/react";
import { message } from 'antd';

import { Tooltip, Input } from "@nextui-org/react";
import { axiosAdmin } from '../../../../../service/AxiosAdmin';

import { Select } from "antd";
import DropdownAndNavRubricItems from '../../Utils/DropdownAndNav/DropdownAndNavRubricItems';
import Tabs from '../../Utils/Tabs/Tabs';

const CreateRubicItems = (nav) => {
  const { id } = useParams();
  const { Option } = Select;
  const { setCollapsedNav } = nav;
  const [activeTab, setActiveTab] = useState(0);

  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedPlo, setSelectedPlo] = useState("");
  const [DataPlo, setDataPlo] = useState([]);
  const [Chapter, setDataChapter] = useState([]);
  const [DataClo, setDataClo] = useState([]);
  
  const [selectedClo, setSelectedClo] = useState("");
  const [score, setSelectedScore] = useState();
  const [selectedQualityLevel, setSelectedQualityLevel] = useState();

  const handleScoreChange = (value, option) => {
    setSelectedScore(value);
    setSelectedQualityLevel(null)
  };
  const handleQualityLevelChange = (value, option) => {
    setSelectedQualityLevel(value);

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
      const response = await axiosAdmin.get(`/rubric/${id}`);
      if (response.status === 200) {
        const clo_ids = await axiosAdmin.get(`/subject/${response.data.subject_id}/clo-ids`);
        setDataClo(clo_ids.data)
      }

    } catch (error) { }
  }
  useEffect(() => {
    getOneRubricById()
    // Set initial values if needed
    // setSelectedScore(Point)
    // setSelectedChapter(chapter_id)
    // setSelectedClo(clo_id)
    // setSelectedPlo(plo_id)
  }, []);

  useEffect(() => {
    if (selectedClo) {
      setSelectedPlo(null) 
      setSelectedChapter(null) 
      const GetChapterByCloID = async (cloId) => {
        try {
          const response = await axiosAdmin.get(`/clo-chapter/clo/${cloId}/getChapter`);
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
          const response = await axiosAdmin.get(`/plo-clo/clo/${cloId}/getPlo`);
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
        "score": parseFloat(score),
        "data": {
          chapter_id: selectedChapter,
          clo_id: selectedClo,
          plo_id: selectedPlo,
          rubric_id: parseInt(id) ,
          description: convertedContent,
          score: parseFloat(score)
        }
      };
      
      const response = await axiosAdmin.post(`/rubric-item/save-check-score`, { data });
      const rubricsItem_id = response.data.data.rubricsItem_id;
      if (rubricsItem_id) {
        const levelElements = document.querySelectorAll(`.qualityLevel`);
        const dataqualityLevel = [];

        levelElements.forEach(element => {
          const levels = element.querySelectorAll(`.level > div`);
          const names = element.querySelectorAll(`.name > div`);
          const keyNumbers = element.querySelectorAll(`.keyNumber > div`);

          Array.from(levels).forEach((level, index) => {
            const levelText = level.textContent.trim();
            const nameText = names[index].textContent.trim();
            const keyNumberText = keyNumbers[index].textContent.trim();
            dataqualityLevel.push({ rubricsItem_id: rubricsItem_id, level: levelText, name: nameText, keyNumber: parseFloat(keyNumberText) });
          });
        });

        const qualityLevel = {
          dataqualityLevel
        };
        console.log("hi");

        console.log(dataqualityLevel);
        await axiosAdmin.post(`/quality-level`, { qualityLevel });
      }

      if (response.status === 201) {
        message.success('Rubric item created successfully');
      } else {
        message.error(response.data.message);
      }

    } catch (error) {
      // If an error occurred during the request (e.g., network error), display a generic error message
      console.error('Error saving rubric item:', error);
      message.error('Failed to save: An error occurred');
    } finally {
      // Regardless of the outcome, stop the spinner
    }
  };

  const options = [];
  for (let i = 0.5; i <= 2; i += 0.5) {
    options.push(
      <Option key={i} value={i} textValue={`${i}`}>
        {`${i}`}
      </Option>
    );
  }

  // const handleUpdate = async () => {
  //   try {
  //     const data = {
  //       chapter_id: selectedChapter,
  //       clo_id: selectedClo,
  //       plo_id: selectedPlo,
  //       rubric_id: id,
  //       description: convertedContent,
  //       score: score
  //     };

  //     const response = await axiosAdmin.put(`/rubric-item/${id}`, { data: data });
  //     console.log(response.data);


  //     const levelElements = document.querySelectorAll(`.qualityLevel`)
  //     const dataqualityLevel = [];

  //     levelElements.forEach(element => {
  //       const levels = element.querySelectorAll(`.level > div`);
  //       const names = element.querySelectorAll(`.name > div`);
  //       const keyNumbers = element.querySelectorAll(`.keyNumber > div`);

  //       Array.from(levels).forEach((level, index) => {
  //         const levelText = level.textContent.trim();
  //         const nameText = names[index].textContent.trim();
  //         const keyNumberText = keyNumbers[index].textContent.trim();
  //         dataqualityLevel.push({ rubricsItem_id: id, level: levelText, name: nameText, keyNumber: parseFloat(keyNumberText) });
  //       });
  //     });

  //     const qualityLevel = {
  //       dataqualityLevel
  //     }
  //     await axiosAdmin.delete(`/quality-level/rubric-item/${id}`);
  //     console.log(id)
  //     await axiosAdmin.post(`/quality-level`, { qualityLevel });
  //     setSelectedQualityLevel()
  //     successNoti("lưu thành công")
  //     setSpinning(false);

  //   } catch (error) {
  //     console.error('Error while saving:', error);
  //     setSpinning(false);
  //   }
  // };

  return (
    <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
      <DropdownAndNavRubricItems />
  
      <Tabs tabs=
        {[
          {
            title: 'Tạo mới',
            content:
              <div className="w-full  rounded-lg border">
                <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row  xl:flex-row  justify-center items-center gap-2'>
                  <div className='flex-1 w-full sm:w-full items-center p-5 pb-0 sm:pb-0 lg:pb-5 xl:pb-5  justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                    <div className='text-left w-full font-bold'>Chọn Clo:</div>
                    <Select
                      defaultValue="Chọn loại"
                      className="w-full"
                      onChange={handleCloSelectChange}
                      value={selectedClo}
                    >
                      {DataClo.map((items) => (
                        <Option
                          key={items.clo_id}
                          value={items.clo_id}
                          textValue={items.cloName}
                        >
                          <Tooltip content={items.description} className='font-bold'>
                            {items.cloName}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                    <div className='text-left w-full font-bold'>Chọn Plo:</div>
                    <Select
                      defaultValue="Chọn loại"
                      className="w-full"
                      onChange={handlePloSelectChange}
                      value={selectedPlo}
                    >
                      {DataPlo.map((items) => (
                        <Option
                          key={items.plo_id}
                          value={items.plo_id}
                          textValue={items.ploName} // Assuming PLO is nested inside items
                        >
                          <Tooltip content={items.description} className="font-bold">
                            {items.ploName}
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                    <div className='text-left w-full font-bold'>Chọn Chapter:</div>
                    <Select
                      defaultValue="Chọn loại"
                      value={selectedChapter}
                      onChange={handleChapterSelectChange}
                      size="large"
                      className="w-full"
                    >
                      {Chapter.map((items) => (
                        <Option
                          key={items.chapter_id}
                          value={items.chapter_id}
                          textValue={items.chapterName}
                        ><Tooltip content={items.description} className='font-bold'>
                            {items.chapterName}
                          </Tooltip>
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
                      {options}
                    </Select>
                    <div className='text-left w-full font-bold'>Chọn dạng Mức độ:</div>
                    <Select

                      defaultValue="Chọn Mức độ chất lượng"
                      value={selectedQualityLevel}
                      onChange={handleQualityLevelChange}
                      size="large"
                      className="w-full"
                    >
                      <Option value={1}>1 tiêu chí</Option>
                      <Option value={2}>2 tiêu chí</Option>
                      <Option value={4}>4 tiêu chí</Option>
                    </Select>
                    <div className='w-full overflow-x-auto P-5'>
                      Mức độ chất lượng:
                      {selectedQualityLevel === 1 && (
                        <div className={`qualityLevel border border-gray-300 rounded w-full min-w-[200px] P-2`}>
                          <div className={`flex gap-5 level`}>
                            <div className='flex-1'>Tốt</div>
                            <div className='flex-1'>Yếu</div>
                          </div>
                          <div className={`flex gap-5 name`}>
                            <div className='flex-1'>Đạt</div>
                            <div className='flex-1'>Chưa Đạt</div>
                          </div>
                          <div className={`flex gap-5 keyNumber`}>
                            <div className='flex-1'>{score}</div>
                            <div className='flex-1'>0.00</div>
                          </div>
                        </div>
                      )}
                
                  
                      {selectedQualityLevel === 4 && (
                        <div className={`qualityLevel border border-gray-300 rounded w-full min-w-[400px] P-2`}>
                          <div className={`flex gap-5 level`}>
                            <div className='flex-1'>Tốt</div>
                            <div className='flex-1'>Khá</div>
                            <div className='flex-1'>TB</div>
                            <div className='flex-1'>Yếu</div>
                            <div className='flex-1'>Kém</div>
                          </div>
                          <div className={`flex gap-5 name`}>
                            <div className='flex-1'>Đạt 4</div>
                            <div className='flex-1'>Đạt 3</div>
                            <div className='flex-1'>Đạt 2</div>
                            <div className='flex-1'>Đạt 1</div>
                            <div className='flex-1'>Đạt 0</div>
                          </div>
                          <div className={`flex gap-5 keyNumber`}>
                            <div className='flex-1'>{score}</div>
                            <div className='flex-1'>{score * 75 / 100}</div>
                            <div className='flex-1'>{score * 50 / 100}</div>
                            <div className='flex-1'>{score * 25 / 100}</div>
                            <div className='flex-1'>0.00</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-1 flex-col w-full sm:w-full items-start p-5 pb-[60px]'>
                    <span className='text-justify font-bold'>
                      Tiều chí:
                    </span>
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      wrapperClassName="wrapper-class w-full"
                      editorClassName="editor-class px-5 border w-full"
                      toolbarClassName="toolbar-class"
                    />
                    <div className='w-full min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]'>
                      <div className='w-full mt-5'>
                        <div>
                          <Button color="primary" className='w-[200px]' onClick={handleSave}>
                            <span className='font-bold'>Lưu</span>
                          </Button>
                        </div>
                        {/* ) : (
                  <div>
                    <button className='w-[200px] rounded-lg hover:bg-[#FF8077] hover:text-[#FEFEFE] bg-[#FF9908]' onClick={handleUpdate}>
                      <span className='font-bold'>cập nhật</span>
                    </button>

                  </div>
                )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          },
        ]}
        activeTab={activeTab} setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default CreateRubicItems;
