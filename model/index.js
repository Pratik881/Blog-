const config=require('../config/dbConfig')
const {Sequelize,DataTypes}=require('sequelize')
const sequelize=new Sequelize(config.DB,config.USER,config.PASSWORD,{
    host:config.HOST,
    dialect:config.dialect,
    port:3306,
    pool:{
        max:config.pool.max,
        min:config.pool.min,
        acquire:config.pool.acquire,
        idle:config.pool.idle
    },

});
sequelize.authenticate().then(()=>{
    console.log("Connection successfull")
}).catch((err)=>{
    console.log(err)
})
const db={}
db.Sequelize=Sequelize;
db.sequelize=sequelize

//importing model files
db.blogs=require('./blogModel')(DataTypes,sequelize)
db.users=require('./userModel')(DataTypes,sequelize)

db.users.hasMany(db.blogs)
db.blogs.belongsTo(db.users)

db.sequelize.sync({force:false}).then(()=>{
    console.log("re-sync done")
})
module.exports=db;
