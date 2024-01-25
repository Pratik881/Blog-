const { users,blogs }=require('../model')
require('dotenv').config()
const backend=process.env.backend
const fs=require('fs')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config
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
            //Generate token here
            const token=jwt.sign({id:user.id},process.env.SECRETKEY,{
                expiresIn:'30d'
            })
           res.cookie('token',token)//browser ma cookieset garxa
            console.log(token)
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
const addBlog = async (req, res) => {
    try {
        const userId=req.user.id
       // console.log(userID)
        const { title, subtitle, description } = req.body;
        const imageUrl = backend+req.file.filename;
        console.log(req.file.filename)
        
        await blogs.create({
            title,
            subtitle,
            description,
            imageUrl,
            userId
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const editForm=async (req,res)=>{
    const id=req.user.id
    const blogId= req.params.blogId
    console.log(blogId)
    const result= await blogs.findOne({
        where:{
            id:blogId,
            userId:id

        }
    })
    //console.log(result)
    //return
    if(result){
    res.render("Edit.ejs",{result})
    }
    else{
        res.redirect('/')
    }
}
const deleteBlog = async (req, res) => {
    try {
        const id = req.user.id;
        const toDestroy = req.params.blogId;

        const toDeleteBlog = await blogs.findOne({
            where: {
                id: toDestroy
            }
        });

        if (!toDeleteBlog) {
            return res.status(404).send("Blog not found");
        }

        const savedUrl = toDeleteBlog.imageUrl;
        const unusedUrlLength = backend.length;
        const requiredUrl = savedUrl.slice(unusedUrlLength);

        const authorizedUser = await blogs.findOne({
            where: {
                userId: id,
                id: toDestroy
            }
        });

        if (authorizedUser) {
            const result = await blogs.destroy({
                where: {
                    id: toDestroy
                }
            });

            if (result === 1) {
                fs.unlink('./uploads/' + requiredUrl, (err) => {
                    if (err) {
                        console.log('Error deleting image from the server:', err);
                    } else {
                        console.log('Image successfully deleted');
                    }
                });

                res.redirect('/');
            } else {
                res.status(404).send("Blog not found");
            }
        } else {
            res.status(403).send("You are not authorized to delete this");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("Internal Server Error");
    }
};

const renderAddBlog=(req,res)=>{
    res.render('addBlog.ejs')
}
const showAll=async (req,res)=>{
   const message=req.user.message;
    
    const allBlogs=await blogs.findAll({
        include:{
            model:users,
            as: 'user' //by default sequelize retrieves associated data using singular version of the model name as the key in the result
                      //table ko name users table ko primary key is the foreign key in the blogs table
        } 
    }
    )
    res.render('allBlogs.ejs',{allBlogs,message})
}
const renderSingleBlog=async (req,res)=>{
    const id=(req.params.blogId)
   // const {blogId}=req.params
   const blog =await blogs.findOne({
    where:{
        id:id
    },
    include:{
        model:users
    }
   })
   //console.log(blog)
   res.render("singleBlog.ejs",{blog})
}
module.exports={showAll,renderAddBlog,userLogin,editBlog,addBlog,editForm,deleteBlog,renderSingleBlog}
