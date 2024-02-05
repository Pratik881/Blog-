const handleError=(fn)=>{
    return (req,res)=>{
        fn(req,res).catch((err)=>{
        const path=req.route.path;
       req.flash('error',err.message)
        return res.redirect(path)
          })
        }
    }

module.exports=handleError