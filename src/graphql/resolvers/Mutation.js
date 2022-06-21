const users = require("../../models").users;
const blog = require("../../models").blogposts;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Mutationresolvers={
    Mutation:
    {
        async adminupdateusers(parents,args)
        {
            let msg
            await users.findOne({ where: { id: args.id, role: "basic" } })
            .then((data)=>{
               if(data)
               {  
                 const newbody ={
                  id: args.id,
                  email: args.email,
                 };
                 users.update(newbody, { where: { id: args.id } });
                 msg={ successful: true, message: "User Updated" };
               }
               else
               {
                throw new Error("User not found")
               }
            })
            .catch(()=>{
              throw new Error("User not found")
            })

           return msg;
        },

        async admindeleteusers(parents,args)
        {
          let msg
          await users.findOne({ where: { id: args.id, role: "basic" } })
          .then(async(data)=>{
             if(!data)
             {
              throw new Error("User not found")  
             }

             await blog.findOne({ where: { userId: args.id} }).then(()=>{
                blog.destroy({where:{ userId: args.id}})
             })
             users.destroy({ where: { id: args.id } });
             msg={ successful: true, message: "User Deleted" };
          })
          .catch(()=>{
            throw new Error("User not found")
          })
  
          return msg
        },

        async basicpostblog(parents,args)
        {
          let msg
          await users.findOne({id:args.id})
          .then(async (data)=>
          {
               await blog.create({userId: args.id, title:args.title, post:args.post})
               .then(()=>
               {
                 msg={ successful: true, message: "Blog Added" };
               })
               .catch(()=>{
                throw new Error("Blog not added")
               })
          })
          .catch(()=>
          {
            throw new Error("User not found in db")
          })

          return msg
        },

        async basicupdateblog(parents,args)
        {
          let msg ;
          await blog.findOne({where: { userId: args.id, title: args.title }})
          .then(async (data)=>{
              if(!data)
              {
                throw new Error("Post Not Found");
              }

              await blog.update({post: args.post},{where: { userId: args.id, title: args.title}})
              .then( async () => {
                  msg = { successful: true, message: "Blog updated" };
              })
          })
          .catch(()=>{
            throw new Error("Post Not Found");
          })
      
          return msg  
        },

        async basicdeleteblog(parents,args)
        {
           let msg;
           await blog.findOne({ where: {userId: args.id, title: args.title}})
           .then(async(user_data)=>{
              if(!user_data)
              {
                throw new Error("Blog Not Found");
              }
  
              await blog.destroy({ where: {userId: args.id, title: args.title}})
              .then((datas)=>{
                 msg = { successful: true, message: "Blog deleted" };
              }) 
           })
      
          return msg
        },

        async register(parents,args)
        {
          let msg
          await users.findOne({ where: { email: args.email } })
          .then((data)=>
          {
              if(data)
              {
                msg={ successful: true, message: "User with Email exists" };
              }
              else
              {
                users.create({
                  id: args.id,
                  email: args.email,
                  password: args.password,
                  role: args.role,
                });
                msg= { successful: true, message: "User Registered" };
              }
          })
          .catch(()=>{
              throw new Error("Error")
          })
  
          return msg
        },

        async login(parents,args)
        {
          let msg
          await users.findOne({ where: { email: args.email } })
          .then(async(userWithEmail)=>{
            if (!userWithEmail)
            {
              throw new Error("User Not Found");
            }
            if (await bcrypt.compare(args.password, userWithEmail.password))
            {
              const user = { email: userWithEmail.email };
              const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {expiresIn: "8h",});
              const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {expiresIn: "7d",});
              
              users.update({refreshtoken: refreshToken,},
                {
                where: { id: userWithEmail.id },
                }
              );
              msg = { successful: true, message: "Successfully Login" };
            }
            else
            {
              msg = { successful: false, message: "Invalid Email or Password" };
            }
          }) 

          return msg;
        }
    }
}
module.exports={Mutationresolvers}