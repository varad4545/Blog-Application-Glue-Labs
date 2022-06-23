const users = require("../../models").users;
const blog = require("../../models").blogposts;
const {authToken,authRole,authRoleAdmin}=require('../middlewares/authmiddlewares')
const {combineResolvers}=require('graphql-resolvers');

const Queryresolvers={
    Query:
    {
        //admin can access all basic user info
        admingetbasicusers:combineResolvers(authToken,authRole("admin"),async()=>
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
        }),
     
        //admin can access all basic user blogs
        admingetallblogs:combineResolvers(authToken,authRole("admin"),async()=>
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
        }),

        //users can access their individual blog
        basicgetblog:combineResolvers(authToken ,authRole("basic"),async(parents,args)=>
        {
          let setPost
          await blog.findOne({ where: { userId: args.id, title:args.title } }).
          then((data)=>
          {
              setPost=data
          })
          .catch(()=>{
            throw new Error("Blog not Found");
          })

          return setPost
        }),

        //users can access all their blogs at a time
        basicallBlogs:combineResolvers(authToken,authRole("basic"),async (parents,args)=>
        {
          let setpost=[]
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
        })

    },
}
module.exports={Queryresolvers}