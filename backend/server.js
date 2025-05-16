const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const entidadeRoutes = require('./routes/entidadeRoutes');
const lancamentoRoutes = require('./routes/lancamentoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o app Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasta para uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definição das rotas
app.use('/api/auth', authRoutes);
app.use('/api/entidades', entidadeRoutes);
app.use('/api/lancamentos', lancamentoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Gestão Financeira' });
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados');
    
    // Testar conexão com o banco de dados
    testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos com o banco de dados:', err);
  });
