import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchAssessmentData = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&isDelete=false`);
    const Data = response?.data?.map((items) => ({
        id: items?.course_id ?? null,
        description: items?.description ?? '',
        assessmentCount: items?.assessmentCount ?? 0,
        studentCount: items?.studentCount ?? 0,
        courseName: items?.courseName ?? '',
        status: items?.status ?? '',
        action: items?.description ?? '',
        Assessment: {
          rubric_id: items?.Assessment?.rubric_id ?? null,
          course_id: items?.Assessment?.course_id ?? null,
          description: items?.Assessment?.description ?? '',
          date: items?.Assessment?.date ?? '',
          place: items?.Assessment?.place ?? '',
        },
        RubicItemsData: items?.Assessment?.Rubric?.rubricItems ?? [],
        RubicData: items?.Assessment?.Rubric ?? null,
        createdAt: items?.createdAt ?? ''
    }));
    return Data;
  } catch (error) {
    console.error("Error: " + error.message);
    return []; // Trả về một mảng rỗng trong trường hợp lỗi
  }
};


export const fetchAssessmentDataTrue = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&isDelete=true`);
    const Data = response?.data?.map((items) => ({
        key: items?.description,
        description: items?.description,
        assessmentCount: items?.assessmentCount,
        studentCount: items?.studentCount,
        courseName: items?.courseName,
        status: items?.status,
        action: items?.description,
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
  {name: "courseName", uid: "courseName", sortable: true},
  {name: "createdAt", uid: "createdAt", sortable: true},
  {name: "status", uid: "status", sortable: true},
  {name: "action", uid: "action", sortable: true},
];

const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
