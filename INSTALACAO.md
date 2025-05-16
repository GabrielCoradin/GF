# Guia de Instalação - Sistema de Gestão Financeira

Este guia explica como instalar e executar o Sistema de Gestão Financeira em sua máquina local. O sistema é dividido em duas partes: backend (Node.js) e frontend (React).

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [MySQL](https://www.mysql.com/) (versão 5.7 ou superior)

## Clonando o Repositório

1. Abra o terminal (ou Prompt de Comando no Windows)
2. Clone o repositório (ou baixe e extraia o ZIP)
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd gestao_financeira_node_react
   ```

## Configurando o Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz da pasta backend com as seguintes variáveis:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=gestao_financeira
   JWT_SECRET=sua_chave_secreta_para_tokens
   ```
   Substitua `sua_senha_mysql` pela senha do seu MySQL e `sua_chave_secreta_para_tokens` por uma string aleatória para segurança.

4. Crie o banco de dados no MySQL:
   ```bash
   mysql -u root -p
   ```
   Após digitar sua senha, execute:
   ```sql
   CREATE DATABASE gestao_financeira;
   EXIT;
   ```

5. Inicie o servidor backend:
   ```bash
   npm start
   ```
   O servidor estará rodando em `http://localhost:5000`

## Configurando o Frontend

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz da pasta frontend com:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Inicie o servidor de desenvolvimento do React:
   ```bash
   npm start
   ```
   O aplicativo estará rodando em `http://localhost:3000`

## Estrutura do Projeto

### Backend (Node.js/Express)
- `server.js`: Ponto de entrada da aplicação
- `config/`: Configurações do banco de dados e outras
- `models/`: Modelos Sequelize para o banco de dados
- `routes/`: Rotas da API
- `controllers/`: Lógica de negócios
- `middlewares/`: Middlewares como autenticação
- `uploads/`: Pasta para armazenar arquivos enviados

### Frontend (React)
- `src/components/`: Componentes React reutilizáveis
- `src/pages/`: Páginas da aplicação
- `src/services/`: Serviços para comunicação com a API
- `src/contexts/`: Contextos para gerenciamento de estado
- `src/utils/`: Funções utilitárias

## Solução de Problemas Comuns

### Erro de conexão com o banco de dados
- Verifique se o MySQL está rodando
- Confirme se as credenciais no arquivo `.env` estão corretas
- Certifique-se de que o banco de dados foi criado

### Erro de CORS no frontend
- Verifique se o backend está rodando
- Confirme se a URL da API no frontend está correta

### Problemas com dependências
- Tente remover as pastas `node_modules` e executar `npm install` novamente

## Próximos Passos

Após a instalação, você poderá:
1. Criar uma conta de usuário
2. Cadastrar entidades (CNPJs/CPFs)
3. Registrar lançamentos financeiros
4. Visualizar o dashboard com resumo financeiro

Para qualquer dúvida ou problema, entre em contato.
