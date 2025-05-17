import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const Entidades = () => {
  // Estados para gerenciar entidades
  const [entidades, setEntidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para filtragem
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  
  // Estados para o modal de formulário
  const [open, setOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' ou 'edit'
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nome_razao_social: '',
    tipo: 'CNPJ',
    documento: '',
    nome_fantasia: '',
    telefone: '',
    email: ''
  });
  
  // Estados para feedback ao usuário
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Estados para confirmação de exclusão
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Carregar entidades ao montar o componente
  useEffect(() => {
    fetchEntidades();
  }, []);

  // Função para buscar entidades da API
  const fetchEntidades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/entidades`);
      setEntidades(response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar entidades:', err);
      setError('Não foi possível carregar as entidades. Por favor, tente novamente.');
      
      // Para desenvolvimento, criar dados de exemplo se a API falhar
      setEntidades([
        { id: 1, nome_razao_social: 'Empresa Exemplo LTDA', tipo: 'CNPJ', documento: '12.345.678/0001-90', nome_fantasia: 'Empresa Exemplo', telefone: '(11) 1234-5678', email: 'contato@exemplo.com' },
        { id: 2, nome_razao_social: 'João da Silva', tipo: 'CPF', documento: '123.456.789-00', telefone: '(11) 98765-4321', email: 'joao@exemplo.com' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Funções para manipulação do modal
  const handleOpen = (mode, entidade = null) => {
    if (mode === 'edit' && entidade) {
      setFormData({
        nome_razao_social: entidade.nome_razao_social,
        tipo: entidade.tipo,
        documento: entidade.documento,
        nome_fantasia: entidade.nome_fantasia || '',
        telefone: entidade.telefone || '',
        email: entidade.email || ''
      });
      setCurrentId(entidade.id);
    } else {
      setFormData({
        nome_razao_social: '',
        tipo: 'CNPJ',
        documento: '',
        nome_fantasia: '',
        telefone: '',
        email: ''
      });
      setCurrentId(null);
    }
    
    setFormMode(mode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar entidade (criar ou editar)
  const handleSave = async () => {
    try {
      // Validação básica
      if (!formData.nome_razao_social || !formData.tipo || !formData.documento) {
        setSnackbar({
          open: true,
          message: 'Por favor, preencha todos os campos obrigatórios.',
          severity: 'error'
        });
        return;
      }
      
      if (formMode === 'create') {
        // Criar nova entidade
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/entidades`, formData);
        setEntidades(prev => [...prev, response.data.entidade]);
        setSnackbar({
          open: true,
          message: 'Entidade cadastrada com sucesso!',
          severity: 'success'
        });
      } else {
        // Atualizar entidade existente
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/entidades/${currentId}`, formData);
        setEntidades(prev => prev.map(item => item.id === currentId ? response.data.entidade : item));
        setSnackbar({
          open: true,
          message: 'Entidade atualizada com sucesso!',
          severity: 'success'
        });
      }
      
      handleClose();
      
      // Para desenvolvimento, simular a operação se a API falhar
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          if (formMode === 'create') {
            const newEntidade = {
              id: entidades.length + 1,
              ...formData
            };
            setEntidades(prev => [...prev, newEntidade]);
          } else {
            setEntidades(prev => prev.map(item => item.id === currentId ? { ...item, ...formData } : item));
          }
        }, 500);
      }
    } catch (err) {
      console.error('Erro ao salvar entidade:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao salvar entidade. Por favor, tente novamente.',
        severity: 'error'
      });
    }
  };

  // Funções para exclusão de entidade
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/entidades/${deleteId}`);
      setEntidades(prev => prev.filter(item => item.id !== deleteId));
      setSnackbar({
        open: true,
        message: 'Entidade excluída com sucesso!',
        severity: 'success'
      });
      
      // Para desenvolvimento, simular a exclusão se a API falhar
      if (process.env.NODE_ENV === 'development') {
        setEntidades(prev => prev.filter(item => item.id !== deleteId));
      }
    } catch (err) {
      console.error('Erro ao excluir entidade:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir entidade. Por favor, tente novamente.',
        severity: 'error'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteId(null);
  };

  // Funções para paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funções para filtragem
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleTipoFiltroChange = (e) => {
    setTipoFiltro(e.target.value);
  };

  // Filtrar entidades
  const entidadesFiltradas = entidades.filter(entidade => {
    if (tipoFiltro !== 'todos' && entidade.tipo !== tipoFiltro) {
      return false;
    }
    
    if (filtro) {
      const termoLower = filtro.toLowerCase();
      return (
        entidade.nome_razao_social.toLowerCase().includes(termoLower) ||
        entidade.documento.toLowerCase().includes(termoLower) ||
        (entidade.nome_fantasia && entidade.nome_fantasia.toLowerCase().includes(termoLower)) ||
        (entidade.email && entidade.email.toLowerCase().includes(termoLower))
      );
    }
    
    return true;
  });

  // Paginação
  const entidadesPaginadas = entidadesFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Formatação de documento (CPF/CNPJ)
  const formatarDocumento = (doc, tipo) => {
    // Remover caracteres não numéricos
    const numeros = doc.replace(/\D/g, '');
    
    if (tipo === 'CPF') {
      // Formato: 000.000.000-00
      if (numeros.length !== 11) return doc;
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // Formato: 00.000.000/0000-00
      if (numeros.length !== 14) return doc;
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestão de Entidades
        </Typography>
        
        {/* Filtros e botão de adicionar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Buscar entidade"
                variant="outlined"
                size="small"
                value={filtro}
                onChange={handleFiltroChange}
                InputProps={{
                  endAdornment: <SearchIcon color="action" />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipoFiltro}
                  label="Tipo"
                  onChange={handleTipoFiltroChange}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="CNPJ">CNPJ</MenuItem>
                  <MenuItem value="CPF">CPF</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpen('create')}
              >
                Nova Entidade
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabela de entidades */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
          ) : entidadesFiltradas.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              Nenhuma entidade encontrada. Clique em "Nova Entidade" para cadastrar.
            </Alert>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="tabela de entidades">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome/Razão Social</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Nome Fantasia</TableCell>
                      <TableCell>Contato</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entidadesPaginadas.map((entidade) => (
                      <TableRow hover key={entidade.id}>
                        <TableCell>{entidade.nome_razao_social}</TableCell>
                        <TableCell>{entidade.tipo}</TableCell>
                        <TableCell>{formatarDocumento(entidade.documento, entidade.tipo)}</TableCell>
                        <TableCell>{entidade.nome_fantasia || '-'}</TableCell>
                        <TableCell>
                          {entidade.telefone && <div>{entidade.telefone}</div>}
                          {entidade.email && <div>{entidade.email}</div>}
                          {!entidade.telefone && !entidade.email && '-'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen('edit', entidade)}
                            size="small"
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(entidade.id)}
                            size="small"
                            title="Excluir"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={entidadesFiltradas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </>
          )}
        </Paper>
        
        {/* Modal de formulário */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {formMode === 'create' ? 'Nova Entidade' : 'Editar Entidade'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome/Razão Social *"
                  name="nome_razao_social"
                  value={formData.nome_razao_social}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    name="tipo"
                    value={formData.tipo}
                    label="Tipo *"
                    onChange={handleChange}
                  >
                    <MenuItem value="CNPJ">CNPJ</MenuItem>
                    <MenuItem value="CPF">CPF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento *"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                  placeholder={formData.tipo === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Fantasia"
                  name="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={handleChange}
                  helperText={formData.tipo === 'CPF' ? 'Opcional para pessoa física' : 'Nome comercial da empresa'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir esta entidade? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default Entidades;
