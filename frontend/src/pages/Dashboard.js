import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componentes
import Layout from '../components/Layout';

// Ícones
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BusinessIcon from '@mui/icons-material/Business';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard`);
        setDashboardData(response.data);
        setError('');
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Olá, {currentUser?.username}! Bem-vindo ao seu painel financeiro.
        </Typography>

        {/* Cards de resumo */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Saldo Total */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#e3f2fd',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography component="h2" variant="h6" color="primary">
                  Saldo Total
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                {dashboardData ? formatCurrency(dashboardData.resumo.saldoTotal) : 'R$ 0,00'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Consolidado
              </Typography>
            </Paper>
          </Grid>
          
          {/* Receitas do Mês */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#e8f5e9',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography component="h2" variant="h6" color="success.main">
                  Receitas do Mês
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                {dashboardData ? formatCurrency(dashboardData.resumo.totalReceitas) : 'R$ 0,00'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Mês atual
              </Typography>
            </Paper>
          </Grid>
          
          {/* Despesas do Mês */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#ffebee',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography component="h2" variant="h6" color="error.main">
                  Despesas do Mês
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                {dashboardData ? formatCurrency(dashboardData.resumo.totalDespesas) : 'R$ 0,00'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Mês atual
              </Typography>
            </Paper>
          </Grid>
          
          {/* Total de Entidades */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: '#ede7f6',
              }}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <BusinessIcon sx={{ color: 'secondary.main', mr: 1 }} />
                <Typography component="h2" variant="h6" color="secondary.main">
                  Entidades
                </Typography>
              </Box>
              <Typography component="p" variant="h4">
                {dashboardData ? dashboardData.resumo.totalEntidades : '0'}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Cadastradas
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Últimos Lançamentos */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Últimos Lançamentos
              </Typography>
              
              {dashboardData && dashboardData.ultimosLancamentos.length > 0 ? (
                <Box sx={{ width: '100%', overflow: 'auto' }}>
                  <Box sx={{ minWidth: 800 }}>
                    <Box sx={{ display: 'flex', fontWeight: 'bold', p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Box sx={{ flex: 2 }}>Descrição</Box>
                      <Box sx={{ flex: 1 }}>Data</Box>
                      <Box sx={{ flex: 1 }}>Entidade</Box>
                      <Box sx={{ flex: 1 }}>Tipo</Box>
                      <Box sx={{ flex: 1, textAlign: 'right' }}>Valor</Box>
                    </Box>
                    
                    {dashboardData.ultimosLancamentos.map((lancamento) => (
                      <Box 
                        key={lancamento.id} 
                        sx={{ 
                          display: 'flex', 
                          p: 1,
                          '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.06)' }
                        }}
                      >
                        <Box sx={{ flex: 2 }}>{lancamento.descricao}</Box>
                        <Box sx={{ flex: 1 }}>{new Date(lancamento.data_lancamento).toLocaleDateString('pt-BR')}</Box>
                        <Box sx={{ flex: 1 }}>{lancamento.Entidade.nome_razao_social}</Box>
                        <Box sx={{ flex: 1, color: lancamento.tipo === 'Receita' ? 'success.main' : 'error.main' }}>
                          {lancamento.tipo}
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: lancamento.tipo === 'Receita' ? 'success.main' : 'error.main' }}>
                          {formatCurrency(lancamento.valor)}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                  Nenhum lançamento encontrado.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="primary" href="/lancamentos">
                  Ver todos os lançamentos
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
