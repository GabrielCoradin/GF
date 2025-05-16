const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso' });
    }

    // Verificar se o nome de usuário já existe
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: 'Este nome de usuário já está em uso' });
    }

    // Criar o novo usuário
    const user = await User.create({
      username,
      email,
      password // A senha será automaticamente hasheada pelo hook beforeCreate
    });

    // Remover a senha do objeto de resposta
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return res.status(201).json({ 
      message: 'Usuário registrado com sucesso', 
      user: userResponse 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao registrar usuário', 
      error: error.message 
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se todos os campos necessários foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    // Buscar o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'sua_chave_secreta_para_tokens',
      { expiresIn: '24h' }
    );

    // Remover a senha do objeto de resposta
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao realizar login', 
      error: error.message 
    });
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Excluir a senha dos dados retornados
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao buscar perfil do usuário', 
      error: error.message 
    });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação
    const { username, email, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar apenas os campos fornecidos
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    // Remover a senha do objeto de resposta
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    return res.status(200).json({ 
      message: 'Perfil atualizado com sucesso', 
      user: userResponse 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro ao atualizar perfil', 
      error: error.message 
    });
  }
};
