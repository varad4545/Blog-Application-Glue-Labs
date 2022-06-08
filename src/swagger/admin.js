/**
 * @swagger
 *  components:
 *    schemas:
 *      User: 
 *        type: object
 *        properties: 
 *          id:
 *            type: number
 *          email:
 *            type: string
 *          password:
 *            type: string   
 *          role:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      blog: 
 *        type: object
 *        properties: 
 *          id:
 *            type: number
 *          email:
 *            type: string
 *          post:
 *            type: string     
 */


/**
 * @swagger
 * /admin/getusers/{id}:
 *   get:
 *     summary: Returns the list of all basic users
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: The users were not found
 */

/**
 * @swagger
 * /admin/getblogs/{id}:
 *   get:
 *     summary: Returns the list of all blogs
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/blog'
 *       404:
 *         description: The users were not found
 */

/**
 * @swagger
 * /admin/deleteusers/{id}:
 *  delete:
 *    description: Use to delete users
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema: 
 *          type: number
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: User is succesfully deleted
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

/**
 * @swagger
 * /admin/updateusers/{id}:
 *  put:
 *    description: Use to update user data
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema: 
 *          type: number
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: User data is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */