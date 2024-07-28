import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchAssessmentData = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&isDelete=false`);
    const Data = response.data.map((items) => ({
        id: items?.course_id,
        description: items?.description,
        assessmentCount: items?.assessmentCount,
        studentCount: items?.studentCount,
        nameCourse: items?.course,
        status: items?.status,
        action: items?.description,
        createdAt: items?.createdAt
    }));
    return Data;
  } catch (error) {
    console.error("Error: " + error.message);
  }
};



const columns = [
  {name: "id", uid: "id", sortable: true},
  {name: "description", uid: "description", sortable: true},
  {name: "assessmentCount", uid: "assessmentCount", sortable: true},
  {name: "studentCount", uid: "studentCount", sortable: true},
  {name: "nameCourse", uid: "nameCourse", sortable: true},
  {name: "createdAt", uid: "createdAt", sortable: true},
  {name: "status", uid: "status", sortable: true},
  {name: "action", uid: "action", sortable: true},
];

const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
