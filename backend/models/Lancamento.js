const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Entidade = require('./Entidade');

const Lancamento = sequelize.define('Lancamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('Receita', 'Despesa'),
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0.01
    }
  },
  data_lancamento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  forma_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  caminho_anexo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  entidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Entidade,
      key: 'id'
    }
  }
});

// Relacionamentos
Lancamento.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Lancamento, { foreignKey: 'userId' });

Lancamento.belongsTo(Entidade, { foreignKey: 'entidadeId' });
Entidade.hasMany(Lancamento, { foreignKey: 'entidadeId' });

module.exports = Lancamento;
