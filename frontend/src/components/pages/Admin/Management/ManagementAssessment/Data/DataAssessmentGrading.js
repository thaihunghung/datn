import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchAssessmentDataGrading = async (teacher_id, descriptionURL, searchTerm = "") => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&description=${descriptionURL}&isDelete=false`);
    const updatedPoData = response?.data?.map((assessment) => {
      const student = {
        student_id: assessment?.Student?.student_id,
        studentCode: assessment?.Student?.studentCode,
        name: assessment?.Student.name
      }
      const action = {
        totalScore: assessment?.totalScore,
        assessment_id: assessment?.assessment_id,
        rubric_id: assessment?.rubric_id,
        description: assessment?.description,
        studentCode: assessment?.Student?.studentCode,
        date: assessment?.date,
        place: assessment?.place,
        teacher_id: assessment?.teacher_id,
        course_id: assessment?.course_id,
      }
      return {
        id: assessment?.assessment_id,
        description: assessment?.description,
        totalScore: assessment?.totalScore,
        student: student,
        class: assessment?.Student?.class?.classNameShort,
        action: action,
      };
    });
    const uniqueClasses = [...new Set(updatedPoData.map(item => item.class))];
    const classOptions = uniqueClasses.map(className => ({
      value: className,
      label: className
    }));


    const RubricArray = [
      {
        rubric_id: response?.data[0]?.Rubric?.rubric_id,
        rubricName: response?.data[0]?.Rubric?.rubricName
      }
    ]
    const CourseArray = [{
      course_id: response?.data[0]?.course?.course_id,
      courseCode: response?.data[0]?.course?.courseCode,
      courseName: response?.data[0]?.course?.courseName
    }
    ]
    return {
      Assessment: updatedPoData,
      Rubric_id: response?.data[0]?.rubric_id,
      Course_id: response?.data[0]?.course_id,
      Classes: classOptions,
      RubricArray: RubricArray,
      CourseArray: CourseArray
    };
  } catch (error) {
    console.error("Error: " + error.message);
  }
};

export const fetchStudentDataByCourseId = async (id) => {
  try {
    const response = await axiosAdmin.get(`/course-enrollment/getAllStudentByCourseId/${id}`);
    // [data:  {
    //     "student_id": 1,
    //     "class_id": 8,
    //     "studentCode": "110120013",
    //     "email": "110120013@st.tvu.edu.vn",
    //     "name": "Nguyễn Minh Đăng",
    //     "isDelete": 0,
    //     "class": {
    //         "classCode": "100000"
    //     }
    // }]
    return response.data.data;

  } catch (error) {
    console.error("Error: " + error.message);
  }
};



const columns = [
  { name: "id", uid: "id", sortable: true },
  { name: "description", uid: "description", sortable: true },
  { name: "class", uid: "class", sortable: true },
  { name: "student", uid: "student", sortable: true },
  { name: "totalScore", uid: "totalScore", sortable: true },
  { name: "action", uid: "action", sortable: true },


  // {name: "ROLE", uid: "role", sortable: true},
  // {name: "TEAM", uid: "team"},
  // {name: "EMAIL", uid: "email"},
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  { name: "SV chưa chấm", totalScore: 0 },
];





export { columns, statusOptions };
