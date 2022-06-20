const express = require("express");
const router = express.Router();
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {GraphQLSchema,} = require("graphql");
const RootQueryType = require("./query");
const RootMutationType = require("./mutation");

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

router.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
