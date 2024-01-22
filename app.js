const express=require('express')
//const { blogs,users } = require('./model/index.js')
const {multer,storage}=require('./middleware/multerConfig.js')
const upload=multer({storage:storage})
const app=express()
//const bcrypt=require('bcrypt')
app.set('view-engine','ejs')
require('dotenv').config()
require('./model/index.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// const fs=require('fs')
const {userLogin,editBlog,addBlog,editForm,deleteBlog, renderAddBlog,showAll,renderSingleBlog} = require('./controllers/userLogin.js')
const { userRegistration } = require('./controllers/authController.js')
//All blogs
app.get('/',showAll)
//user Registration form
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})
//user registration
app.post('/register',userRegistration)
//user Login form
app.get('/login',(req,res)=>{
    res.render('loginForm.ejs')
})
//user login post request
app.post('/login',userLogin);

app.get('/blogs/:blogId',renderSingleBlog)
//delete SIngle Blog
app.get('/delete/:blogId',deleteBlog)
//edit garni form dekhauna
app.get('/edit/:blogId',editForm)
//edit garnaako lagi main code chai yo
app.post('/edit/:blogId',upload.single('image'),editBlog)
//addBlog
app.get('/addBlog',renderAddBlog)
//fill form and add to db
app.post('/addBlog',upload.single('image'),addBlog)
app.use(express.static("uploads"))
app.use(express.static("public"))

const port= process.env.PORT || 5000; 
app.listen(port,()=>{
    console.log("I am running ")
})
