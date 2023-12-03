module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define("player", {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    
     });
     return Player
};