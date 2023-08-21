module.exports = (sequelize, DataTypes) => {
  const Family = sequelize.define(
    "Family",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },

      code: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      phones: {
        type: DataTypes.ARRAY(DataTypes.STRING(25)),
        defaultValue: [],
      },

      details: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },

      aliquot: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      
    },
    { timestamps: false }
  );

  Family.associate = (model) => {
    Family.belongsToMany(model.User, {
      through: model.UserFamily,
      foreignKey: {
        name: "codeFamily",
      },
    });

    Family.hasOne(model.Payment, {
      foreignKey: {
        name: "familyCode",
      },
      as: "FamilyCode",
    });

    Family.belongsTo(model.Urbanization, {
      foreignKey: "codeUrbanization",
    });
  };

  return Family;
};
