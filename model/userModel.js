module.exports=(DataTypes,sequelize)=>{
    const User=sequelize.define('user',{
     userName:{
        type:DataTypes.STRING,
        allowNull:false

     },
     email:{
        type:DataTypes.STRING,
        allowNull:false
     },
     password:{
      type:DataTypes.STRING,
      allowNull:false
     },
     otp:{
      type:DataTypes.STRING,
      allowNull:true
     },
     otpGeneratedTime:{
      type:DataTypes.STRING,
      allowNull:true
     }


    })
    return User;
}