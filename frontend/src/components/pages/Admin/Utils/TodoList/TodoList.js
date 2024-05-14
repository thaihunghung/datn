import React, { useState, useEffect } from 'react';
import MyEditor from '../MyEditor/MyEditor';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import { Button } from "@nextui-org/react";

const TodoList = ({ data, Chapter, Clo, rubric_id, successNoti, setSpinning }) => {
  const [todos, setTodos] = useState([]);
  const [editors, setEditors] = useState([]);



  const handleChangeisDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/rubric-item/isDelete/${id}`);
      if (response) {
        console.log(response.data.message);
      }
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  useEffect(() => { 
    const newEditors = data.map((item, index) => ({ 
        component: <MyEditor key={index} Point={item.score} rubric_id={rubric_id} plo_id={item.plo_id} chapter_id={item.chapter_id} clo_id={item.clo_id} successNoti={successNoti} setSpinning={setSpinning} id={item.rubricsItem_id} htmlContent={item.description} SaveData={false} Chapter={Chapter} Clo={Clo}/>,
        isDelete: item.isDelete? true: false,
        rubricsItem_id: item.rubricsItem_id
    }));
    console.log(data)
    setEditors(newEditors);
  }, [data]);

  const addTodo = (todo) => {
    const newTodo = { text: todo, isDelete: false };
    setTodos([...todos, newTodo]);
  };
  const addEditor = () => {
    const newEditor = { component: <MyEditor key={editors.length} rubric_id={rubric_id} successNoti={successNoti} setSpinning={setSpinning} onAddTodo={addTodo} SaveData={true} Chapter={Chapter} Clo={Clo}/>, isDelete: false };
    const newEditors = [...editors, newEditor];
    setEditors(newEditors);
  };

  const removeEditor = (index) => {
    const newEditors = [...editors];
    newEditors[index].isDelete = true;
    setEditors(newEditors);
  };

  const restoreEditor = (index) => {
    const newEditors = [...editors];
    newEditors[index].isDelete = false;
    setEditors(newEditors);
  };

  return (
    <div className="todo-list w-full text-[#020401]">
      <div className="flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 shadow-lg rounded-md border-1 border-slate-300">
        <div className='w-[80%]'>
          <p className='font-bold text-[#020401]'>Danh sách các Items rubric</p>
        </div>
        <div>
          <button className='w-[100px] bg-[#AF84DD] font-bold' onClick={addEditor}>Thêm</button>
        </div>
      </div>
      <div className='w-full flex flex-1 flex-col sm:flex-col lg:flex-col xl:flex-col gap-10 p-5'>
        {editors.map((editor, index) => (
          !editor.isDelete && (
            
            <div key={index} className='flex flex-row border-1 border-[#FF8077] flex-1 sm:flex-1 lg:flex-1 xl:flex-1'>
              <div className='w-full'>
                <div className='flex justify-end w-full'>
                  <button className='bg-[#FF8077] font-bold px-2 mr-5 mt-5  rounded-lg' onClick={() => {
                    removeEditor(index);
                    if (editor.rubricsItem_id) {
                      handleChangeisDelete(editor.rubricsItem_id);
                    }
                  }}>Xóa</button>
                </div>
                  {editor.component}
              </div>
            </div>
          )
        ))}
      </div>

      <h1>da xoa</h1>
     {editors.map((editor, index) => (
        editor.isDelete && (
          <div key={index}>
            <div>
              {editor.component}
            </div>
            <div>
              <button onClick={() => removeEditor(index)}>Xóa</button>
              <button onClick={() => restoreEditor(index)}>Khôi phục</button>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default TodoList;
