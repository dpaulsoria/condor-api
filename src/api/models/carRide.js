module.exports = (sequelize, DataTypes) => {
  const CarRide = sequelize.define(
    "CarRide",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      }, 
      coordinates: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      }, 
      availabilityDate: {
        type: DataTypes.DATE,
        allowNull: false,
      }, 
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
      }, 
      status: {
        type: DataTypes.STRING(25),
        allowNull: true,
      }, 
      driver: {
        type: DataTypes.STRING(50)
      },
      observations: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      observationsDriver: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      pay: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      finalComments: {
        type: DataTypes.JSONB 
      },
      urbanization: {
        type: DataTypes.STRING(50)
      }, 
    },
    { timestamps: false }
  );

  // Associations
  CarRide.associate = (model) => {
    CarRide.belongsTo(model.User, {
      foreignKey: {
        name: "passenger",
      },
    });
  };

  return CarRide;
};
