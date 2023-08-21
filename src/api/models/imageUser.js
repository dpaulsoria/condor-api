module.exports = (sequelize, DataTypes) => {
  const ImageUser = sequelize.define("ImageUser", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: "User",
        key: "username",
      },
    },
  });

  // Associations;
  ImageUser.associate = (model) => {
    ImageUser.belongsTo(model.User, {
      foreignKey: {
        name: "username",
      },
    });
  };

  return ImageUser;
};
