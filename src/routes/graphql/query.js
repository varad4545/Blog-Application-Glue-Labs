const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const users = require("../../models").users;
const blog = require("../../models").blogposts;

const { blogType, userType, getMsgType,getallblogsType } = require("./types");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({

    //Admin can get all user info
    admingetbasicusers:
    {
      type: new GraphQLList(userType),
      description: "List of all basic users",
      resolve: async () =>
      {
         let getusers;
         await users.findAll({ where: { role: "basic" } })
         .then((data)=>{
           if(data.length===0)
           {
             throw new Error("No users Found");
           }
           getusers=data
         })
         return getusers
       
      },
    },

    //admin can get all blogs info
    admingetallblogs:
    {
      type: new GraphQLList(blogType),
      description: "List of all blogs",
      resolve: async() =>
      {
         let setpost
         await blog.findAll()
         .then((data)=>{
           if(data.length===0)
           {
            throw new Error("No Blogs Found");
           }
           setpost=data
         })

         return setpost
      },
    },

    //users can access their blogs individually
    basicgetblog:
    {
      type: getMsgType,
      description: "Access individual blogs",
      args:
      {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) =>
      {
          let setPost
          await blog.findOne({ where: { userId: args.id, title:args.title } }).
          then((data)=>
          {
              setPost=data.post
          })
          .catch(()=>{
            throw new Error("Blog not Found");
          })
          return {post:setPost}
       },
    },

    //users can access all their blogs
    basicallBlogs:
    {
      type: GraphQLList(getallblogsType),
      description: "List of all all blogs of users",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (parent, args) =>
      {
        let setpost
        await blog.findAll({ where: { userId: args.id }})
         .then((data)=>{
             if(data.length===0)
             {
              throw new Error("Error");
             }
             blogsdata=[]
             data.map((blog)=>
             {
               let datapost={
                  title:blog.title,
                  post:blog.post
               }
               blogsdata.push(datapost)
             })
             setpost=blogsdata
  
         })
         return setpost
      },
    },

  }),
});

module.exports = RootQueryType;
