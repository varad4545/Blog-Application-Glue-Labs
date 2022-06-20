
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require("graphql");
const users = require("../../models").users;
const blog = require("../../models").blogposts;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {MessageType}=require("./types");


const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({

    //admin can update user info
    adminupdateusers:
    {
      type: MessageType,
      description: "Update a particular user",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        email: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async(parent, args) =>
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
             throw new Error("User not found")
          })
          .catch(()=>{
          throw new Error("User not found")
          })

         return msg;
      },
    },

    //admin can delete user info
    admindeleteusers:
    {
      type: MessageType,
      description: "Delete a particular user",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },

      resolve: async(parent, args) =>
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
    },


    //Users can post blog
    basicpostblog: {
      type: MessageType,
      description: "Post a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        post: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async (parent, args) =>
      {
        let msg
        await blog.create({
        userId: args.id,
        title:args.title,
        post:args.post
        })
        .then(()=>
        {
          msg={ successful: true, message: "Blog Added" };
        })
        .catch(()=>{
          throw new Error("Blog not added")
        })

        return msg
      },
    },

    //USers can update blogs
    basicupdateblog: {
      type: MessageType,
      description: "Update a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        post: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async (parents, args) =>
      {
        let msg ;
        await blog.findOne({where: { userId: args.id, title: args.title }
        })
        .then(async (user_data)=>{
          if(!user_data)
          {
            throw new Error("Post Not Found");
          }

          await blog.update({post: args.post},{where: { userId: args.id, title: args.title}})
          .then( async () => {
            msg = { successful: true, message: "Blog updated successfully" };
          })

        })
    
        return msg
      },
    },

    //Users can delete blogs
    basicdeleteblog: {
      type: MessageType,
      description: "Delete a blog",
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async (parent, args) =>
      {
        let msg;
        await blog.findOne({ where: {userId: args.id, title: args.title}})
        .then(async(user_data)=>{
          if(!user_data)
          {
            throw new Error("post Not Found");
          }

          await blog.destroy({ where: {userId: args.id, title: args.title}})
          .then((datas)=>{
            msg = { successful: true, message: "Delete Post Successfully" };
          }) 

        })
    
        return msg
      },
    },

    //Register
    register: {
      type: MessageType,
      description: "User registration",
      args: {
 
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async (parents, args) =>
      {
        let msg
        await users.findOne({ where: { email: args.email } })
        .then((data)=>{
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
    },


    //Login
    login: {
      type: MessageType,
      description: "User Login",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },

      resolve: async (parent, args) => {
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
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECERT, {expiresIn: "8h",});
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECERT, {expiresIn: "7d",});
            
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
      },
    },

  }),
});

module.exports=RootMutationType