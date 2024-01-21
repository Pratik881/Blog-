const express=require('express')
const { blogs } = require('./model/index.js')
const {multer,storage,filter}=require('./middleware/multerConfig.js')
const upload=multer({storage:storage})
const app=express()
app.set('view-engine','ejs')
require('dotenv').config()
require('./model/index.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const fs=require('fs')
//All blogs
app.get('/',async (req,res)=>{
    const allBlogs=await blogs.findAll()
    res.render('allBlogs.ejs',{allBlogs})
})
//Single Blog
// app.get('/deleteme',(req,res)=>{
//     fs.unlink('./uploads/me.txt',(err)=>{
//         if(err){
//             console.log(err)
//         }
//         else{
//             console.log('file deleted successfully')
//         }
//     })
// })
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
    const toDeleteImage=await blogs.findOne({
        where:{
            id:toDestroy
        }
    })
    const savedUrl=toDeleteImage.imageUrl
    const unusedUrlLength="http://localhost:3000/".length
    const requiredUrl=savedUrl.slice(unusedUrlLength)
    console.log(requiredUrl)
    const result=await blogs.destroy({
        where:{
            id:toDestroy
        }
    })
    if(result===1){
        fs.unlink('./uploads/'+requiredUrl,(err)=>{
            if(err){
                console.log('error deleting image from the server')
            }
            else{
                console.log('Image also succesffully deleted')
            }
        })
        res.status(204).redirect('/')
    }
    else{
        res.status(404).send("Blog not found")
    }

})
//edit garni form dekhauna
app.get('/edit/:blogId',async (req,res)=>{
    const blogId= req.params.blogId
    //console.log(blogId)
    const result= await blogs.findOne({
        where:{
            id:blogId
        }
    })
    res.render("Edit.ejs",{result})

})
//edit garnaako lagi main code chai yo
app.post('/edit/:blogId',upload.single('image'),async(req,res)=>{
    let fileName
    if(req.file){
   fileName=req.file.filename;//naya fileName ho yo
    }
const {title,subtitle,description}=req.body;
const imageUrl=fileName;
//console.log(fileName)
const blogId=req.params.blogId
//old data
const oldData=await blogs.findOne({
    where:{
       id:blogId
    }
})
const oldFileName=oldData.imageUrl
const unusedLength="http://localhost:3000/".length
let selectedPart = oldFileName.slice(unusedLength)//pailako fileName ho yo
if(fileName!=selectedPart){
    fs.unlink('./uploads/'+selectedPart,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log('Old file deleted successfully')
        }
    });
}
// oldData.title=title;
// oldData.subtitle=subtitle;
// oldData.imageUrl="http://localhost:3000/"+imageUrl;
// oldData.description=description;
// await oldData.save() OR
const imgagUrl="http://localhost:3000/"+fileName
oldData.update({
    title,
    subtitle,
    description,
    imageUrl
},{
where:{
    id:blogId

}})
res.redirect('/')
//
})
//addBlog
app.get('/addBlog',(req,res)=>{
    res.render('addBlog.ejs')
})
//fill form and add to db
app.post('/addBlog',upload.single('image') ,async (req,res)=>{
    const {title,subtitle,description}=req.body
   const imageUrl="http://localhost:3000/" + req.file.filename;
    await blogs.create({
    title,
    subtitle,
    description,
    imageUrl,
   })
   res.redirect('/')
})
app.use(express.static("uploads"))

const port= process.env.PORT || 5000; 
app.listen(port,()=>{
    console.log("I am running ")
})
