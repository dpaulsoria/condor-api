module.exports = (sequelize, DataTypes) => {
  const Urbanization = sequelize.define(
    "Urbanization",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.BIGINT,
      },
      code: {
        primaryKey: true,
        type: DataTypes.STRING(25),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      
    },
    { timestamps: false }
  );

  Urbanization.associate = (model) => {
    Urbanization.hasMany(model.Family, {
      foreignKey: "codeUrbanization",
    });
  };

  return Urbanization;
};
