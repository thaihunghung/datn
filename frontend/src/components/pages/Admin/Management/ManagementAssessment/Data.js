import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchAssessmentData = async (teacher_id, descriptionURL, searchTerm = "") => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&description=${descriptionURL}`);
    console.log(response?.data);
    
    // console.log("description", description);
    const updatedPoData = response?.data?.map((subject) => {
      const student = {
        studentCode: subject?.Student?.studentCode,
        name: subject?.Student.name
      }
      const action = {
        totalScore: subject?.totalScore,
        assessment_id: subject?.assessment_id,
        rubric_id: subject?.rubric_id,
        description: subject?.description,
        studentCode: subject?.Student?.studentCode
      }
      return {
        id: subject?.assessment_id,
        description: subject?.description,
        totalScore: subject?.totalScore,
        student: student,
        class: subject?.Student?.class?.classNameShort,
        action: action
      };
    });

    // setRubric_id(response?.data[0]?.rubric_id)
    // setCouse_id(response?.data[0]?.course_id)
    // setAssessments(updatedPoData);
    console.log(updatedPoData);
    return {
      Assessment: updatedPoData,
      Rubric_id: response?.data[0]?.rubric_id,
      Course_id: response?.data[0]?.course_id
    };
  } catch (error) {
    console.error("Error: " + error.message);
  }
};


const columns = [
  {name: "id", uid: "id", sortable: true},
  {name: "description", uid: "description", sortable: true},
  {name: "class", uid: "class", sortable: true},
  {name: "student", uid: "student", sortable: true},
  {name: "totalScore", uid: "totalScore", sortable: true},
  {name: "action", uid: "action", sortable: true},


  // {name: "ROLE", uid: "role", sortable: true},
  // {name: "TEAM", uid: "team"},
  // {name: "EMAIL", uid: "email"},
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "SV chưa chấm", uid: "1", totalScore:0},
];





export {columns, statusOptions};
