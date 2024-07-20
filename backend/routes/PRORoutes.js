const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramsController');
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 */
// get: /programs
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/programs:
 *   get:
 *     summary: Get all programs
 *     tags:
 *       - Programs
 *     responses:
 *       '200':
 *         description: A list of programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 */
// post: /program
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program:
 *   post:
 *     summary: Create a new program
 *     tags:
 *       - Programs
 *     requestBody:
 *       description: Program data to be created
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgramInput'
 *       required: true
 *     responses:
 *       '201':
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 */
// get: /program/:id
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/{id}:
 *   get:
 *     summary: Get a program by ID
 *     tags:
 *       - Programs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Program details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Program not found
 */
// put: /program/:id
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/{id}:
 *   put:
 *     summary: Update a program by ID
 *     tags:
 *       - Programs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Program data to be updated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProgramInput'
 *       required: true
 *     responses:
 *       '200':
 *         description: Program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Program not found
 */
// delete: /program/:id
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/{id}:
 *   delete:
 *     summary: Delete a program by ID
 *     tags:
 *       - Programs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Program deleted successfully
 *       '404':
 *         description: Program not found
 */
// get: /program/isDelete/true
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/isDelete/true:
 *   get:
 *     summary: Get all deleted programs
 *     tags:
 *       - Programs
 *     responses:
 *       '200':
 *         description: A list of deleted programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 */
// get: /program/isDelete/false
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/isDelete/false:
 *   get:
 *     summary: Get all active programs
 *     tags:
 *       - Programs
 *     responses:
 *       '200':
 *         description: A list of active programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 */
// put: /program/isDelete/:id
/**
 * @openapi
 * tags:
 *   - name: Programs
 *     description: Operations related to Programs management
 * 
 * /api/admin/program/isDelete/{id}:
 *   put:
 *     summary: Toggle the isDelete status of a program
 *     tags:
 *       - Programs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: New isDelete status
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDelete:
 *                 type: boolean
 *                 description: New delete status
 *       required: true
 *     responses:
 *       '200':
 *         description: Program status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       '404':
 *         description: Program not found
 */


router.get('/programs', programController.index);
router.post('/program', programController.create);
router.get('/program/:id', programController.getByID);
router.put('/program/:id', programController.update);
router.delete('/program/:id', programController.delete);
router.get('/program/isDelete/true', programController.isDeleteTotrue);
router.get('/program/isDelete/false', programController.isDeleteTofalse);
router.put('/program/isDelete/:id', programController.toggleIsDelete);


router.get('/program/templates/post', programController.getFormPost);

module.exports = router;
