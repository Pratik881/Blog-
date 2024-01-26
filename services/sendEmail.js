const nodemailer=require('nodemailer')
const sendMail=async(options)=>{
  try{ const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.Email,
            pass:process.env.Pass
        }
    })
    const mailOptions={
        from:'pratik',
        to:options.email,
        subject:options.subject,
        text:'Your otp is'+options.otp, 

    }
    const sent= await transporter.sendMail(mailOptions)
}
catch(err){
    console.error(err)
}

}
module.exports=sendMail