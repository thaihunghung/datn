
import { Link, Route, Routes } from 'react-router-dom';
import { useState } from "react";
import { message, Spin } from 'antd';



import ManagePo from '../components/pages/Admin/Management/ManagementPo/ManagePo';
import StorePo from '../components/pages/Admin/Management/ManagementPo/StorePo';
import CreatePo from '../components/pages/Admin/Management/ManagementPo/CreatePo';
import UpdatePo from '../components/pages/Admin/Management/ManagementPo/UpdatePo';
import UpdatePoById from '../components/pages/Admin/Management/ManagementPo/UpdatePoById';
import ManagePlo from '../components/pages/Admin/Management/ManagementPlo/ManagePlo';
import StorePlo from '../components/pages/Admin/Management/ManagementPlo/StorePlo';
import CreatePlo from '../components/pages/Admin/Management/ManagementPlo/CreatePlo';
import UpdatePlo from '../components/pages/Admin/Management/ManagementPlo/UpdatePlo';
import UpdatePloById from '../components/pages/Admin/Management/ManagementPlo/UpdatePloById';
import PloClo from '../components/pages/Admin/Management/ManagementClo/PloClo';
import FormPoint from '../components/pages/Admin/FormPoint/FormPoint';
import Program from '../components/pages/Client/Program/Program';
import Nav from '../components/pages/Admin/Utils/Navbar/Navbar';

import MyEditor from '../components/pages/Admin/Utils/MyEditor/MyEditor';
import Student from '../components/pages/Admin/Management/ManagementStudent/Student';
import CreateStudent from '../components/pages/Admin/Management/ManagementStudent/CreateStudent';
import UpdateStudentById from '../components/pages/Admin/Management/ManagementStudent/UpdateStudentById';
import UpdateStudent from '../components/pages/Admin/Management/ManagementStudent/UpdateStudent';
import StoreStudent from '../components/pages/Admin/Management/ManagementStudent/StoreStudent';
import ManageProgram from '../components/pages/Admin/Management/ManagementProgram/ManageProgram';
import StoreProgram from '../components/pages/Admin/Management/ManagementProgram/StoreProgram';
import CreateProgram from '../components/pages/Admin/Management/ManagementProgram/CreateProgram';
import UpdateProgram from '../components/pages/Admin/Management/ManagementProgram/UpdateProgram';
import UpdateProgramById from '../components/pages/Admin/Management/ManagementProgram/UpdateProgramById';
import PoPlo from '../components/pages/Admin/Management/ManagementProgram/PoPlo';
import ManagementRubric from '../components/pages/Admin/Management/ManagementRubric/ManagementRubric';
import CreateRubic from '../components/pages/Admin/Management/ManagementRubric/CreateRubic';
import UpdateRubic from '../components/pages/Admin/Management/ManagementRubric/UpdateRubic';
import Template from '../components/pages/Client/Template/Template';
import CloChapter from '../components/pages/Admin/Management/ManagementClo/CloChapter';

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
    <div className="Admin flex flex-col sm:flex-row lg:flex-row xl:flex-row  h-[100vh] bg-[#FEFEFE]">
      <Spin spinning={spinning} fullscreen />
      <Nav collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} setSpinning={setSpinning} user={user}/>
      <div className='Admin-Content flex-1 h-full overflow-auto p-2 sm:p-5 sm:px-7 lg:p-5 lg:px-2 xl:p-5 xl:px-2'>
        <Routes>
          <Route path="/management-program/description" element={<ManageProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/store" element={<StoreProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/create" element={<CreateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/po-plo" element={<PoPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/update" element={<UpdateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/update/:id" element={<UpdateProgramById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/Program" element={<Program collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          
          <Route path="/hung" element={<Template collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          

          <Route path="/management-po" element={<ManagePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/store" element={<StorePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/create" element={<CreatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/update" element={<UpdatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/update/:id" element={<UpdatePoById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          
          <Route path="/management-plo" element={<ManagePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/store" element={<StorePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/create" element={<CreatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/update" element={<UpdatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/update/:id" element={<UpdatePloById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
        
          {/* <Route path="/management-rubric" element={<Rubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} /> */}

          <Route path="/management-clo/plo-clo" element={<PloClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-clo/clo-chapter" element={<CloChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/management-point" element={<FormPoint collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric" element={<ManagementRubric collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/create" element={<CreateRubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/update/:id" element={<UpdateRubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          
          <Route path="/student" element={<Student collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/student/create" element={<CreateStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/update" element={<UpdateStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/update/:id" element={<UpdateStudentById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/store" element={<StoreStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          
        </Routes> 
      </div>
    </div>
  );
}

export default Admin;
