const bcrypt=require('bcrypt')
const {users,blogs}=require('../model');
const sendMail = require('../services/sendEmail');
const userRegistration=async(req,res)=>{
    const {userName,email,password}=req.body;
    const previousEmail=await users.findOne({
        where:{
            email
        }
    })
    if(!previousEmail){
    await users.create({
        userName,
        password:bcrypt.hashSync(password,10),
        email
    })
    res.redirect('/login')
    }
    else{
        res.send("email already in use")
    }
    }
const registerPage=(req,res)=>{
       const error=req.flash('error')
        res.render('register.ejs',{error})
    }
const userLoginPage=(req,res)=>{
   const error= req.flash('error')
    res.render('loginForm.ejs',{error})
}    
const showMyBlogs=async (req,res)=>{
    const id=req.user.id;
    //console.log(id)
    const allBlogs=await  blogs.findAll({
        where:{
            userId:id
        }
    })
 
   res.render('myBlogs.ejs',{allBlogs})
}
const forgetMe=(req,res)=>{
    res.render('forget.ejs')
}
const sendOTP=async (req,res)=>{
    const emailFromBody=req.body.email
    const emailExits=await users.findOne({
        where:{
        email:emailFromBody
        }
    })
    if(emailExits){

      const randomOtp=Math.floor(Math.random()*10000)
       await  sendMail({
            email:emailFromBody,
            subject:'forget password',
            otp:randomOtp
        })
        emailExits.otp=randomOtp
        emailExits.otpGeneratedTime=Date.now()
        await emailExits.save()
       res.redirect('/otp?email='+emailFromBody)//urlma query banera janxa email=nnn@gmail.com
    }
    else{
        res.send('no such email found')
    }

}
const otpForm=(req,res)=>{
    const email=req.query.email
    console.log(email)
    res.render('otpForm.ejs',{email})
}
//hi
const verifyOTP=async(req,res)=>{
    const otpFromForm=req.body.otp;
    const email=req.params.email
    if(!otpFromForm)
    {
        console.log('please enter otp')
    }
    const actualUserOtp=await users.findOne({
        where:{
            email,
            otp:otpFromForm
        }
    })
    if(!actualUserOtp){
        res.send('Invalid Otp')
    }
    //check if otp has expired or not
    else{
    const otpExpirationCheck=Date.now()-actualUserOtp.otpGeneratedTime
    if(otpExpirationCheck>=120000000){

       res.send('Opt expired')
    }
    else{
        // actualUserOtp.otp=null,
        // actualUserOtp.otpGeneratedTime=null
        // await actualUserOtp.save()
        res.redirect('/passwordChange?email='+email+'?otp='+otpFromForm)
    }
}
   

}
const passwordChangeForm=(req,res)=>{
    const email=req.query.email
    const otp=req.query.otp
    if(!email || !otp){
        return res.send('email and otp must be provided in query')
    }
    res.render('passwordChange.ejs',{email,otp})
}
const afterPasswordChange=async (req,res)=>{
    const email=req.params.email;
    const otp=req.params.otp
    let newPassword=req.body.password
    
    const userExists=await users.findOne({
        where:{
            email,
            otp
        }
    })

    if(userExists){
        const otpExpirationCheck=Date.now()-actualUserOtp.otpGeneratedTime
       if(otpExpirationCheck>=240000000){

       return res.redirect('/passwordChange?email='+email+'?otp='+otpFromForm)
    }
         newPassword=bcrypt.hashSync(newPassword,10),
          userExists.password=newPassword;
          await userExists.save()
          res.redirect('/login')
    }
    else{
        res.render('No such email exists')
    }
}
   
module.exports={afterPasswordChange,passwordChangeForm,verifyOTP,otpForm,sendOTP,forgetMe,showMyBlogs,userRegistration,registerPage,userLoginPage}