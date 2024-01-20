const express=require('express')
const { blogs } = require('./model/index.js')
const app=express()
app.set('view-engine','ejs')
require('dotenv').config()
require('./model/index.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.render('allBlogs.ejs')
})
app.get('/addBlog',(req,res)=>{
    res.render('addBlog.ejs')
})
app.post('/addBlog',async (req,res)=>{
    await blogs.create({
    title:req.body.title,
    subtitle:req.body.subtitle,
    description:req.body.description

   })
   res.send("successfull insertion")
})
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log("I am running ")
})
console.log(process.env.PORT)