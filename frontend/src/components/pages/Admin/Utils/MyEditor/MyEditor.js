import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Button } from "@nextui-org/react";
import { message } from 'antd';

import { Tooltip, Input } from "@nextui-org/react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MyEditor.css';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';

import { Select } from "antd";

const MyEditor = ({ key, htmlContent, Point, SaveData, Chapter, Clo, id, rubric_id, chapter_id, clo_id, successNoti, setSpinning }) => {
  const { Option } = Select;
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedClo, setSelectedClo] = useState("");
  const [SaveLoad, setSaveLoad] = useState(SaveData);
  const [score, setSelectedScore] = useState();
  const [selectedQualityLevel, setSelectedQualityLevel] = useState();

  const handleScoreChange = (value, option) => {
    setSelectedScore(value);
  };
  const handleQualityLevelChange = (value, option) => {
    setSelectedQualityLevel(value);
  };

  const handleChapterSelectChange = (value, option) => {
    setSelectedChapter(value);
  };
  const handleCloSelectChange = (value, option) => {
    setSelectedClo(value);
  };


  const [editorState, setEditorState] = useState(
    () => {
      if (htmlContent) {
        const contentState = convertFromHTML(htmlContent);
        if (contentState) {
          return EditorState.createWithContent(contentState);
        }
      }
      return EditorState.createEmpty();
    }
  );

  const [convertedContent, setConvertedContent] = useState(null);
  useEffect(() => {
    setSelectedScore(Point)
    setSelectedChapter(chapter_id)
    setSelectedClo(clo_id)
  }, []);
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  useEffect(() => {

  }, [SaveLoad]);

  const handleSave = async () => {
    setSpinning(true);
    try {
      const data = {
        "score": parseFloat(score),
        "data": {
          chapter_id: selectedChapter,
          clo_id: selectedClo,
          rubric_id: parseInt(rubric_id),
          description: convertedContent,
          score: parseFloat(score)
        }
      }

      const response = await axiosAdmin.post(`/rubric-item/${rubric_id}/check-score`, { data });
      console.log(response.data.data);
      console.log(response.data.data.rubricsItem_id);

      const rubricsItem_id = response.data.data.rubricsItem_id;
      if (rubricsItem_id) {
        const levelElements = document.querySelectorAll(`.qualityLevel${key}`);
        const dataqualityLevel = [];

        levelElements.forEach(element => {
          const levels = element.querySelectorAll(`.level${key} > div`);
          const names = element.querySelectorAll(`.name${key} > div`);
          const keyNumbers = element.querySelectorAll(`.keyNumber${key} > div`);


          Array.from(levels).forEach((level, index) => {
            const levelText = level.textContent.trim();
            const nameText = names[index].textContent.trim();
            const keyNumberText = keyNumbers[index].textContent.trim();
            dataqualityLevel.push({ rubricsItem_id: rubricsItem_id, level: levelText, name: nameText, keyNumber: parseFloat(keyNumberText) });
          });
        });

        const qualityLevel = {
          dataqualityLevel
        }
        await axiosAdmin.post(`/quality-level`, { qualityLevel });
      }

      if (response.status === 201) {
        setSaveLoad(false)
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
      setSpinning(false);
    }
  };

  const options = [];
  for (let i = 0.25; i <= 2; i += 0.25) {
    options.push(
      <Option key={i} value={i} textValue={`${i}`}>
        {`${i}`}
      </Option>
    );
  }

  const handleUpdate = async () => {
    setSpinning(true);
    try {
      const data = {
        chapter_id: selectedChapter,
        clo_id: selectedClo,
        rubric_id: rubric_id,
        description: convertedContent,
        score: score
      };

      const response = await axiosAdmin.put(`/rubric-item/${id}`, { data: data });
      setSaveLoad(false)
      console.log(response.data);


      const levelElements = document.querySelectorAll(`.qualityLevel${key}`)
      const dataqualityLevel = [];

      levelElements.forEach(element => {
        const levels = element.querySelectorAll(`.level${key} > div`);
        const names = element.querySelectorAll(`.name${key} > div`);
        const keyNumbers = element.querySelectorAll(`.keyNumber${key} > div`);

        Array.from(levels).forEach((level, index) => {
          const levelText = level.textContent.trim();
          const nameText = names[index].textContent.trim();
          const keyNumberText = keyNumbers[index].textContent.trim();
          dataqualityLevel.push({ rubricsItem_id: id, level: levelText, name: nameText, keyNumber: parseFloat(keyNumberText) });
        });
      });

      const qualityLevel = {
        dataqualityLevel
      }
      await axiosAdmin.delete(`/quality-level/rubric-item/${id}`);
      console.log(id)
      await axiosAdmin.post(`/quality-level`, { qualityLevel });
      setSelectedQualityLevel()
      successNoti("lưu thành công")
      setSpinning(false);

    } catch (error) {
      console.error('Error while saving:', error);
      setSpinning(false);
    }
  };

  return (
    <div className='flex w-full h-full'>
      <div className='w-full h-full text-[#020401]'>
        <div className='w-full h-full flex flex-col sm:flex-col sm:items-start lg:flex-row  xl:flex-row  justify-center items-center gap-2'>
          <div className='flex-1 w-full sm:w-full items-center p-5 pb-0 sm:pb-0 lg:pb-5 xl:pb-5  justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Chọn Clo:</div>
            <Select
              defaultValue="Chọn loại"
              className="w-full"
              onChange={handleCloSelectChange}
              value={selectedClo}
            >
              {Clo.map((items) => (
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
              <Option value={3}>3 tiêu chí</Option>
              <Option value={4}>4 tiêu chí</Option>
              <Option value={6}>6 tiêu chí</Option>
              <Option value={8}>8 tiêu chí</Option>
            </Select>
            <div className='w-full overflow-x-auto P-5'>
              Mức độ chất lượng:
              {selectedQualityLevel === 1 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[200px] P-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>Yếu</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt</div>
                    <div className='flex-1'>Chưa Đạt</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
                    <div className='flex-1'>{score}</div>
                    <div className='flex-1'>0.00</div>
                  </div>
                </div>
              )}
              {selectedQualityLevel === 2 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[200px] P-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>TB</div>
                    <div className='flex-1'>Yếu</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt 2</div>
                    <div className='flex-1'>Đạt 1</div>
                    <div className='flex-1'>Đạt 0</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
                    <div className='flex-1'>{score}</div>
                    <div className='flex-1'>{score * 50 / 100}</div>
                    <div className='flex-1'>0.00</div>
                  </div>
                </div>
              )}
              {selectedQualityLevel === 3 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[300px] P-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>TB</div>
                    <div className='flex-1'>Yếu</div>
                    <div className='flex-1'>Kém</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt 3</div>
                    <div className='flex-1'>Đạt 2</div>
                    <div className='flex-1'>Đạt 1</div>
                    <div className='flex-1'>Đạt 0</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
                    <div className='flex-1'>{0.75}</div>
                    <div className='flex-1'>{(0.75 * 66.66666666666667 / 100).toFixed(2)}</div>
                    <div className='flex-1'>{(0.75 * 33.33333333333333 / 100).toFixed(2)}</div>
                    <div className='flex-1'>0.00</div>
                  </div>
                </div>
              )}
              {selectedQualityLevel === 4 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[400px] P-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>Khá</div>
                    <div className='flex-1'>TB</div>
                    <div className='flex-1'>Yếu</div>
                    <div className='flex-1'>Kém</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt 4</div>
                    <div className='flex-1'>Đạt 3</div>
                    <div className='flex-1'>Đạt 2</div>
                    <div className='flex-1'>Đạt 1</div>
                    <div className='flex-1'>Đạt 0</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
                    <div className='flex-1'>{score}</div>
                    <div className='flex-1'>{score * 75 / 100}</div>
                    <div className='flex-1'>{score * 50 / 100}</div>
                    <div className='flex-1'>{score * 25 / 100}</div>
                    <div className='flex-1'>0.00</div>
                  </div>
                </div>
              )}
              {selectedQualityLevel === 6 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[400px] P-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>TB</div>
                    <div className='flex-1'>Yếu</div>
                    <div className='flex-1'>Kém</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt 5-6</div>
                    <div className='flex-1'>Đạt 3-4</div>
                    <div className='flex-1'>Đạt 1-2</div>
                    <div className='flex-1'>Đạt 0</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
                    <div className='flex-1'>{0.75}</div>
                    <div className='flex-1'>{(0.75 * 66.66666666666667 / 100).toFixed(2)}</div>
                    <div className='flex-1'>{(0.75 * 33.33333333333333 / 100).toFixed(2)}</div>
                    <div className='flex-1'>0.00</div>
                  </div>
                </div>
              )}
              {selectedQualityLevel === 8 && (
                <div className={`qualityLevel${key} border border-gray-300 rounded w-full min-w-[450px] lg:min-w-[370px] xl:min-w-[370px] p-2`}>
                  <div className={`flex gap-5 level${key}`}>
                    <div className='flex-1'>Tốt</div>
                    <div className='flex-1'>Khá</div>
                    <div className='flex-1'>TB</div>
                    <div className='flex-1'>Yếu</div>
                    <div className='flex-1'>Kém</div>
                  </div>
                  <div className={`flex gap-5 name${key}`}>
                    <div className='flex-1'>Đạt 7-8</div>
                    <div className='flex-1'>Đạt 5-6</div>
                    <div className='flex-1'>Đạt 3-4</div>
                    <div className='flex-1'>Đạt 1-2</div>
                    <div className='flex-1'>CD</div>
                  </div>
                  <div className={`flex gap-5 keyNumber${key}`}>
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
                {SaveLoad ? (
                  <div>
                    <Button color="primary" className='w-[200px]' onClick={handleSave}>
                      <span className='font-bold'>Lưu</span>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <button className='w-[200px] rounded-lg hover:bg-[#FF8077] hover:text-[#FEFEFE] bg-[#FF9908]' onClick={handleUpdate}>
                      <span className='font-bold'>cập nhật</span>
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyEditor;
