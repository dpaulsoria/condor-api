module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
      "Payment",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },

        payvalue: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
  
        issueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
  
        stateuser: {
          type: DataTypes.STRING(10),
          allowNull: false,
        }, 
        
      },

      { timestamps: false }
    );
  
    Payment.associate = (model) => {
        Payment.belongsTo(model.Family, {
            foreignKey: {
              name: "familyCode",
            },
          });
    };
  
    return Payment;
  };
  