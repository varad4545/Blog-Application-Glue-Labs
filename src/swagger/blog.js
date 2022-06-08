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
 *  components:
 *    schemas:
 *      postblog: 
 *        type: object
 *        properties: 
 *          title:
 *            type: string
 *          post:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      findblog: 
 *        type: object
 *        properties: 
 *          title:
 *            type: string
 */

/**
 * @swagger
 * /basic/getallblogs/{id}:
 *   get:
 *     summary: Returns the list of all blogs of a user
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of all blogs of user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/blog'
 *       404:
 *         description: Not found
 */


/**
 * @swagger
 * /basic/postblog/{id}:
 *  post:
 *    description: Posting Blogs
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
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: Blog is succesfully posted
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

/**
 * @swagger
 * /basic/deleteblog/{id}:
 *  delete:
 *    description: Deleting blogs
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
 *            $ref: '#components/schemas/findblog'
 *    responses:
 *      '200':
 *        description: Blog is succesfully deleted
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

/**
 * @swagger
 * /basic/updateblog/{id}:
 *  put:
 *    description: Updateing blogs
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
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: Blog succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */