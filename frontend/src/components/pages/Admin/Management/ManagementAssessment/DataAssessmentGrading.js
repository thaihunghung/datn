import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchAssessmentDataGrading = async (teacher_id, descriptionURL, searchTerm = "") => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&description=${descriptionURL}`);
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
        action: action,
      };
    });
    const uniqueClasses = [...new Set(updatedPoData.map(item => item.class))];
    const classOptions = uniqueClasses.map(className => ({
      value: className,
      label: className
    }));
    return {
      Assessment: updatedPoData,
      Rubric_id: response?.data[0]?.rubric_id,
      Course_id: response?.data[0]?.course_id,
      Classes: classOptions
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
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
