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
const { blogType, userType } = require("./types");

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
      type: blogType,
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
          return locateEntry;
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
        return locateEntry;
      },
    },

    basicupdateblog: {
      type: blogType,
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
        return locateEntry;
      },
    },
    
    basicdeleteblog: {
      type: blogType,
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
        return locateEntry;
      },
    },
  }),
});

module.exports = RootMutationType;
