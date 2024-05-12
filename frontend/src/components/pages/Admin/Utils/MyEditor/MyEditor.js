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

const MyEditor = ({key, htmlContent, Point, SaveData, Chapter, Clo, id, rubric_id, chapter_id, clo_id, successNoti, setSpinning }) => {
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
    <div className='flex w-full'>
      <div className='p-5 w-full'>
        <div className='flex flex-col sm:flex-row lg:flex-row xl:flex-row w-full mb-5 gap-5 justify-start items-center'>
          <div className='w-full items-center  justify-center flex flex-row gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Chọn Clo:</div>
            <Select
              defaultValue="Chọn loại"
              className="min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]"
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
          </div>
          <div className='w-full items-center justify-center flex flex-row gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Chọn Chapter:</div>
            <Select
              defaultValue="Chọn loại"
              value={selectedChapter}
              onChange={handleChapterSelectChange}
              size="large"
              className="min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]"
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

          </div>
        </div>
        <div className='w-full min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]'>
          <div className='w-full mb-5 items-center justify-center flex flex-row gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Nhập điểm:</div>
            <Select
              defaultValue="Chọn điểm"
              value={score}
              onChange={handleScoreChange}
              size="large"
              className="min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]"
            >
              {options}
            </Select>
            <div className='text-left w-full font-bold'>Chọn dạng Mức độ:</div>
            <Select

              defaultValue="Chọn Mức độ chất lượng"
              value={selectedQualityLevel}
              onChange={handleQualityLevelChange}
              size="large"
              className="min-w-[250px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[250px]"
            >
              <Option value={1}>1 tiêu chí</Option>
              <Option value={2}>2 tiêu chí</Option>
              <Option value={3}>3 tiêu chí</Option>
              <Option value={4}>4 tiêu chí</Option>
              <Option value={6}>6 tiêu chí</Option>
              <Option value={8}>8 tiêu chí</Option>
            </Select>



          </div>
          <div className='py-5'>
            Mức độ chất lượng:
            {selectedQualityLevel === 1 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>Yếu</div>
                </div>
                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt</div>
                  <div>Chưa Đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>
                  <div>{score}</div>
                  <div>0.00</div>
                </div>
              </div>
            )}
            {selectedQualityLevel === 2 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>TB</div>
                  <div>Yếu</div>
                </div>

                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt 2</div>
                  <div>Đạt 1</div>
                  <div>Chưa Đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>
                  <div>{score}</div>
                  <div>{score * 50 / 100}</div>
                  <div>0.00</div>
                </div>
              </div>
            )}
            {selectedQualityLevel === 3 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>TB</div>
                  <div>Yếu</div>
                  <div>Chưa Đạt</div>
                </div>

                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt 3</div>
                  <div>Đạt 2</div>
                  <div>Đạt 1</div>
                  <div>Chưa Đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>

                  <div>{0.75}</div>
                  <div>{(0.75 * 66.66666666666667 / 100).toFixed(2)}</div>
                  <div>{(0.75 * 33.33333333333333 / 100).toFixed(2)}</div>

                  <div>0.00</div>
                </div>
              </div>
            )}
            {selectedQualityLevel === 4 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>Khá</div>
                  <div>TB</div>
                  <div>Yếu</div>
                  <div>Kém</div>
                </div>
                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt 4</div>
                  <div>Đạt 3</div>
                  <div>Đạt 2</div>
                  <div>Đạt 1</div>
                  <div>Chưa đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>
                  <div>{score}</div>
                  <div>{score * 75 / 100}</div>
                  <div>{score * 50 / 100}</div>
                  <div>{score * 25 / 100}</div>
                  <div>{0.00}</div>
                </div>
              </div>
            )}
            {selectedQualityLevel === 6 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>TB</div>
                  <div>Yếu</div>
                  <div>Chưa Đạt</div>
                </div>

                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt 5-6</div>
                  <div>Đạt 3-4</div>
                  <div>Đạt 1-2</div>
                  <div>Chưa Đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>

                  <div>{0.75}</div>
                  <div>{(0.75 * 66.66666666666667 / 100).toFixed(2)}</div>
                  <div>{(0.75 * 33.33333333333333 / 100).toFixed(2)}</div>
                  <div>0.00</div>
                </div>
              </div>
            )}
            {selectedQualityLevel === 8 && (
              <div className={`qualityLevel${key}`}>
                <div className={`flex gap-10 level${key}`}>
                  <div>Tốt</div>
                  <div>Khá</div>
                  <div>TB</div>
                  <div>Yếu</div>
                  <div>Kém</div>
                </div>
                <div className={`flex gap-10 name${key}`}>
                  <div>Đạt 7-8</div>
                  <div>Đạt 5-6</div>
                  <div>Đạt 3-4</div>
                  <div>Đạt 1-2</div>
                  <div>Chưa đạt</div>
                </div>
                <div className={`flex gap-10 keyNumber${key}`}>
                  <div>{score}</div>
                  <div>{score * 75 / 100}</div>
                  <div>{score * 50 / 100}</div>
                  <div>{score * 25 / 100}</div>

                  <div>{0.00}</div>
                </div>
              </div>
            )}
          </div>

          <div className='text-justify font-bold'>
            Tiều chí:
          </div>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class px-5 border"
            toolbarClassName="toolbar-class"
          />
          <div className='w-full mt-5'>
            {SaveLoad ? (
              <div>
                <Button color="primary" className='w-[200px]' onClick={handleSave}>
                  <span className='font-bold'>Lưu</span>
                </Button>
              </div>
            ) : (
              <div>
                <Button color="warning" className='w-[200px]' onClick={handleUpdate}>
                  <span className='font-bold'>cập nhật</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEditor;
