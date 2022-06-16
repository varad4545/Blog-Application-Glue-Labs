const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require("graphql");

const GraphQLDate = require("graphql-date");

const blogType = new GraphQLObjectType({
  name: "blog",
  description: "This represents a blog",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    email: { type: GraphQLNonNull(GraphQLString) },
    post: { type: GraphQLNonNull(GraphQLString) },
  }),
});

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

module.exports = { blogType, userType };
