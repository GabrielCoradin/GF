const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Entidade = sequelize.define('Entidade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_razao_social: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('CNPJ', 'CPF'),
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nome_fantasia: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Relacionamento com User
Entidade.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Entidade, { foreignKey: 'userId' });

module.exports = Entidade;
