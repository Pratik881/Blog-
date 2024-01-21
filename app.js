const express=require('express')
const { blogs } = require('./model/index.js')
const {multer,storage,filter}=require('./middleware/multerConfig.js')
const upload=multer({storage:storage
})
const app=express()
app.set('view-engine','ejs')
require('dotenv').config()
require('./model/index.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//All blogs
app.get('/',async (req,res)=>{
    const allBlogs=await blogs.findAll()
    res.render('allBlogs.ejs',{allBlogs})
})
//Single Blog
app.get('/blogs/:blogId',async (req,res)=>{
    const id=(req.params.blogId)
   // const {blogId}=req.params
   const blog =await blogs.findOne({
    where:{
        id:id
    }
   })
// const blog=await blogs.findByPk(id)
   res.render("singleBlog.ejs",{blog})
})
//delete SIngle Blog
app.get('/delete/:blogId',async(req,res)=>{
    const toDestroy=req.params.blogId;
    const result=await blogs.destroy({
        where:{
            id:toDestroy
        }
    })
    if(result===1){
        res.status(204).redirect('/')
    }
    else{
        res.status(404).send("Blog not found")
    }

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
   res.redirect('/')
})
app.use(express.static("uploads"))

const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log("I am running ")
})
console.log(process.env.PORT)