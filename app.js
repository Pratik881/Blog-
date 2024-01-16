const app=require('express')()
app.set('view-engine','ejs')
require('dotenv').config()
app.get('/',(req,res)=>{
    res.render('allBlogs.ejs')
})
app.get('/addBlog',(req,res)=>{
    res.render('addBlog.ejs')
})
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log("I am running ")
})
console.log(process.env.PORT)