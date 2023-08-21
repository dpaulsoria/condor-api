/** @format */

module.exports = (sequelize, DataTypes) => {
  const ValuesPerMonth = sequelize.define(
    "ValuesPerMonth",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      familyCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      payvalue: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
      },
      payDriver: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
      },
      payPassenger: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
      },

      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },

    { timestamps: false }
  );

  ValuesPerMonth.associate = (model) => {
    ValuesPerMonth.belongsTo(model.Family, {
      foreignKey: {
        name: "familyCode",
        allowNull: false,
      },
    });
  };

  return ValuesPerMonth;
};
