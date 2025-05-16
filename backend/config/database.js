const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestao_financeira',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Desativa logs SQL no console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};
