const jwt=require('jsonwebtoken')
const util=require('util')
const { users } = require('../model')

  const authenticateFunction=async (req,res,next)=>{
    const token=req.cookies.token
    //check if token exists or not
    if(!token){
        return res.send('not logged in')
    }
    else{
        //verify token
        try{
        const verifyToken=util.promisify(jwt.verify)
       const decryptedResylt=await verifyToken(token,process.env.SECRETKEY)
       //check if user exits in table or not
       const userExits= await users.findOne({
        where:{
            id:decryptedResylt.id
        }
       })
       if(!userExits){
        res.send('User with that token does not exist')
       }
       else{
        req.user={}
        req.user.id=decryptedResylt.id

       }
        //console.log(decryptedResylt) 
    }
    catch(err){
        console.log(err)
    }
    }
    next()
  }

  module.exports=authenticateFunction