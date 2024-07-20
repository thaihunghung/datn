const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Analysis API',
      version: '1.0.0',
      description: 'API for learning analysis, providing endpoints to manage and analyze learning data.',
      termsOfService: 'http://example.com/terms',
      contact: {
        name: 'API Support',
        url: 'http://example.com/support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:1509',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Rubric: {
          type: 'object',
          properties: {
            rubric_id: {
              type: 'integer',
              description: 'Unique identifier for the rubric',
            },
            subject_id: {
              type: 'integer',
              description: 'ID of the subject associated with the rubric',
            },
            teacher_id: {
              type: 'integer',
              description: 'ID of the teacher who created the rubric',
            },
            rubricName: {
              type: 'string',
              description: 'Name of the rubric',
            },
            comment: {
              type: 'string',
              description: 'Additional comments about the rubric',
            },
            isDelete: {
              type: 'boolean',
              description: 'Trạng thái xóa (false: chưa xóa, true: đã xóa)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the rubric was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the rubric was last updated',
            },
          },
          required: ['rubricName'],
        },
        RubricInput: {
          type: 'object',
          properties: {
            subject_id: {
              type: 'integer',
              description: 'ID of the subject associated with the rubric',
            },
            teacher_id: {
              type: 'integer',
              description: 'ID of the teacher who created the rubric',
            },
            rubricName: {
              type: 'string',
              description: 'Name of the rubric',
            },
            comment: {
              type: 'string',
              description: 'Additional comments about the rubric',
            },
            isDelete: {
              type: 'boolean',
              description: 'Trạng thái xóa (false: chưa xóa, true: đã xóa)',
            },
          },
          required: ['rubricName'],
        },
        RubricItem: {
          type: 'object',
          properties: {
            rubricsItem_id: {
              type: 'integer',
              description: 'Unique identifier for the rubric item',
            },
            chapter_id: {
              type: 'integer',
              description: 'ID of the chapter associated with the rubric item',
            },
            clo_id: {
              type: 'integer',
              description: 'ID of the CLO associated with the rubric item',
            },
            rubric_id: {
              type: 'integer',
              description: 'ID of the rubric associated with the rubric item',
            },
            plo_id: {
              type: 'integer',
              description: 'ID of the PLO associated with the rubric item',
            },
            description: {
              type: 'string',
              description: 'Description of the rubric item',
            },
            maxScore: {
              type: 'number',
              format: 'double',
              description: 'Maximum score for the rubric item',
            },
            stt: {
              type: 'integer',
              description: 'Sort order of the rubric item',
            },
            isDelete: {
              type: 'boolean',
              description: 'Trạng thái xóa',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the rubric item was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the rubric item was last updated',
            },
          },
          required: ['rubric_id'],
        },
        Subject: {
          type: 'object',
          properties: {
            subject_id: {
              type: 'integer',
              description: 'Unique identifier for the subject',
            },
            teacher_id: {
              type: 'integer',
              description: 'ID of the teacher who created the subject',
            },
            subjectName: {
              type: 'string',
              description: 'Name of the subject',
            },
            subjectCode: {
              type: 'string',
              description: 'Code of the subject',
            },
            description: {
              type: 'string',
              description: 'Description of the subject',
            },
            numberCredits: {
              type: 'integer',
              description: 'Number of credits for the subject',
            },
            numberCreditsTheory: {
              type: 'integer',
              description: 'Number of theory credits for the subject',
            },
            numberCreditsPractice: {
              type: 'integer',
              description: 'Number of practice credits for the subject',
            },
            typesubject: {
              type: 'string',
              description: 'Type of the subject (e.g., Đại cương, Cơ sở ngành)',
            },
            isDelete: {
              type: 'boolean',
              description: 'Trạng thái xóa (false: chưa xóa, true: đã xóa)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the subject was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the subject was last updated',
            },
          },
          required: ['subjectName', 'subjectCode'],
        },
        CLO: {
          type: 'object',
          properties: {
            clo_id: {
              type: 'integer',
              description: 'Unique identifier for the CLO',
            },
            cloName: {
              type: 'string',
              description: 'Name of the CLO',
            },
            description: {
              type: 'string',
              description: 'Description of the CLO',
            },
            isDelete: {
              type: 'boolean',
              description: 'Trạng thái xóa (false: chưa xóa, true: đã xóa)',
            },
            subject_id: {
              type: 'integer',
              description: 'ID of the subject associated with the CLO',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the CLO was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the CLO was last updated',
            },
          },
          required: ['cloName', 'subject_id'],
        },
        Program: {
          type: 'object',
          properties: {
            program_id: {
              type: 'integer',
              description: 'Unique identifier for the program',
            },
            programName: {
              type: 'string',
              description: 'Name of the program',
            },
            description: {
              type: 'string',
              description: 'Description of the program',
            },
            isDelete: {
              type: 'boolean',
              description: 'Status indicating whether the program is deleted',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the program was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the program was last updated',
            },
          },
          required: ['programName', 'description'],
        },
        ProgramInput: {
          type: 'object',
          properties: {
            programName: {
              type: 'string',
              description: 'Name of the program',
            },
            description: {
              type: 'string',
              description: 'Description of the program',
            },
            isDelete: {
              type: 'boolean',
              description: 'Status indicating whether the program is deleted',
            },
          },
          required: ['programName', 'description'],
        },
      },
    }

  },
  apis: ['./routes/*.js'], // Adjust this path as needed
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
