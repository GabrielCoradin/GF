const express = require('express');
const router = express.Router();
const entidadeController = require('../controllers/entidadeController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas de entidades requerem autenticação
router.use(authMiddleware);

// Rotas CRUD para entidades
router.post('/', entidadeController.createEntidade);
router.get('/', entidadeController.getAllEntidades);
router.get('/:id', entidadeController.getEntidade);
router.put('/:id', entidadeController.updateEntidade);
router.delete('/:id', entidadeController.deleteEntidade);

module.exports = router;
