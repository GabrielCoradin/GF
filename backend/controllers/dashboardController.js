const Lancamento = require('../models/Lancamento');
const Entidade = require('../models/Entidade');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Obter resumo financeiro para o dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.userId; // Vem do middleware de autenticação
    
    // Data atual e primeiro dia do mês atual
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    // Contagem de entidades
    const totalEntidades = await Entidade.count({
      where: { userId }
    });
    
    // Total de receitas do mês atual
    const totalReceitas = await Lancamento.sum('valor', {
      where: {
        userId,
        tipo: 'Receita',
        data_lancamento: {
          [Op.between]: [primeiroDiaMes, ultimoDiaMes]
        }
      }
    }) || 0;
    
    // Total de despesas do mês atual
    const totalDespesas = await Lancamento.sum('valor', {
      where: {
        userId,
        tipo: 'Despesa',
        data_lancamento: {
          [Op.between]: [primeiroDiaMes, ultimoDiaMes]
        }
      }
    }) || 0;
    
    // Saldo total (todas as receitas menos todas as despesas)
    const totalReceitasGeral = await Lancamento.sum('valor', {
      where: {
        userId,
        tipo: 'Receita'
      }
    }) || 0;
    
    const totalDespesasGeral = await Lancamento.sum('valor', {
      where: {
        userId,
        tipo: 'Despesa'
      }
    }) || 0;
    
    const saldoTotal = totalReceitasGeral - totalDespesasGeral;
    
    // Últimos 5 lançamentos
    const ultimosLancamentos = await Lancamento.findAll({
      where: { userId },
      include: [
        {
          model: Entidade,
          attributes: ['nome_razao_social']
        }
      ],
      order: [['data_lancamento', 'DESC']],
      limit: 5
    });
    
    // Dados para gráfico de despesas por entidade (top 5)
    const despesasPorEntidade = await Lancamento.findAll({
      attributes: [
        'entidadeId',
        [sequelize.fn('SUM', sequelize.col('valor')), 'total']
      ],
      where: {
        userId,
        tipo: 'Despesa',
        data_lancamento: {
          [Op.between]: [primeiroDiaMes, ultimoDiaMes]
        }
      },
      include: [
        {
          model: Entidade,
          attributes: ['nome_razao_social']
        }
      ],
      group: ['entidadeId'],
      order: [[sequelize.fn('SUM', sequelize.col('valor')), 'DESC']],
      limit: 5
    });
    
    // Dados para gráfico de fluxo de caixa dos últimos 6 meses
    const mesesAnteriores = [];
    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setMonth(data.getMonth() - i);
      mesesAnteriores.push({
        mes: data.getMonth(),
        ano: data.getFullYear(),
        nome: data.toLocaleString('pt-BR', { month: 'short' })
      });
    }
    
    const fluxoCaixa = [];
    
    for (const { mes, ano, nome } of mesesAnteriores) {
      const primeiroDia = new Date(ano, mes, 1);
      const ultimoDia = new Date(ano, mes + 1, 0);
      
      const receitas = await Lancamento.sum('valor', {
        where: {
          userId,
          tipo: 'Receita',
          data_lancamento: {
            [Op.between]: [primeiroDia, ultimoDia]
          }
        }
      }) || 0;
      
      const despesas = await Lancamento.sum('valor', {
        where: {
          userId,
          tipo: 'Despesa',
          data_lancamento: {
            [Op.between]: [primeiroDia, ultimoDia]
          }
        }
      }) || 0;
      
      fluxoCaixa.push({
        mes: nome,
        receitas,
        despesas
      });
    }
    
    return res.status(200).json({
      resumo: {
        totalEntidades,
        totalReceitas,
        totalDespesas,
        saldoTotal,
        saldoMes: totalReceitas - totalDespesas
      },
      ultimosLancamentos,
      graficos: {
        despesasPorEntidade,
        fluxoCaixa
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao obter dados do dashboard',
      error: error.message
    });
  }
};
