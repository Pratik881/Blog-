module.exports=(DataTypes,sequelize)=>{
    const User=sequelize.define('user',{
     name:{
        type:DataTypes.STRING,
        allowNull:false

     },
     address:{
        type:DataTypes.STRING,
        allowNull:false
     }


    })
    return User;
}