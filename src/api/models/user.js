// Imports
const { encryptData } = require("../utils/utils");

// Methods

const encryptUserPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await encryptData(user.password);
  }
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },

      username: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      idCard: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      details: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },

      session: {
        type: DataTypes.JSONB,
        defaultValue: {},
      }, 
      pointsPassenger: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
      }, 
      pointsDriver: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
      },
      careers: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
      },
    },
    {
      scopes: {
        hideSentive: {
          attributes: {
            exclude: ["password", "session", "createdAt", "updatedAt"],
          },
        },
      },
    }
  );

  User.associate = (model) => {
    User.belongsTo(model.Urbanization, {
      foreignKey: "codeUrbanization",
    });

    User.belongsToMany(model.Family, {
      through: model.UserFamily,
      foreignKey: {
        name: "username",
      },
    });

    User.belongsToMany(model.Role, {
      through: model.UserRole,
      foreignKey: {
        name: "username",
      },
    });

    User.hasOne(model.ImageUser, {
      foreignKey: {
        name: "username",
      },
      as: "ImagesUser",
    });
  };

  User.beforeCreate(encryptUserPassword);
  User.beforeUpdate(encryptUserPassword);

  return User;
};
