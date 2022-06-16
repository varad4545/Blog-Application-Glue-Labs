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

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    admingetbasicusers: {
      type: new GraphQLList(userType),
      description: "List of all basic users",
      resolve: () => {
        const getusers = users.findAll({ where: { role: "basic" } });
        return getusers;
      },
    },
    admingetallblogs: {
      type: new GraphQLList(blogType),
      description: "List of all blogs",
      resolve: () => {
        const getblogs = blog.findAll();
        return getblogs;
      },
    },
    basicgetblog: {
      type: blogType,
      description: "Access individual blogs",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        let locateuser = await blog.findOne({ where: { id: args.id } });
        let getuser = locateuser.toJSON();
        let getPost = getuser.post;
        var setPost = JSON.parse(getPost);
        setPost = setPost.filter((user) => {
          if (user["title"] === args.title) {
            return 1;
          }
        });
        setPost = JSON.stringify(setPost);
        const getfinalpost = {
          post: setPost,
        };
        return getfinalpost;
      },
    },
    basicallBlogs: {
      type: blogType,
      description: "List of all all blogs of users",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) => {
        let locateuser = await blog.findOne({ where: { id: args.id } });
        let getuser = locateuser.toJSON();
        let getPost = getuser.post;
        var setPost = JSON.parse(getPost);
        setPost = JSON.stringify(setPost);
        const getfinalpost = {
          post: setPost,
        };
        return getfinalpost;
      },
    },
  }),
});

module.exports = RootQueryType;
