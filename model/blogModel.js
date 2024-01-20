module.exports = (DataTypes, sequelize) => { // Function for model definition
    const Blog = sequelize.define("Blog", {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
  
    return Blog;
  };
  