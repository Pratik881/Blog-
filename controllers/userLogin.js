const { users,blogs }=require('../model')
require('dotenv').config()
const fs=require('fs')
const bcrypt=require('bcrypt')
const userLogin= async (req, res) => {
    const { email, password } = req.body;

    try {
        // Use await to wait for the promise to resolve
        const user = await users.findOne({
            where: {
                email
            }
        });

        // Check if the user exists and the password is correct
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send("Invalid credentials");
        } else {
            res.status(200).send('Login successful');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
const editBlog=async(req,res)=>{
    let fileName
    if(req.file){
   fileName=req.file.filename;//naya fileName ho yo
    }
const {title,subtitle,description}=req.body;
//console.log(fileName)
const blogId=req.params.blogId
//old data
const oldData=await blogs.findOne({
    where:{
       id:blogId
    }
})
const oldFileName=oldData.imageUrl
const unusedLength=backend.length
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
oldData.update({
    title,
    subtitle,
    description,
    imageUrl:backend+fileName
},{
where:{
    id:blogId

}})
res.redirect('/')
//
}
const addBlog=async (req,res)=>{
    const {title,subtitle,description}=req.body
   const imageUrl=backend+req.file.filename;
    await blogs.create({
    title,
    subtitle,
    description,
    imageUrl,
   })
   res.redirect('/')
}
const editForm=async (req,res)=>{
    const blogId= req.params.blogId
    //console.log(blogId)
    const result= await blogs.findOne({
        where:{
            id:blogId
        }
    })
    res.render("Edit.ejs",{result})

}
const deleteBlog=async(req,res)=>{
    const toDestroy=req.params.blogId;
    const toDeleteImage=await blogs.findOne({
        where:{
            id:toDestroy
        }
    })
    const savedUrl=toDeleteImage.imageUrl
    const unusedUrlLength=backend.length
    const requiredUrl=savedUrl.slice(unusedUrlLength)
    // console.log(requiredUrl)
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

}
const renderAddBlog=(req,res)=>{
    res.render('addBlog.ejs')
}
const showAll=async (req,res)=>{
    const allBlogs=await blogs.findAll()
    res.render('allBlogs.ejs',{allBlogs})
}
const renderSingleBlog=async (req,res)=>{
    const id=(req.params.blogId)
   // const {blogId}=req.params
   const blog =await blogs.findOne({
    where:{
        id:id
    }
   })
// const blog=await blogs.findByPk(id)
   res.render("singleBlog.ejs",{blog})
}
module.exports={showAll,renderAddBlog,userLogin,editBlog,addBlog,editForm,deleteBlog,renderSingleBlog}
