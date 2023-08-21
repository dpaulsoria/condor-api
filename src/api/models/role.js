module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING(75)),
        defaultValue: [],
      },
    },
    { timestamps: false }
  );

  Role.associate = (model) => {
    Role.belongsToMany(model.User, {
      through: model.UserRole,
      foreignKey: {
        name: "codeRole",
      },
    });
  };

  return Role;
};
