const users = require("../../models").users;
const blog = require("../../models").blogposts;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { combine, combineResolvers}=require('graphql-resolvers');
const {userSchemaValidator,blogSchemaValidator}=require("../middlewares/joivalidations")
const {authToken,authRole,authRoleAdmin}=require('../middlewares/authmiddlewares')

const Mutationresolvers={
    Mutation:
    {
        //admin can update user info
        adminupdateusers: combineResolvers(authToken,authRoleAdmin('admin'),userSchemaValidator,async (parents,args)=>
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
        }),
       
        //admin can delete user info
        admindeleteusers:combineResolvers(authToken,userSchemaValidator,authRoleAdmin('admin'),async (parents,args)=>
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
        }),
     
        //users can post blogs
        basicpostblog:combineResolvers(authToken,blogSchemaValidator,authRole("basic"),async(parents,args)=>
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
        }),

         //users can update blogs
        basicupdateblog:combineResolvers(authToken,blogSchemaValidator ,authRole("basic"),async (parents,args)=>
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
        }),

        //users can delete blogs
        basicdeleteblog:combineResolvers(authToken,blogSchemaValidator,authRole("basic"),async(parents,args)=>
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
        }),

        //register/Signup
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

        //Login
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
              
              users.update({accesstoken:accessToken,refreshtoken: refreshToken,},
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
        },

        //generate new accessToken using refreshToken
        async refreshToken(parents,args)
        {
          let msg
          await users.findOne({ where: { id: args.id } })
          .then((user_data)=>
          {
            if(!user_data.refreshtoken)
            {
              throw new Error("Not Available");
            }
            const userwithmail = { email: user_data.email };

            jwt.verify(user_data.refreshtoken,process.env.REFRESH_TOKEN_KEY,(err, user) =>
               {
                 if (err)
                 {
                   throw new Error("Refresh token not valid");
                 }
                 const accessToken=jwt.sign(userwithmail, process.env.ACCESS_TOKEN_KEY, {expiresIn: "8h",});
                 users.update({ accesstoken: accessToken },{
                 where: {
                  id: args.id
                 },
                 })
                 msg = { successful: false, message: "New accessToken" };          
              }
            );
          })
          .catch(()=>{
            throw new Error("User not found");
          })
          return msg
        },
        
        //logout
        logout: combineResolvers(authToken, async (parent,args) =>
        {
          let msg;
          await users.findOne({ where: { id: args.id } })
          .then(async(user_data)=>{
            if (user_data.refreshtoken) {
              users.update({ 
                refreshtoken: null, 
                accesstoken: null 
              }, { 
                where: { id: args.id } 
              });
            }
            msg = { successful: true, message: "Successfully Logout" };
          })
          .catch(()=>{
            throw new Error("User not found")
          })
          return msg
        })
         
    }
}
module.exports={Mutationresolvers}