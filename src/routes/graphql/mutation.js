
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require("graphql");
const users = require("../../models").users;
const blog = require("../../models").blogposts;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../../../utils/logger");
const {blogType,userType,MessageType}=require("./types");


const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    adminupdateusers: {
      type: userType,
      description: "Update a particular user",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        let finduser = users.findOne({ where: { id: args.id, role: "basic" } });
        if (finduser) {
          const newbody = {
            id: args.id,
            email: args.email,
          };
          users.update(newbody, { where: { id: args.id } });
          let finduserblog = blog.findOne({ where: { id: args.id } });
          if (finduserblog) {
            blog.update(newbody, { where: { id: args.id } });
          }
        }

        return finduser;
      },
    },

    admindeleteusers: {
      type: userType,
      description: "Delete a particular user",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        let finduser = users.findOne({ where: { id: args.id, role: "basic" } });
        if (finduser) {
          users.destroy({ where: { id: args.id } });
          let finduserblog = blog.findOne({ where: { id: args.id } });
          if (finduserblog) {
            blog.destroy({ where: { id: args.id } });
          }
        }
        return finduser;
      },
    },

    basicpostblog: {
      type: MessageType,
      description: "Post a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        post: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let locateEntry = await blog.findOne({ where: { id: args.id } });
        if (locateEntry) {
          const getEntry = locateEntry.toJSON();
          const getPost = getEntry.post;
          var setPost = JSON.parse(getPost);
          var addObj = { title: args.title, post: args.post };
          setPost.push(addObj);
          setPost = JSON.stringify(setPost);
          blog.update(
            {
              id: args.id,
              email: getEntry.email,
              post: setPost,
            },
            { where: { id: args.id } }
          );
        } else {
          const locatefromUser = await users.findOne({
            where: { id: args.id },
          });
          const getfromUser = locatefromUser.toJSON();
          const getEmail = getfromUser.email;
          var postarray = [];
          var postobj = { title: args.title, post: args.post };
          postarray.push(postobj);
          var pusharray = JSON.stringify(postarray);
          blog.create({
            id: args.id,
            email: getEmail,
            post: pusharray,
          });
        }
        return { successful: true, message: "Blog added" };
      },
    },

    basicupdateblog: {
      type: MessageType,
      description: "Update a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        post: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parents, args) => {
        const locateEntry = await blog.findOne({ where: { id: args.id } });
        const getEntry = locateEntry.toJSON();
        const getPost = getEntry.post;
        var setPost = JSON.parse(getPost);
        setPost.map((user) => {
          if (user["title"] === args.title) {
            user["post"] = args.post;
          }
        });
        setPost = JSON.stringify(setPost);
        blog.update(
          {
            id: args.id,
            email: getEntry.email,
            post: setPost,
          },
          { where: { id: args.id } }
        );
        return { successful: true, message: "Blog updated" };
      },
    },

    basicdeleteblog: {
      type: MessageType,
      description: "Delete a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parents, args) => {
        const locateEntry = await blog.findOne({ where: { id: args.id } });
        const getEntry = locateEntry.toJSON();
        const getPost = getEntry.post;
        var setPost = JSON.parse(getPost);
        setPost = setPost.filter((user) => {
          if (user["title"] != args.title) {
            return 1;
          }
        });
        setPost = JSON.stringify(setPost);
        blog.update(
          {
            id: args.id,
            email: getEntry.email,
            post: setPost,
          },
          { where: { id: args.id } }
        );
        return { successful: true, message: "Blog Deleted" };
      },
    },

    register: {
      type: MessageType,
      description: "User registration",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parents, args) => {
        const alreadyExistUser = await users
          .findOne({ where: { email: args.email } })
          .catch((err) => {
            logger.customLogger.log("error", "Error: " + err);
          });

        if (alreadyExistUser) {
          return { successful: true, message: "User with Email exists" };
        }
        users.create({
          id: args.id,
          email: args.email,
          password: args.password,
          role: args.role,
        });
        return { successful: true, message: "User Registered" };
      },
    },

    login: {
      type: MessageType,
      description: "User Login",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parents, args) => {
        const userWithEmail = await users
          .findOne({ where: { email: args.email } })
          .catch((err) => {
            logger.customLogger.log("error", "Error: " + err);
          });

        if (!userWithEmail) {
          return {
            successful: true,
            message: "Email or password does not match",
          };
        }
        if (await bcrypt.compare(args.password, userWithEmail.password)) {
          const user = { id: userWithEmail.id, email: userWithEmail.email };
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY);
          users.update(
            { refreshtoken: refreshToken },
            { where: { id: userWithEmail.id } }
          );
          return { successful: true, message: "Welcome back" };
        } else {
          return {
            successful: true,
            message: "Email or password does not match",
          };
        }
      },
    },

    changepassword: {
      type: MessageType,
      desscription: "Change user password",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        oldpassword: { type: GraphQLNonNull(GraphQLString) },
        newpassword: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parents, args) => {
        const locateEntry = await users.findOne({
          where: { email: args.email },
        });
        const getEntry = locateEntry.toJSON();
        const oldpassword = getEntry.password;
        const hashedPassword = await bcrypt.hash(args.newpassword, 10);
        console.log(args.oldpassword);
        console.log(oldpassword);
        if (await bcrypt.compare(args.oldpassword, oldpassword)) {
          users.update(
            {
              password: hashedPassword,
            },
            { where: { id: getEntry.id } }
          );
          return {
            successful: true,
            message: "Password updated",
          };
        } else {
          return {
            successful: true,
            message: "Enter the old password correctly",
          };
        }
      },
    },

  }),
});

module.exports=RootMutationType