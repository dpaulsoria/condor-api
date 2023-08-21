module.exports = (sequelize, DataTypes) => {
  const UserFamily = sequelize.define(
    "UserFamily",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    { timestamps: false }
  );

  return UserFamily;
};
