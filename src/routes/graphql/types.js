const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const GraphQLDate = require("graphql-date");

//Describes the blogposts table from db
const blogType = new GraphQLObjectType({
  name: "blog",
  description: "This represents a blog",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
    userId: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

//Describes the users table from db
const userType = new GraphQLObjectType({
  name: "user",
  description: "This represents a user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLNonNull(GraphQLString) },
    refreshtoken: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDate) },
    updatedAt: { type: GraphQLNonNull(GraphQLDate) },
  }),
});

//Describes message format whenever users,blogs are added, updated, deleted
const MessageType = new GraphQLObjectType({
    name: "Message",
    description: "This is message",
    fields: () => ({
      successful: { type: GraphQLNonNull(GraphQLBoolean) },
      message: { type: GraphQLNonNull(GraphQLString) },
    }),
  });

//Describes format to represent get result
const getMsgType = new GraphQLObjectType({
    name: "GetMessage",
    description: "This is message while getting particular blogs for basic user",
    fields: () => ({
      post: { type: GraphQLNonNull(GraphQLString) },
    }),
  });

//Describes format to represent get result of all blogs
const getallblogsType=new GraphQLObjectType({
  name: "Getallblogstype",
  description: "This is message while getting all blogs for basic user",
  fields: () => ({
    title:{ type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = { blogType, userType,MessageType,getMsgType,getallblogsType };
