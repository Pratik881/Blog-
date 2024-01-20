const express=require('express')
const { blogs } = require('./model/index.js')
const {multer,storage,filter}=require('./middleware/multerConfig.js')
const upload=multer({storage:storage,
                     fileFilter:filter
})
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
app.post('/addBlog',upload.single('image') ,async (req,res)=>{
    const {title,subtitle,description}=req.body
   const imageUrl=req.file.filename;
    await blogs.create({
    title,
    subtitle,
    description,
    imageUrl,
   })
   res.send("successfull insertion")
})
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log("I am running ")
})
console.log(process.env.PORT)