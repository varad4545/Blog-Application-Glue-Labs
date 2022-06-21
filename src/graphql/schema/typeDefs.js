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
     admingetbasicusers:[userType!]!
     admingetallblogs:[blogType!]!
     basicgetblog(id:Int!,title:String!):blogType
     basicallBlogs(id:Int!):[getallblogsType!]!
  }
 
  #Mutation
  type Mutation
  {
     adminupdateusers(id:Int!,email:String!):MessageType
     admindeleteusers(id:Int!):MessageType
     basicpostblog(id:Int!,title:String!,post:String!):MessageType
     basicupdateblog(id:Int!,title:String!,post:String!):MessageType
     basicdeleteblog(id:Int!,title:String!):MessageType
     register(email:String!,password:String!,role:String!):MessageType
     login(email:String!,password:String!):MessageType
  }
`
module.exports={typeDefs}