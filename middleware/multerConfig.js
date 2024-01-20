const multer=require('multer')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const filter=(req, file, cb)=> {
    // Check if the file type is allowed
    if (file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only PNG and PDF files are allowed!'), false); // Reject the file
    }
  }
module.exports={
    multer,
    storage,
    filter
}