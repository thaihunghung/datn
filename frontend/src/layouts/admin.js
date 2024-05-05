
import { Link, Route, Routes } from 'react-router-dom';

// import Post from "../components/pages/Admin/Post/Post";
import { useState } from "react";
import { message, Spin } from 'antd';

import StoreProgram from '../components/pages/Admin/Manage/ManageProgram/StoreProgram';
import CreateProgram from '../components/pages/Admin/Manage/ManageProgram/CreateProgram';
import PoPlo from '../components/pages/Admin/Manage/ManageProgram/PoPlo';

import StorePo from '../components/pages/Admin/Manage/ManagePo/StorePo';
import CreatePo from '../components/pages/Admin/Manage/ManagePo/CreatePo';


import CreatePlo from '../components/pages/Admin/Manage/ManagePlo/CreatePlo';
import StorePlo from '../components/pages/Admin/Manage/ManagePlo/StorePlo';
import UpdateProgram from '../components/pages/Admin/Manage/ManageProgram/UpdateProgram';
import UpdateProgramById from '../components/pages/Admin/Manage/ManageProgram/UpdateProgramById';
import Nav from '../components/pages/Admin/Utils/Navbar/Navbar';
import Program from '../components/pages/Client/Program/Program';
import UpdatePoById from '../components/pages/Admin/Manage/ManagePo/UpdatePoById';
import UpdatePloById from '../components/pages/Admin/Manage/ManagePlo/UpdatePloById';
import UpdatePo from '../components/pages/Admin/Manage/ManagePo/UpdatePo';
import UpdatePlo from '../components/pages/Admin/Manage/ManagePlo/UpdatePlo';
import ManageProgram from '../components/pages/Admin/Manage/ManageProgram/ManageProgram';
import ManagePo from '../components/pages/Admin/Manage/ManagePo/ManagePo';
import ManagePlo from '../components/pages/Admin/Manage/ManagePlo/ManagePlo';


// import UserManager from "../components/pages/Admin/UserManager/UserManager";
// import PostStored from "../components/pages/Admin/Post/PostStored";
// import CategoryManager from "../components/pages/Admin/CategoryManager/CategoryManager";
// import UpdatePost from "../components/pages/Admin/Post/UpdatePost";
// import CreatePost from "../components/pages/Admin/Post/CreatePost";
// import PostCategory from "../components/pages/Admin/CategoryManager/PostCategory";
// import UpdateCategory from "../components/pages/Admin/CategoryManager/UpdateCategory";
// import DepartmentManager from "../components/pages/Admin/DepartmentManager/DepartmentManager.js";
// import UpdateDepartment from "../components/pages/Admin/DepartmentManager/UpdateDepartment.js";
// import CreateDepartment from "../components/pages/Admin/DepartmentManager/CreateDepartment.js";

function Admin(props) {

  const [collapsedNav, setCollapsedNav] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false);

  const { user } = props;

  const successNoti = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };
  const errorNoti = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  return (
    <div className="Admin flex flex-col sm:flex-row lg:flex-row xl:flex-row  h-[100vh]">
      <Spin spinning={spinning} fullscreen />
      <Nav collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} setSpinning={setSpinning} user={user}/>
      <div className='Admin-Content flex-1 h-full overflow-auto p-2 sm:p-5 sm:px-7 lg:p-5 lg:px-7 xl:p-5 xl:px-7'>
        <Routes>
          <Route path="/manage-program" element={<ManageProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-program/store" element={<StoreProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-program/create" element={<CreateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-program/po-plo" element={<PoPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-program/update" element={<UpdateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-program/update/:id" element={<UpdateProgramById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/Program" element={<Program collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          
          
          <Route path="/manage-po" element={<ManagePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-po/store" element={<StorePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-po/create" element={<CreatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-po/update" element={<UpdatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-po/update/:id" element={<UpdatePoById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/manage-plo" element={<ManagePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-plo/store" element={<StorePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-plo/create" element={<CreatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-plo/update" element={<UpdatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/manage-plo/update/:id" element={<UpdatePloById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
        </Routes> 
      </div>
    </div>
  );
}

export default Admin;
