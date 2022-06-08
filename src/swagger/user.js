
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
 *      LoginUser: 
 *        type: object
 *        properties: 
 *          email:
 *            type: string
 *          password:
 *            type: string  
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      changepassword: 
 *        type: object
 *        properties: 
 *          email:
 *            type: string
 *          oldpassword:
 *            type: string
 *          newpassword:
 *            type: string
 */

/**
 * @swagger
 * /register:
 *  post:
 *    description: Register Page
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: Successfully registered
 */

/**
 * @swagger
 * /login:
 *  post:
 *    description: Login Page
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/LoginUser'
 *    responses:
 *      '200':
 *        description: Successfully login
 */

/**
 * @swagger
 * /changepassword:
 *  post:
 *    description: Change Password
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/changepassword'
 *    responses:
 *      '200':
 *        description: Successfully changed password
 */

/**
 * @swagger
 * /refreshToken/{id}:
 *  get:
 *    description: New access Token
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *    responses:
 *      '200':
 *        description: Successfully created new access Token
 */

/**
 * @swagger
 * /logout/{id}:
 *  delete:
 *    description: Logging out
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *    responses:
 *      '200':
 *        description: Successfully Logging out
 */