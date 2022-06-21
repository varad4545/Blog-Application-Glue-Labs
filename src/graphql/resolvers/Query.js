const users = require("../../models").users;
const blog = require("../../models").blogposts;


const Queryresolvers={
    Query:
    {
        async admingetbasicusers()
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

        async admingetallblogs()
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

        async basicgetblog(parents,args)
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
        },

        async basicallBlogs(parents,args)
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
        }

    },
}
module.exports={Queryresolvers}