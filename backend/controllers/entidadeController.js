const Entidade = require('../models/Entidade');

// Criar uma nova entidade
exports.createEntidade = async (req, res) => {
  try {
    const { nome_razao_social, tipo, documento, nome_fantasia, telefone, email } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    // Verificar campos obrigatórios
    if (!nome_razao_social || !tipo || !documento) {
      return res.status(400).json({ message: 'Nome/Razão Social, tipo e documento são obrigatórios' });
    }

    // Verificar se o tipo é válido
    if (tipo !== 'CNPJ' && tipo !== 'CPF') {
      return res.status(400).json({ message: 'Tipo deve ser CNPJ ou CPF' });
    }

    // Verificar se o documento já existe
    const documentoExists = await Entidade.findOne({ where: { documento } });
    if (documentoExists) {
      return res.status(400).json({ message: 'Este documento já está cadastrado' });
    }

    // Criar a entidade
    const entidade = await Entidade.create({
      nome_razao_social,
      tipo,
      documento,
      nome_fantasia,
      telefone,
      email,
      userId
    });

    return res.status(201).json({
      message: 'Entidade cadastrada com sucesso',
      entidade
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao cadastrar entidade',
      error: error.message
    });
  }
};

// Listar todas as entidades do usuário
exports.getAllEntidades = async (req, res) => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação

    const entidades = await Entidade.findAll({
      where: { userId },
      order: [['nome_razao_social', 'ASC']]
    });

    return res.status(200).json(entidades);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao listar entidades',
      error: error.message
    });
  }
};

// Obter uma entidade específica
exports.getEntidade = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Vem do middleware de autenticação

    const entidade = await Entidade.findOne({
      where: { id, userId }
    });

    if (!entidade) {
      return res.status(404).json({ message: 'Entidade não encontrada' });
    }

    return res.status(200).json(entidade);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar entidade',
      error: error.message
    });
  }
};

// Atualizar uma entidade
exports.updateEntidade = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_razao_social, tipo, documento, nome_fantasia, telefone, email } = req.body;
    const userId = req.userId; // Vem do middleware de autenticação

    // Buscar a entidade
    const entidade = await Entidade.findOne({
      where: { id, userId }
    });

    if (!entidade) {
      return res.status(404).json({ message: 'Entidade não encontrada' });
    }

    // Verificar se o documento já existe (se estiver sendo alterado)
    if (documento && documento !== entidade.documento) {
      const documentoExists = await Entidade.findOne({ where: { documento } });
      if (documentoExists) {
        return res.status(400).json({ message: 'Este documento já está cadastrado para outra entidade' });
      }
    }

    // Atualizar apenas os campos fornecidos
    if (nome_razao_social) entidade.nome_razao_social = nome_razao_social;
    if (tipo) entidade.tipo = tipo;
    if (documento) entidade.documento = documento;
    if (nome_fantasia !== undefined) entidade.nome_fantasia = nome_fantasia;
    if (telefone !== undefined) entidade.telefone = telefone;
    if (email !== undefined) entidade.email = email;

    await entidade.save();

    return res.status(200).json({
      message: 'Entidade atualizada com sucesso',
      entidade
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar entidade',
      error: error.message
    });
  }
};

// Excluir uma entidade
exports.deleteEntidade = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Vem do middleware de autenticação

    // Buscar a entidade
    const entidade = await Entidade.findOne({
      where: { id, userId }
    });

    if (!entidade) {
      return res.status(404).json({ message: 'Entidade não encontrada' });
    }

    // Verificar se há lançamentos associados (implementar quando o modelo Lancamento estiver pronto)
    // const lancamentos = await Lancamento.findOne({ where: { entidadeId: id } });
    // if (lancamentos) {
    //   return res.status(400).json({ message: 'Não é possível excluir esta entidade pois existem lançamentos associados a ela' });
    // }

    // Excluir a entidade
    await entidade.destroy();

    return res.status(200).json({
      message: 'Entidade excluída com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir entidade',
      error: error.message
    });
  }
};
