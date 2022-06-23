const {skip}=require('graphql-resolvers')
const jwt = require("jsonwebtoken");
const users = require("../../models").users;

//verifies accessToken
const  authToken=async(parent,args)=>
{
  const user=await users.findOne({where:{id:args.id}})
  console.log(args)
  const token = user.accesstoken;
  console.log(token)
  if (token == null)
  {
    throw new Error("Token Null")
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) =>
  {
    if(err)
    { 
        throw new Error("Token not verified")
    }

    skip;
  });
}

//role based access to basic and admin user
function authRole(user_role)
{
  return async (parents,args) =>
  {
    const user = await users.findOne({ where: { id: args.id, role: user_role } });
    if(user)
    {
      skip;
    }
    else
    {
     throw new Error("Inaccesible rights")
    }
  };
}

//specific case of admin access
function authRoleAdmin(user_role)
{
  return async (parents,args) =>
  {
    console.log(args)
    const user = await users.findOne({ where: { id: args.adminid, role: user_role } });
    console.log(user)
    if(user)
    {
      skip;
    }
    else
    {
     throw new Error("Inaccesible rights")
    }
  };
}

module.exports={authToken,authRole,authRoleAdmin}