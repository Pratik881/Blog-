const jwt=require('jsonwebtoken')
const util=require('util')
const { users,blogs } = require('../model')

  const welcomePageAuthentication=async (req,res,next)=>{
    const token=req.cookies.token
    //check if token exists or not
    if(!token){
        req.user={}
        req.user.message='Welcome Stranger'
        
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
       req.user.userName=userExits.userName
        req.user.message=`Welcome ${req.user.userName}`

       }
    
    }
    catch(err){
        console.log(err)
    }
    }
    next()
  }

  module.exports=welcomePageAuthentication