const {Mutationresolvers} = require("./Mutation");
const {Queryresolvers} = require("./Query");

const resolvers = [Mutationresolvers, Queryresolvers];

module.exports = {resolvers};