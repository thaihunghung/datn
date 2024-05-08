// UpdateRubic.js

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, Steps, Button } from 'antd';
import { Link, useParams } from "react-router-dom";

import {
  Modal, Chip,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import MyEditor from "../../Utils/MyEditor/MyEditor";



const UpdateRubic = (nav) => {
  const { id } = useParams();
  const { setCollapsedNav, successNoti } = nav;
  const [RubicData, setRubicData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const [nameP, setNameP] = useState("");

  const handleSave = async () => {
    try {
      if (nameP === "") {
        alert("dữ liệu lỗi")
        document.getElementById("name-program").focus();
        return;
      }
      const data = {
        programName: nameP
      }
      await axiosAdmin.post('/program', { data: data });
    } catch (error) {
      console.log(error);
    }
  }

  const GetRubicAndItemsById = async () => {
    const response = await axiosAdmin.get(`/rubric/${id}/items`)
    console.log(response.data.rubric.rubricItems);
    setRubicData(response.data.rubric.rubricItems)
  }
  const [current, setCurrent] = useState(0);
  const onChangexxx = (nameP) => {

    setCurrent(nameP);
  };

  const [fileList, setFileList] = useState([]);

  const handleDownloadProgram = async () => {
    try {
      const response = await axiosAdmin.get('csv/program', {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'program.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const description = 'This is a description.';
  useEffect(() => {
    GetRubicAndItemsById()
    //allProgramIsDelete()
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
      //console.log(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
      <div>
        <div className="w-fit flex border justify-start text-base font-bold rounded-lg">
          <Link to={"/admin/manage-program"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              DS Chương trình
            </div>
          </Link>
          <Link to={"/admin/manage-program/store"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              Kho lưu trữ
            </div>
          </Link>
          <Link to={"/admin/manage-program/create"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              Tạo chương trình
            </div>
          </Link>
          <Link to={"/admin/manage-program/update"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              update
            </div>
          </Link>
          <Link to={"/admin/manage-program/po-plo"}>
            <div className="p-5 hover:bg-slate-600 hover:text-white">
              PO-PLO
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full mt-5 rounded-lg">
      
      {RubicData.map((rubricItem) => (
  <div className="w-full flex justify-center" key={rubricItem.rubric_id}>
    <div>
      {/* Content for the first div */}
    </div>
    <div className="w-[60%]">
    <MyEditor />
    </div>
    <div>
      {/* Content for the third div */}
    </div>
  </div>
))}

      </div>
    </div>
  );
}


export default UpdateRubic;
