const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Formato esperado: "Bearer [token]"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    // Verificar e decodificar o token
    jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_para_tokens', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Verificar se o usuário ainda existe
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Adicionar o ID do usuário ao objeto de requisição
      req.userId = decoded.id;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
  }
};

module.exports = authMiddleware;
