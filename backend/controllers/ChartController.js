const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");


const ChartController = {
  // tỉ lệ đạt được clo trên subject
  getCourseAssessmentScores: async (req, res) => {
    console.log("okok");
    try {
      const results = await sequelize.query(
        `SELECT
              s.subject_id,
              s.subjectName,
              c.clo_id,
              c.cloName,
              SUM(ai.assessmentScore) AS totalScoreAchieved,
              SUM(ri.maxScore) AS totalMaxScore,
              (SUM(ai.assessmentScore) / SUM(ri.maxScore)) AS percentage_score
          FROM
              assessmentItems ai
          JOIN
              rubricsItems ri ON ai.rubricsItem_id = ri.rubricsItem_id
          JOIN
              rubrics r ON ri.rubric_id = r.rubric_id
          JOIN
              subjects s ON r.subject_id = s.subject_id
          JOIN
              clos c ON ri.clo_id = c.clo_id
          WHERE
              ai.isDelete = 0
              AND ri.isDelete = 0
              AND r.isDelete = 0
              AND s.isDelete = 0
              AND c.isDelete = 0
          GROUP BY
              s.subject_id, s.subjectName, c.clo_id, c.cloName
          ORDER BY
              s.subject_id, c.clo_id;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const formattedResults = results.reduce((acc, result) => {
        const { subject_id, subjectName, clo_id, cloName, description, percentage_score } = result;

        if (!acc[subject_id]) {
          acc[subject_id] = {
            subject_id,
            subjectName,
            clos: []
          };
        }

        acc[subject_id].clos.push({
          clo_id,
          cloName,
          description,
          percentage_score
        });

        return acc;
      }, {});

      res.json(Object.values(formattedResults));
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // phần trăm clo theo suject
  averageScoresPerSubject: async (req, res) => {
    try {
      const results = await sequelize.query(
        `SELECT
            ROUND(AVG(a.totalScore), 2) AS averageScore,
            s.subject_id AS subject_id,
            s.subjectName AS subjectName
        FROM
            assessments AS a
        LEFT JOIN courses AS c
            ON a.course_id = c.course_id
        LEFT JOIN subjects AS s
            ON c.subject_id = s.subject_id
        GROUP BY
            s.subject_id, s.subjectName;
        `,
        {
          type: Sequelize.QueryTypes.SELECT,

        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching average scores per subject:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  // lấy điểm của 1 sinh viên
  getStudentPerformanceByCourse: async (req, res) => {
    try {
      const { student_id } = req.params;
      const results = await sequelize.query(
        `SELECT 
            a.assessment_id, 
            a.totalScore, 
            s.student_id AS student_id, 
            s.studentCode AS studentCode, 
            s.name AS studentName, 
            s.date_of_birth AS studentDOB, 
            c.class_id AS class_id, 
            c.className AS className, 
            c.classCode AS classCode, 
            c.classNameShort AS classNameShort, 
            cr.course_id AS course_id, 
            cr.courseName AS courseName, 
            sub.subject_id AS subject_id, 
            sub.subjectName AS subjectName, 
            sem.semester_id AS semester_id, 
            sem.descriptionShort AS semesterDescriptionShort, 
            ay.academic_year_id AS academic_year_id, 
            ay.startDate AS academicYearStartDate, 
            ay.endDate AS academicYearEndDate, 
            ay.description AS academicYearDescription
        FROM 
            assessments AS a
        LEFT JOIN students AS s
            ON a.student_id = s.student_id
        LEFT JOIN classes AS c
            ON s.class_id = c.class_id
        LEFT JOIN courses AS cr
            ON a.course_id = cr.course_id
        LEFT JOIN subjects AS sub
            ON cr.subject_id = sub.subject_id
        LEFT JOIN semester_academic_years AS say
            ON cr.id_semester_academic_year = say.id_semester_academic_year
        LEFT JOIN semesters AS sem
            ON say.semester_id = sem.semester_id
        LEFT JOIN academic_years AS ay
            ON say.academic_year_id = ay.academic_year_id
        WHERE 
            a.student_id = :student_id
            AND a.isDelete = false
        ORDER BY 
            ay.startDate ASC;`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { student_id }
        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching student performance by course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
   // average scores by course with optional course_id_list filter
   
  // average scores by course with optional course_id_list filter
  getAverageCourseScores: async (req, res) => {
    try {
      const { data: course_id_list } = req.body;
      const courseIdFilter = course_id_list && course_id_list.length > 0 ? 'AND c.course_id IN (:course_id_list)' : '';

      const results = await sequelize.query(
        `SELECT
            c.course_id,
            c.courseName,
            ay.academic_year_id,
            ay.description AS academic_year,
            s.semester_id,
            s.descriptionShort AS semester,
            t.teacher_id,
            t.name AS teacherName,
            cl.class_id,
            cl.className,
            AVG(a.totalScore) AS averageScore
        FROM
            courses c
        JOIN
            semester_academic_years say ON c.id_semester_academic_year = say.id_semester_academic_year
        JOIN
            academic_years ay ON say.academic_year_id = ay.academic_year_id
        JOIN
            semesters s ON say.semester_id = s.semester_id
        JOIN
            assessments a ON c.course_id = a.course_id
        JOIN
            teachers t ON c.teacher_id = t.teacher_id
        JOIN
            classes cl ON c.class_id = cl.class_id
        WHERE
            c.isDelete = 0
            AND ay.isDelete = 0
            AND s.isDelete = 0
            AND a.isDelete = 0
            ${courseIdFilter}
        GROUP BY
            c.course_id, c.courseName, ay.academic_year_id, ay.description, s.semester_id, s.descriptionShort, t.teacher_id, t.name, cl.class_id, cl.className
        ORDER BY
            ay.academic_year_id, s.semester_id, c.course_id;`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: course_id_list && course_id_list.length > 0 ? { course_id_list } : {},
        }
      );

      res.json(results);
    } catch (error) {
      console.error('Error fetching average course scores:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};

module.exports = ChartController;
