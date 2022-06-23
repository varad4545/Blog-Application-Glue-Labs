const {gql}=require("apollo-server-express")

const typeDefs=gql`
  type blogType{
    id: Int!
    title:String!
    post:String!
    createdAt: String!
    updatedAt: String!
    userId:Int!
  }

  type userType{
    id: Int!
    email: String!
    password: String!
    role: String!
    refreshtoken: String!
    createdAt: String!
    updatedAt: String!
  }
 
  type MessageType{
      successful:Boolean!
      message:String!
  }

  type getMsgType{
    post:String!
  }

  type getallblogsType{
    title:String!
    post:String!
  }
  
  #Query
  type Query
  {
     admingetbasicusers(id:Int!):[userType!]!
     admingetallblogs(id:Int!):[blogType!]!
     basicgetblog(id:Int!,title:String!):blogType
     basicallBlogs(id:Int!):[getallblogsType!]!
  }
 
  #Mutation
  type Mutation
  {
     adminupdateusers(adminid:Int!,id:Int!,email:String!):MessageType
     admindeleteusers(adminid:Int!,id:Int!):MessageType
     basicpostblog(id:Int!,title:String!,post:String!):MessageType
     basicupdateblog(id:Int!,title:String!,post:String!):MessageType
     basicdeleteblog(id:Int!,title:String!):MessageType
     register(email:String!,password:String!,role:String!):MessageType
     login(email:String!,password:String!):MessageType
     refreshToken(id:Int!):MessageType
     logout(id:Int!):MessageType
  }
`
module.exports={typeDefs}