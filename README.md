# Sistema de Gestão Financeira

Um sistema completo para gestão financeira de empresas, permitindo o controle de entradas e saídas de recursos financeiros para CNPJs e CPFs.

## Funcionalidades

- **Cadastro e Login:** Sistema seguro de autenticação de usuários
- **Gestão de Entidades:** Cadastro e gerenciamento de CNPJs e CPFs
- **Dashboard Intuitivo:** Resumo visual da saúde financeira com saldos e gráficos
- **Lançamentos Financeiros:** Registro detalhado de receitas e despesas com upload de comprovantes
- **Relatórios Completos:** Extrato de movimentações, fluxo de caixa e análises financeiras

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Sequelize (ORM)
- MySQL
- JWT para autenticação

### Frontend
- React
- Material-UI
- React Router
- Axios
- Context API

## Requisitos

- Node.js (versão 14.x ou superior)
- npm (geralmente vem com o Node.js)
- MySQL (versão 5.7 ou superior)

## Instalação

Consulte o arquivo [INSTALACAO.md](./INSTALACAO.md) para instruções detalhadas sobre como instalar e executar o projeto em sua máquina local.

## Estrutura do Projeto

### Backend
- `server.js`: Ponto de entrada da aplicação
- `config/`: Configurações do banco de dados
- `models/`: Modelos Sequelize para o banco de dados
- `routes/`: Rotas da API
- `controllers/`: Lógica de negócios
- `middlewares/`: Middlewares como autenticação
- `uploads/`: Pasta para armazenar arquivos enviados

### Frontend
- `src/components/`: Componentes React reutilizáveis
- `src/pages/`: Páginas da aplicação
- `src/contexts/`: Contextos para gerenciamento de estado
- `src/services/`: Serviços para comunicação com a API

## Protótipo Visual

Para mais detalhes sobre o protótipo visual e as telas do sistema, consulte o arquivo [prototipo_visual.md](./prototipo_visual.md).

## Contribuição

Este projeto está em desenvolvimento. Contribuições são bem-vindas!

## Licença

Este projeto está licenciado sob a licença MIT.
