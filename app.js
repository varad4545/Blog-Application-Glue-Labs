const {ApolloServer}=require("apollo-server-express")
const express=require('express')
const app=express()
const {typeDefs}=require('./src/graphql/schema/typeDefs')
const {resolvers}=require('./src/graphql/resolvers/index')

let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();
app.listen({port:3001},()=>{
    console.log("SERVER RUNNING ON PORT 3001")
})


