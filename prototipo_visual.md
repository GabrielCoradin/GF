# Protótipo Visual - Sistema de Gestão Financeira

Este documento apresenta o protótipo visual do Sistema de Gestão Financeira desenvolvido com Node.js e React, conforme solicitado. O protótipo inclui as principais telas e funcionalidades do sistema.

## Estrutura do Protótipo

O protótipo visual foi desenvolvido com as seguintes tecnologias:

- **Frontend**: React, Material-UI, React Router
- **Backend**: Node.js, Express, Sequelize, MySQL

## Telas Principais

### 1. Login
- Formulário de autenticação com campos para e-mail e senha
- Link para cadastro de novos usuários
- Validação de campos e exibição de mensagens de erro
- Redirecionamento para o Dashboard após login bem-sucedido

### 2. Cadastro de Usuário
- Formulário para registro de novos usuários
- Campos para nome de usuário, e-mail, senha e confirmação de senha
- Validações de campos e exibição de mensagens de erro/sucesso
- Redirecionamento para o Login após cadastro bem-sucedido

### 3. Dashboard
- Visão geral da situação financeira
- Cards com resumo financeiro:
  - Saldo total consolidado
  - Receitas do mês atual
  - Despesas do mês atual
  - Total de entidades cadastradas
- Lista dos últimos lançamentos financeiros
- Botão para acessar todos os lançamentos

### 4. Layout Principal
- Barra lateral de navegação (menu)
- Cabeçalho com nome do usuário logado
- Menu responsivo (adaptável para dispositivos móveis)
- Opções de navegação:
  - Dashboard
  - Entidades (CNPJs/CPFs)
  - Lançamentos
  - Relatórios
  - Sair (Logout)

## Fluxo de Navegação

1. O usuário acessa o sistema e é direcionado para a tela de Login
2. Após autenticação, é redirecionado para o Dashboard
3. A partir do Dashboard, pode navegar para as demais funcionalidades através do menu lateral
4. Todas as telas internas compartilham o mesmo layout com menu lateral e cabeçalho

## Funcionalidades Planejadas

As seguintes funcionalidades estão planejadas para implementação completa após a validação do protótipo:

1. **Gestão de Entidades (CNPJs/CPFs)**:
   - Cadastro, edição e exclusão de entidades
   - Listagem com filtros e busca

2. **Lançamentos Financeiros**:
   - Registro de receitas e despesas
   - Upload de comprovantes
   - Filtros por data, tipo, entidade, etc.
   - Edição e exclusão de lançamentos

3. **Relatórios Financeiros**:
   - Extrato de movimentações
   - Fluxo de caixa
   - Receitas e despesas por categoria/entidade

## Próximos Passos

Após a validação deste protótipo visual, seguiremos com:

1. Implementação completa das funcionalidades
2. Testes integrados
3. Documentação final
4. Entrega do sistema completo

Por favor, avalie este protótipo e forneça seu feedback para que possamos prosseguir com a implementação completa do sistema.
