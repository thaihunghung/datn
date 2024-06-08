
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { message, Spin } from 'antd';

import ManagePo from '../components/pages/Admin/Management/ManagementPo/ManagePo';
import StorePo from '../components/pages/Admin/Management/ManagementPo/StorePo';
import CreatePo from '../components/pages/Admin/Management/ManagementPo/CreatePo';
import UpdatePoById from '../components/pages/Admin/Management/ManagementPo/UpdatePoById';
import ManagePlo from '../components/pages/Admin/Management/ManagementPlo/ManagePlo';
import StorePlo from '../components/pages/Admin/Management/ManagementPlo/StorePlo';
import CreatePlo from '../components/pages/Admin/Management/ManagementPlo/CreatePlo';
import UpdatePloById from '../components/pages/Admin/Management/ManagementPlo/UpdatePloById';
import FormPoint from '../components/pages/Admin/FormPoint/FormPoint';
import Program from '../components/pages/Client/Program/Program';
import Nav from '../components/pages/Admin/Utils/Navbar/Navbar';
import Student from '../components/pages/Admin/Management/ManagementStudent/Student';
import CreateStudent from '../components/pages/Admin/Management/ManagementStudent/CreateStudent';
import UpdateStudentById from '../components/pages/Admin/Management/ManagementStudent/UpdateStudentById';
import UpdateStudent from '../components/pages/Admin/Management/ManagementStudent/UpdateStudent';
import StoreStudent from '../components/pages/Admin/Management/ManagementStudent/StoreStudent';
import ManageProgram from '../components/pages/Admin/Management/ManagementProgram/ManageProgram';
import CreateProgram from '../components/pages/Admin/Management/ManagementProgram/CreateProgram';
import UpdateProgram from '../components/pages/Admin/Management/ManagementProgram/UpdateProgram';
import PoPlo from '../components/pages/Admin/Management/ManagementProgram/PoPlo';
import ManagementRubric from '../components/pages/Admin/Management/ManagementRubric/ManagementRubric';
import CreateRubic from '../components/pages/Admin/Management/ManagementRubric/CreateRubic';
import Template from '../components/pages/Client/Template/Template';
import Subject from '../components/pages/Admin/Management/ManagementSubject/Subject';
import Clo from '../components/pages/Admin/Management/ManagementSubject/Clo';
import CreateClo from '../components/pages/Admin/Management/ManagementSubject/CreateClo';
import CloPlo from '../components/pages/Admin/Management/ManagementSubject/CloPlo';
import Chapter from '../components/pages/Admin/Management/ManagementSubject/Chapter';
import ChapterClo from '../components/pages/Admin/Management/ManagementSubject/ChapterClo';
import UpdateClo from '../components/pages/Admin/Management/ManagementSubject/UpdateClo';
import CreateChapter from '../components/pages/Admin/Management/ManagementSubject/CreateChapter';
import StoreClo from '../components/pages/Admin/Management/ManagementSubject/StoreClo';
import UpdateChapter from '../components/pages/Admin/Management/ManagementSubject/UpdateChapter';
import StoreChapter from '../components/pages/Admin/Management/ManagementSubject/StoreChapter';
import UpdateSubject from '../components/pages/Admin/Management/ManagementSubject/UpdateSubject';
import StoreSubject from '../components/pages/Admin/Management/ManagementSubject/StoreSubject';
import CreateSubject from '../components/pages/Admin/Management/ManagementSubject/CreateSubject';
import Class from '../components/pages/Admin/Management/ManagementClass/Class';
import UpdateClass from '../components/pages/Admin/Management/ManagementClass/UpdateClass';
import StoreClass from '../components/pages/Admin/Management/ManagementClass/StoreClass';
import UpdateClassById from '../components/pages/Admin/Management/ManagementClass/UpdateClassById';
import CreateClass from '../components/pages/Admin/Management/ManagementClass/CreateClass';
import Course from '../components/pages/Admin/Management/ManagementCourse/Course';
import MangementRubricItems from '../components/pages/Admin/Management/ManagementRubric/MangementRubricItems';
import CreateRubicItems from '../components/pages/Admin/Management/ManagementRubric/CreateRubicItems';
import UpdateRubicItems from '../components/pages/Admin/Management/ManagementRubric/UpdateRubicItems';
import StoreRubric from '../components/pages/Admin/Management/ManagementRubric/StoreRubric';
import View from '../components/pages/Admin/Management/ManagementRubric/View';
import ManagementAssessment from '../components/pages/Admin/Management/ManagementAssessment/ManagementAssessment';
import StoreRubicItems from '../components/pages/Admin/Management/ManagementRubric/StoreRubicItems';
import DetailCourse from '../components/pages/Admin/Management/ManagementCourse/DetailCourse/DetailCourse';
import CreateAssessment from '../components/pages/Admin/Management/ManagementAssessment/CreateAssessment';
import Login from '../components/pages/Admin/Login/Login';
import UpdateRubricById from '../components/pages/Admin/Management/ManagementRubric/UpdateRubricById';
import ManagementAssessmentGrading from '../components/pages/Admin/Management/ManagementAssessment/ManagementAssessmentGrading';
import FormGrading from '../components/pages/Admin/Management/ManagementAssessment/FormGrading';
import Teacher from '../components/pages/Admin/Management/ManagementTeacher/Teacher';


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
    console.log("scsc");
  };
  const errorNoti = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  return (
    <div className="Admin flex flex-col sm:flex-row lg:flex-row xl:flex-row  h-[100vh] bg-[#FEFEFE]">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Nav collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} setSpinning={setSpinning} user={user}/>
      <div className='Admin-Content bg-[#FEFEFE] flex-1 h-full overflow-auto p-2 sm:p-5 sm:px-7 lg:p-5 lg:px-2 xl:p-5 xl:px-2'>
        <Routes>
          <Route path="/management-program/description" element={<ManageProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/create" element={<CreateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/po-plo" element={<PoPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-program/update" element={<UpdateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/Program" element={<Program collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          
          <Route path="/hung" element={<Template collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          
          <Route path="/point" element={<FormPoint collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />          

          <Route path="/management-po/list" element={<ManagePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/store" element={<StorePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/create" element={<CreatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-po/update/:id" element={<UpdatePoById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          
          <Route path="/management-plo/list" element={<ManagePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/store" element={<StorePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/create" element={<CreatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-plo/update/:id" element={<UpdatePloById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
        
          {/* <Route path="/management-rubric" element={<Rubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} /> */}

          <Route path="/management-subject/list" element={<Subject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/create" element={<CreateSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/store" element={<StoreSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/update/:id" element={<UpdateSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          
          <Route path="/management-subject/:id/clo/update" element={<Clo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/clo/update/:clo_id" element={<UpdateClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/clo/create" element={<CreateClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/clo/store" element={<StoreClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/clo-plo" element={<CloPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/management-subject/:id/chapter/update" element={<Chapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/chapter/create" element={<CreateChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/chapter/store" element={<StoreChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/chapter-clo" element={<ChapterClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-subject/:id/chapter/update/:chapter_id" element={<UpdateChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/management-grading/list" element={<ManagementAssessment collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-grading/:description" element={<ManagementAssessmentGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-grading/:description/student-code/:studentCode/assessment/:assessment_id/rubric/:rubric_id" element={<FormGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          
          <Route path="/management-grading/create" element={<CreateAssessment collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-grading" element={<ManagementAssessment collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          {/* <Route path="/management-point" element={<FormPoint collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} /> */}
          <Route path="/management-rubric/list" element={<ManagementRubric collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/create" element={<CreateRubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/update/:id" element={<UpdateRubricById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/store" element={<StoreRubric collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />


          <Route path="/management-rubric/:id/rubric-items/list" element={<MangementRubricItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/:id/rubric-items/create" element={<CreateRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/:id/rubric-items/store" element={<StoreRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/:id/rubric-items/:rubric_item_id" element={<UpdateRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/management-rubric/:id/rubric-items/template" element={<View collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/student" element={<Student collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/student/create" element={<CreateStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/update" element={<UpdateStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/update/:id" element={<UpdateStudentById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/student/store" element={<StoreStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/class" element={<Class collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/class/create" element={<CreateClass collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/class/update" element={<UpdateClass collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/class/update/:id" element={<UpdateClassById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/class/store" element={<StoreClass collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/course" element={<Course collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          <Route path="/course/:id" element={<DetailCourse collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />

          <Route path="/teacher" element={<Teacher collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} />
          
        </Routes> 
      </div>
    </div>
  );
}

export default Admin;
