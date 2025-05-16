const Lancamento = require('../models/Lancamento');
const Entidade = require('../models/Entidade');
const fs = require('fs');
const path = require('path');

// Criar um novo lançamento
exports.createLancamento = async (req, res) => {
  try {
    const { 
      tipo, 
      descricao, 
      valor, 
      data_lancamento, 
      data_vencimento, 
      status, 
      forma_pagamento, 
      observacoes, 
      entidadeId 
    } = req.body;
    
    const userId = req.userId; // Vem do middleware de autenticação

    // Verificar campos obrigatórios
    if (!tipo || !descricao || !valor || !data_lancamento || !status || !entidadeId) {
      return res.status(400).json({ 
        message: 'Tipo, descrição, valor, data de lançamento, status e entidade são obrigatórios' 
      });
    }

    // Verificar se o tipo é válido
    if (tipo !== 'Receita' && tipo !== 'Despesa') {
      return res.status(400).json({ message: 'Tipo deve ser Receita ou Despesa' });
    }

    // Verificar se a entidade existe e pertence ao usuário
    const entidade = await Entidade.findOne({ 
      where: { id: entidadeId, userId } 
    });
    
    if (!entidade) {
      return res.status(404).json({ message: 'Entidade não encontrada' });
    }

    // Preparar dados do lançamento
    const lancamentoData = {
      tipo,
      descricao,
      valor,
      data_lancamento,
      data_vencimento,
      status,
      forma_pagamento,
      observacoes,
      entidadeId,
      userId
    };

    // Adicionar caminho do anexo se um arquivo foi enviado
    if (req.file) {
      lancamentoData.caminho_anexo = req.file.path.replace(/\\/g, '/');
    }

    // Criar o lançamento
    const lancamento = await Lancamento.create(lancamentoData);

    return res.status(201).json({
      message: 'Lançamento registrado com sucesso',
      lancamento
    });
  } catch (error) {
    // Se ocorrer um erro e um arquivo foi enviado, remover o arquivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: 'Erro ao registrar lançamento',
      error: error.message
    });
  }
};

// Listar todos os lançamentos do usuário
exports.getAllLancamentos = async (req, res) => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação
    
    // Parâmetros de filtro opcionais
    const { 
      tipo, 
      entidadeId, 
      dataInicio, 
      dataFim, 
      status 
    } = req.query;
    
    // Construir condições de filtro
    const where = { userId };
    
    if (tipo) where.tipo = tipo;
    if (entidadeId) where.entidadeId = entidadeId;
    if (status) where.status = status;
    
    // Filtro por período
    if (dataInicio || dataFim) {
      where.data_lancamento = {};
      if (dataInicio) where.data_lancamento.$gte = dataInicio;
      if (dataFim) where.data_lancamento.$lte = dataFim;
    }

    // Buscar lançamentos com informações da entidade relacionada
    const lancamentos = await Lancamento.findAll({
      where,
      include: [
        {
          model: Entidade,
          attributes: ['id', 'nome_razao_social', 'tipo', 'documento']
        }
      ],
      order: [['data_lancamento', 'DESC']]
    });

    return res.status(200).json(lancamentos);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar lançamentos',
      error: error.message
    });
  }
};

// Obter um lançamento específico
exports.getLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Vem do middleware de autenticação

    const lancamento = await Lancamento.findOne({
      where: { id, userId },
      include: [
        {
          model: Entidade,
          attributes: ['id', 'nome_razao_social', 'tipo', 'documento']
        }
      ]
    });

    if (!lancamento) {
      return res.status(404).json({ message: 'Lançamento não encontrado' });
    }

    return res.status(200).json(lancamento);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar lançamento',
      error: error.message
    });
  }
};

// Atualizar um lançamento
exports.updateLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      tipo, 
      descricao, 
      valor, 
      data_lancamento, 
      data_vencimento, 
      status, 
      forma_pagamento, 
      observacoes, 
      entidadeId 
    } = req.body;
    
    const userId = req.userId; // Vem do middleware de autenticação

    // Buscar o lançamento
    const lancamento = await Lancamento.findOne({
      where: { id, userId }
    });

    if (!lancamento) {
      return res.status(404).json({ message: 'Lançamento não encontrado' });
    }

    // Se estiver alterando a entidade, verificar se a nova entidade existe e pertence ao usuário
    if (entidadeId && entidadeId !== lancamento.entidadeId) {
      const entidade = await Entidade.findOne({ 
        where: { id: entidadeId, userId } 
      });
      
      if (!entidade) {
        return res.status(404).json({ message: 'Entidade não encontrada' });
      }
    }

    // Atualizar apenas os campos fornecidos
    if (tipo) lancamento.tipo = tipo;
    if (descricao) lancamento.descricao = descricao;
    if (valor) lancamento.valor = valor;
    if (data_lancamento) lancamento.data_lancamento = data_lancamento;
    if (data_vencimento !== undefined) lancamento.data_vencimento = data_vencimento;
    if (status) lancamento.status = status;
    if (forma_pagamento !== undefined) lancamento.forma_pagamento = forma_pagamento;
    if (observacoes !== undefined) lancamento.observacoes = observacoes;
    if (entidadeId) lancamento.entidadeId = entidadeId;

    // Atualizar caminho do anexo se um novo arquivo foi enviado
    if (req.file) {
      // Se já existia um anexo, remover o arquivo antigo
      if (lancamento.caminho_anexo) {
        const oldFilePath = path.join(__dirname, '..', lancamento.caminho_anexo);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      lancamento.caminho_anexo = req.file.path.replace(/\\/g, '/');
    }

    await lancamento.save();

    return res.status(200).json({
      message: 'Lançamento atualizado com sucesso',
      lancamento
    });
  } catch (error) {
    // Se ocorrer um erro e um novo arquivo foi enviado, remover o arquivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: 'Erro ao atualizar lançamento',
      error: error.message
    });
  }
};

// Excluir um lançamento
exports.deleteLancamento = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Vem do middleware de autenticação

    // Buscar o lançamento
    const lancamento = await Lancamento.findOne({
      where: { id, userId }
    });

    if (!lancamento) {
      return res.status(404).json({ message: 'Lançamento não encontrado' });
    }

    // Se existir um anexo, remover o arquivo
    if (lancamento.caminho_anexo) {
      const filePath = path.join(__dirname, '..', lancamento.caminho_anexo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Excluir o lançamento
    await lancamento.destroy();

    return res.status(200).json({
      message: 'Lançamento excluído com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir lançamento',
      error: error.message
    });
  }
};
