const express=require('express')
const cookieParser=require('cookie-parser')
//const { blogs,users } = require('./model/index.js')
// const {multer,storage}=require('./middleware/multerConfig.js')
const allRoutes=require('./routes/blogRoute.js')
// const upload=multer({storage:storage})
const app=express()
//const bcrypt=require('bcrypt')
app.set('view-engine','ejs')
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// const fs=require('fs')
// const {userLogin,editBlog,addBlog,editForm,deleteBlog, renderAddBlog,showAll,renderSingleBlog} = require('./controllers/userLogin.js')
// const { userRegistration,registerPage, userLoginPage } = require('./controllers/authController.js')
// //All blogs
//app.get('/',showAll)
app.use(cookieParser())
app.use('/',allRoutes)
app.use(express.static("uploads"))
app.use(express.static("public"))
const port= process.env.PORT || 5000; 
app.listen(port,()=>{
    console.log("I am running ")
})

//to clear git cache
//git rm --cached folderName