const express = require('express');
const router = express.Router();
const lancamentoController = require('../controllers/lancamentoController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Todas as rotas de lançamentos requerem autenticação
router.use(authMiddleware);

// Rotas CRUD para lançamentos
router.post('/', upload.single('anexo'), lancamentoController.createLancamento);
router.get('/', lancamentoController.getAllLancamentos);
router.get('/:id', lancamentoController.getLancamento);
router.put('/:id', upload.single('anexo'), lancamentoController.updateLancamento);
router.delete('/:id', lancamentoController.deleteLancamento);

module.exports = router;
