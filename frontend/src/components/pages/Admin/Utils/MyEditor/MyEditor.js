import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Button } from "@nextui-org/react";
import { Tooltip, Input } from "@nextui-org/react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MyEditor.css';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';

import { Select } from "antd";

const MyEditor = ({ htmlContent, SaveData, Chapter, Clo, id, rubric_id, chapter_id, clo_id, successNoti, setSpinning }) => {
  const { Option } = Select;
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedClo, setSelectedClo] = useState("");


  const [SaveLoad, setSaveLoad] = useState(SaveData);
  const [score, setScore] = useState();

  const handleScoreChange = (event) => {
    setScore(event.target.value);
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
        chapter_id: selectedChapter,
        clo_id: selectedClo,
        rubric_id: rubric_id,
        description: convertedContent,
        score: score
      };


      const response = await axiosAdmin.post('/rubric-item', { data: data });
      setSaveLoad(false)
      console.log(response.data);
      successNoti("lưu thành công")
      setSpinning(false);

    } catch (error) {
      console.error('Error while saving:', error);
      setSpinning(false);
    }
  };

  const handleUpdate = () => {
    console.log(convertedContent);
  };

  return (
    <div className='flex'>
      <div className='w-[400px] sm:w-full lg:w-full xl:w-full p-5'>
        <div className='flex flex-col sm:flex-row lg:flex-row xl:flex-row w-full mb-5 gap-5 justify-start items-center'>
          <div className='w-full items-center  justify-center flex flex-row gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Chọn Clo:</div>
            <Select
              defaultValue="Chọn loại"
              className="min-w-[250px] sm:min-w-[250px] lg:min-w-[250px] xl:min-w-[250px]"
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
              className="min-w-[250px] sm:min-w-[250px] lg:min-w-[250px] xl:min-w-[250px]"
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
        <div>
          <div className='w-full mb-5 items-center justify-center flex flex-row gap-2 sm:flex-col lg:flex-col xl:flex-col'>
            <div className='text-left w-full font-bold'>Nhập điểm:</div>
            <Input
              label="Nhập điểm"
              variant="bordered"
              className="w-full"
              value={score}
              onChange={handleScoreChange}
            />
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
