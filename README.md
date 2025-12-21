# Documentação do Sistema Rentogram

O Rentogram é um sistema completo para gestão de propriedades e reservas, composto por um backend em Node.js e um frontend em React. Esta documentação abrange a configuração, uso e detalhes técnicos do sistema.

## Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Instruções de Configuração](#instruções-de-configuração)
   - [Backend](#backend)
   - [Frontend](#frontend)
3. [Guia de Uso](#guia-de-uso)
   - [Gestão de Propriedades](#gestão-de-propriedades)
   - [Gestão de Reservas](#gestão-de-reservas)
4. [Detalhes Técnicos](#detalhes-técnicos)
   - [Arquitetura do Sistema](#arquitetura-do-sistema)
   - [Funcionalidades Técnicas](#funcionalidades-técnicas)
   - [API Endpoints](#api-endpoints)
5. [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Visão Geral do Sistema

O Rentogram é uma aplicação full-stack que permite:
- Cadastro e gestão de propriedades para locação
- Criação e gerenciamento de reservas
- Visualização de estatísticas e calendário de ocupação
- Interface intuitiva para administração

## Instruções de Configuração

### Backend

#### Requisitos
- Node.js 14+
- SQLite
- npm ou yarn

#### Passos para Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env` (se existir)
   - Configure as variáveis necessárias:
     ```env
     PORT=3000
     NODE_ENV=development
     ```

3. **Inicializar o banco de dados:**
   - O banco de dados SQLite será criado automaticamente na primeira execução
   - O arquivo `database.sqlite` será gerado na raiz do projeto

4. **Executar o servidor:**
   - Modo desenvolvimento (com hot-reload):
     ```bash
     npm run dev
     ```
   - Modo produção:
     ```bash
     npm start
     ```

5. **Verificar a API:**
   - A API estará disponível em `http://localhost:3000/api`
   - Teste os endpoints com ferramentas como Postman ou cURL

### Frontend

#### Requisitos
- Node.js 14+
- npm ou yarn

#### Passos para Configuração

1. **Instalar dependências:**
   ```bash
   cd src/frontend
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   - Verifique o arquivo `src/frontend/config.ts`
   - Ajuste a URL base da API se necessário:
     ```typescript
     const API_BASE_URL = 'http://localhost:3000/api';
     ```

3. **Executar o frontend:**
   - Modo desenvolvimento:
     ```bash
     npm run dev
     ```
   - O frontend estará disponível em `http://localhost:5173` (ou outra porta configurada)

4. **Build para produção:**
   ```bash
   npm run build
   ```

## Guia de Uso

### Gestão de Propriedades

#### Cadastro de Propriedade
1. Acesse a interface de administração
2. Navegue até a seção "Imóveis"
3. Clique em "Nova Propriedade"
4. Preencha os campos:
   - Título
   - Descrição
   - Endereço
   - Preço por noite
   - Número de quartos
   - Número de banheiros
   - Máximo de hóspedes
   - Comodidades
   - URL da imagem
5. Salve a propriedade

#### Edição de Propriedade
1. Na lista de propriedades, clique em "Editar" na propriedade desejada
2. Atualize os campos necessários
3. Salve as alterações

#### Exclusão de Propriedade
1. Na lista de propriedades, clique em "Excluir" na propriedade desejada
2. Confirme a exclusão

### Gestão de Reservas

#### Criação de Reserva
1. Acesse a seção "Reservas"
2. Clique em "Nova Reserva"
3. Preencha os campos:
   - Imóvel (seleção)
   - Data de início
   - Data de término
   - Nome do hóspede
   - Email do hóspede
4. Salve a reserva

#### Visualização de Reservas
- Todas as reservas são exibidas em uma tabela com:
  - Nome do imóvel
  - Nome do hóspede
  - Período da reserva
  - Opções de edição e exclusão

#### Calendário de Ocupação
- O dashboard exibe um calendário com todas as reservas
- Clique em uma reserva no calendário para ver detalhes

## Detalhes Técnicos

### Arquitetura do Sistema

```
┌───────────────────────────────────────────────────────┐
│                    Rentogram System                    │
├───────────────────┬───────────────────┬─────────────────┤
│     Frontend      │     Backend       │    Database     │
│  (React/TS)       │  (Node.js/Express)│  (SQLite)       │
├───────────────────┼───────────────────┼─────────────────┤
│ - Components      │ - Controllers     │ - Properties    │
│ - Pages           │ - Models          │ - Reservations  │
│ - Config          │ - Routes          │                 │
│ - Styles          │ - Middlewares     │                 │
└───────────────────┴───────────────────┴─────────────────┘
```

#### Fluxo de Dados

1. **Frontend:**
   - React com TypeScript
   - Gerenciamento de estado com hooks
   - Comunicação com a API via fetch

2. **Backend:**
   - Arquitetura MVC
   - Rotas RESTful
   - Middlewares para validação
   - Conexão com banco de dados

3. **Banco de Dados:**
   - SQLite com duas tabelas principais:
     - `properties`: Armazena informações das propriedades
     - `reservations`: Armazena informações das reservas

### Funcionalidades Técnicas

#### Backend
- **Autenticação:** Não implementada (pode ser adicionada)
- **Validação:** Middlewares para validação de dados
- **CORS:** Configurado para permitir requisições do frontend
- **Tratamento de Erros:** Respostas padronizadas para erros

#### Frontend
- **Roteamento:** React Router para navegação
- **Estados:** useState e useEffect para gerenciamento
- **Estilos:** Bootstrap para componentes UI
- **Calendário:** FullCalendar para visualização de reservas

### API Endpoints

#### Propriedades

| Método | Endpoint                     | Descrição                          |
|--------|------------------------------|------------------------------------|
| POST   | `/api/properties`            | Criar nova propriedade             |
| GET    | `/api/properties`            | Listar todas as propriedades       |
| GET    | `/api/properties/:id`        | Obter propriedade por ID           |
| PUT    | `/api/properties/:id`        | Atualizar propriedade              |
| DELETE | `/api/properties/:id`        | Excluir propriedade                |

#### Reservas

| Método | Endpoint                              | Descrição                          |
|--------|---------------------------------------|------------------------------------|
| POST   | `/api/reservations`                   | Criar nova reserva                 |
| GET    | `/api/reservations`                   | Listar todas as reservas           |
| GET    | `/api/reservations/:id`               | Obter reserva por ID               |
| GET    | `/api/reservations/property/:property_id` | Obter reservas por propriedade |
| PUT    | `/api/reservations/:id`               | Atualizar reserva                  |
| DELETE | `/api/reservations/:id`               | Excluir reserva                    |

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- SQLite3
- CORS
- Body-parser
- Dotenv
- Nodemon (desenvolvimento)

### Frontend
- React
- TypeScript
- React Router
- Bootstrap
- FullCalendar
- Axios (ou fetch para requisições)

## Estrutura do Projeto

```
/
├── src/
│   ├── frontend/          # Frontend (React)
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── config.ts       # Configurações do frontend
│   │   ├── App.tsx         # Componente principal
│   │   └── index.tsx       # Ponto de entrada
│   ├── config/            # Configurações do backend
│   ├── controllers/       # Controladores da API
│   ├── database/          # Configuração do banco de dados
│   ├── middlewares/       # Middlewares
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   └── server.js          # Servidor principal
├── .env                  # Variáveis de ambiente
├── package.json          # Dependências
└── README.md             # Documentação
```

## Boas Práticas

1. **Backend:**
   - Sempre valide os dados de entrada
   - Use transações para operações críticas
   - Mantenha os endpoints RESTful

2. **Frontend:**
   - Gerencie estados de forma eficiente
   - Use componentes reutilizáveis
   - Mantenha a interface responsiva

3. **Banco de Dados:**
   - Faça backup regular do banco de dados
   - Otimize consultas para melhor performance

## Solução de Problemas

### Backend não inicia
- Verifique se a porta 3000 está disponível
- Confira as variáveis de ambiente no arquivo `.env`
- Certifique-se de que todas as dependências estão instaladas

### Frontend não se conecta à API
- Verifique se o backend está em execução
- Confira a URL base da API no arquivo `config.ts`
- Certifique-se de que o CORS está configurado corretamente

### Erros de banco de dados
- Verifique se o arquivo `database.sqlite` existe
- Confira as permissões de escrita no diretório
- Certifique-se de que as tabelas foram criadas corretamente

## Próximos Passos

1. Implementar autenticação e autorização
2. Adicionar testes automatizados
3. Implementar cache para melhorar performance
4. Adicionar funcionalidade de busca e filtros
5. Implementar notificações por email

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença ISC. Consulte o arquivo LICENSE para mais detalhes.
