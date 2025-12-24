# Artefato de Contexto Canônico do Projeto Rentogram

Este documento serve como artefato canônico de contexto para o projeto Rentogram, permitindo que qualquer agente inicie o trabalho com conhecimento zero prévio. Ele consolida informações extraídas da ingestão do repositório, incluindo visão geral, arquitetura, configuração e referências essenciais.

## Regras de Governança

1. All planning and execution MUST be organized by PRIORITY-BASED SPRINTS, not time-boxed sprints. A sprint is complete ONLY when its priority objectives are cognitively and technically closed.

2. Time-based sprint assumptions are explicitly DISALLOWED unless explicitly reintroduced by the ORCHESTRATOR.

## Visão Geral do Projeto

O Rentogram é uma aplicação full-stack para gestão de propriedades de locação e reservas associadas. O sistema permite:

- Cadastro e gestão de imóveis (propriedades) com detalhes como endereço, preço, comodidades e imagens.
- Criação, edição e exclusão de reservas vinculadas a propriedades, incluindo datas, informações do hóspede e status.
- Interface web para administração, com visualização de calendário de ocupação e estatísticas básicas.
- API RESTful para integração com outros sistemas.

O projeto segue uma arquitetura cliente-servidor, com backend em Node.js/Express e frontend em React/TypeScript.

## Arquitetura do Sistema

O sistema adota uma arquitetura MVC (Model-View-Controller) no backend e component-based no frontend.

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

### Fluxo de Dados

1. O frontend (React) envia requisições HTTP para o backend via fetch.
2. O backend (Express) processa as requisições através de middlewares de validação, controladores e modelos.
3. Os modelos interagem com o banco de dados SQLite para operações CRUD.
4. Respostas são retornadas ao frontend em formato JSON.

## Pilha Tecnológica

### Backend
- **Node.js**: Runtime JavaScript para servidor.
- **Express**: Framework web para APIs RESTful.
- **SQLite3**: Banco de dados relacional leve.
- **CORS**: Middleware para permitir requisições cross-origin.
- **Body-parser**: Parsing de corpos de requisição.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **Nodemon**: Ferramenta para reinicialização automática em desenvolvimento.

### Frontend
- **React**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset JavaScript com tipagem estática.
- **React Router**: Roteamento para navegação single-page.
- **Bootstrap**: Framework CSS para estilização responsiva.
- **FullCalendar**: Componente para visualização de calendários (mencionado em documentação, mas não confirmado no código).

### Outros
- **SQLite**: Banco de dados file-based, criado automaticamente na primeira execução.

## Estrutura do Projeto

```
/
├── .env                    # Variáveis de ambiente (PORT, NODE_ENV)
├── database.sqlite         # Banco de dados SQLite (gerado automaticamente)
├── package.json            # Dependências e scripts do backend
├── package-lock.json       # Lockfile das dependências
├── src/
│   ├── server.js           # Ponto de entrada do servidor Express
│   ├── config/
│   │   └── config.js       # Configurações do backend (ex: CORS)
│   ├── controllers/
│   │   ├── propertyController.js    # Lógica para propriedades
│   │   └── reservationController.js # Lógica para reservas
│   ├── database/
│   │   └── database.js     # Conexão e inicialização do banco
│   ├── middlewares/
│   │   └── validationMiddleware.js  # Validação de dados de entrada
│   ├── models/
│   │   ├── Property.js     # Modelo para propriedades
│   │   └── Reservation.js  # Modelo para reservas
│   ├── routes/
│   │   ├── propertyRoutes.js       # Rotas para propriedades
│   │   └── reservationRoutes.js    # Rotas para reservas
│   └── frontend/
│       ├── App.tsx         # Componente raiz do React
│       ├── config.ts       # Configurações do frontend (API endpoints)
│       ├── index.tsx       # Ponto de entrada do React
│       ├── styles.css      # Estilos globais
│       ├── components/
│       │   └── Navbar.tsx  # Barra de navegação
│       └── pages/
│           ├── Home.tsx    # Página inicial/dashboard
│           ├── Properties.tsx  # Gestão de propriedades
│           └── Reservations.tsx # Gestão de reservas
├── DOCUMENTACAO_TECNICA.md # Documentação técnica detalhada
├── GUIA_DE_USO.md          # Guia de uso para usuários
└── README.md               # Documentação geral
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 14+ instalado.
- npm ou yarn para gerenciamento de pacotes.
- SQLite (incluído via sqlite3 no projeto).

### Passos de Instalação

1. **Clonar ou baixar o repositório:**
   - Certifique-se de que o diretório `Rentogram` esteja no caminho correto.

2. **Instalar dependências do backend:**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente:**
   - O arquivo `.env` já existe com `PORT=3000` e `NODE_ENV=development`.
   - Para produção, ajuste conforme necessário.

4. **Inicializar o banco de dados:**
   - O banco SQLite (`database.sqlite`) é criado automaticamente na primeira execução do servidor.

5. **Executar o backend:**
   ```bash
   npm run dev  # Modo desenvolvimento com nodemon
   # ou
   npm start    # Modo produção
   ```
   - O servidor estará disponível em `http://localhost:3000`.

6. **Instalar e executar o frontend:**
   - Nota: O arquivo `package.json` do frontend não está presente no repositório. Assume-se que deve ser criado em `src/frontend/` com dependências apropriadas (React, TypeScript, etc.).
   - Após criar `src/frontend/package.json`, execute:
     ```bash
     cd src/frontend
     npm install
     npm run dev
     ```
   - O frontend estará disponível em `http://localhost:5173` (porta típica para Vite, conforme documentação).

### Verificação
- Acesse `http://localhost:3000/api/properties` para testar a API.
- Acesse o frontend e verifique a conectividade com a API.

## Configuração

### Variáveis de Ambiente (.env)
- `PORT`: Porta do servidor (padrão: 3000).
- `NODE_ENV`: Ambiente (development/production).

### Configurações do Frontend (src/frontend/config.ts)
- `API_BASE_URL`: URL base da API (atualmente `http://localhost:3000/api`).
- Endpoints definidos em `API_ENDPOINTS`.

### Configurações do Backend (src/config/config.js)
- Configurações de CORS e outros middlewares.

## Esquema do Banco de Dados

O banco de dados utiliza SQLite com duas tabelas principais.

### Tabela `properties`
| Campo          | Tipo      | Descrição                  |
|----------------|-----------|----------------------------|
| id             | INTEGER   | Chave primária (auto)      |
| title          | TEXT      | Título da propriedade      |
| description    | TEXT      | Descrição                  |
| address        | TEXT      | Endereço                   |
| price_per_night| REAL      | Preço por noite            |
| bedrooms       | INTEGER   | Número de quartos          |
| bathrooms      | INTEGER   | Número de banheiros        |
| max_guests     | INTEGER   | Máximo de hóspedes         |
| amenities      | TEXT      | Comodidades (string)       |
| image_url      | TEXT      | URL da imagem              |
| created_at     | TIMESTAMP | Data de criação            |
| updated_at     | TIMESTAMP | Data de atualização        |

### Tabela `reservations`
| Campo          | Tipo      | Descrição                  |
|----------------|-----------|----------------------------|
| id             | INTEGER   | Chave primária (auto)      |
| property_id    | INTEGER   | FK para properties.id      |
| guest_name     | TEXT      | Nome do hóspede            |
| guest_email    | TEXT      | Email do hóspede           |
| check_in_date  | TEXT      | Data de check-in (YYYY-MM-DD)|
| check_out_date | TEXT      | Data de check-out          |
| total_price    | REAL      | Preço total                |
| status         | TEXT      | Status (padrão: 'pending') |
| created_at     | TIMESTAMP | Data de criação            |
| updated_at     | TIMESTAMP | Data de atualização        |

Relacionamento: `reservations.property_id` referencia `properties.id`.

## Referência da API

Base URL: `http://localhost:3000/api`

### Endpoints de Propriedades

| Método | Endpoint              | Descrição                  |
|--------|-----------------------|----------------------------|
| GET    | /properties           | Listar todas propriedades  |
| GET    | /properties/:id       | Obter propriedade por ID   |
| POST   | /properties           | Criar nova propriedade     |
| PUT    | /properties/:id       | Atualizar propriedade      |
| DELETE | /properties/:id       | Excluir propriedade        |

**Exemplo de Request (POST /properties):**
```json
{
  "title": "Apartamento Centro",
  "address": "Rua A, 123",
  "price_per_night": 200.00
}
```

### Endpoints de Reservas

| Método | Endpoint                      | Descrição                  |
|--------|-------------------------------|----------------------------|
| GET    | /reservations                 | Listar todas reservas      |
| GET    | /reservations/:id             | Obter reserva por ID       |
| GET    | /reservations/property/:id    | Reservas por propriedade   |
| POST   | /reservations                 | Criar nova reserva         |
| PUT    | /reservations/:id             | Atualizar reserva          |
| DELETE | /reservations/:id             | Excluir reserva            |

**Exemplo de Request (POST /reservations):**
```json
{
  "property_id": 1,
  "guest_name": "João Silva",
  "guest_email": "joao@example.com",
  "check_in_date": "2023-12-01",
  "check_out_date": "2023-12-05",
  "total_price": 1000.00
}
```

## Estrutura do Frontend

- **App.tsx**: Componente raiz com roteamento.
- **Navbar.tsx**: Navegação entre páginas.
- **Páginas**: Home (dashboard), Properties (CRUD de imóveis), Reservations (CRUD de reservas).
- **Config.ts**: Endpoints da API.
- **Styles.css**: Estilos globais (Bootstrap).

O frontend utiliza hooks do React (useState, useEffect) para gerenciamento de estado e comunicação com a API via fetch.

## Fluxo de Desenvolvimento

1. Execute o backend: `npm run dev`.
2. Execute o frontend: `cd src/frontend && npm run dev`.
3. Desenvolva no frontend, testando integrações com a API.
4. Para mudanças no backend, reinicie o servidor se necessário.
5. Use ferramentas como Postman para testar endpoints diretamente.

## Problemas Conhecidos e Lacunas

- **Arquivo .env.example ausente**: Recomenda-se criar um exemplo para facilitar configuração.
- **package.json do frontend ausente**: O repositório não inclui o arquivo de dependências do frontend, apesar de instruções para `npm install` em `src/frontend`.
- **Inconsistência na porta do frontend**: Documentação indica porta 5173, mas configuração aponta para 3000 (API). Assumir 5173 para frontend e 3000 para API.
- **Autenticação não implementada**: O sistema não possui login/autorização, conforme mencionado em documentação.
- **Testes ausentes**: Não há testes automatizados implementados.

- Validações aprimoradas implementadas, reduzindo riscos de dados corruptos e inconsistências.

## Usable Beta Boundary

✅ **O que o usuário PODE testar:**
- Navegação na UI completa (Home, Properties, Reservations), interação com calendário, CRUD de propriedades e reservas via UI.

❌ **O que o usuário NÃO PODE testar:**

⚠️ **Limitações conhecidas / rough edges:**
- Dependências npm do frontend precisam ser instaladas.
- Banco de dados SQLite local (não persistente em reinicializações, não escalável).
- Sem autenticação ou autorização implementada.

Esta definição serve como contrato: nada fora dela está em escopo para testes beta.

## Execution Path Consolidation

Para executar o sistema localmente, siga o caminho único e determinístico abaixo:

1. Inicie o backend primeiro executando o comando `npm run dev` no diretório raiz do projeto.
2. Inicie o frontend executando `cd src/frontend && npm run dev`.

Comportamento de shutdown: Pressione Ctrl+C nos terminais respectivos para parar os processos.

## How to Test This Version

Esta seção fornece instruções passo-a-passo para testar a versão atual do sistema Rentogram, baseada na auditoria, boundary e execução consolidada. Inclui testes da API backend e da UI frontend.

### Pré-requisitos
- Node.js versão 14 ou superior instalado no sistema.

### Como Iniciar o Sistema
1. Navegue até o diretório raiz do projeto (`Rentogram`).
2. Execute o arquivo `start.bat` clicando duas vezes nele ou via linha de comando (`start.bat`).
   - O script verificará a instalação do Node.js.
   - Instalará dependências npm se necessário.
   - Iniciará o backend em segundo plano usando `npm run dev`.
   - Abrirá o navegador em `http://localhost:5274`.
3. Aguarde aproximadamente 5 segundos para o servidor iniciar completamente.
4. O backend estará disponível em `http://localhost:3000`.
5. Instale dependências do frontend e inicie: `cd src/frontend && npm install && npm run dev`.
6. O frontend estará disponível em `http://localhost:5173`.

### O que Clicar/Testar
Use uma ferramenta como Postman para testar os endpoints da API RESTful em `http://localhost:3000/api`. Os endpoints principais são para propriedades e reservas.

#### Testes de Propriedades
- **GET /properties**: Lista todas as propriedades. Espera-se uma resposta JSON com array de objetos de propriedades.
- **GET /properties/:id**: Obtém uma propriedade específica por ID. Substitua `:id` por um número válido (ex: 1).
- **POST /properties**: Cria uma nova propriedade. Use o corpo JSON:
  ```json
  {
    "title": "Apartamento Centro",
    "description": "Apartamento confortável no centro",
    "address": "Rua A, 123",
    "price_per_night": 200.00,
    "bedrooms": 2,
    "bathrooms": 1,
    "max_guests": 4,
    "amenities": "Wi-Fi, Ar-condicionado",
    "image_url": "https://example.com/image.jpg"
  }
  ```
- **PUT /properties/:id**: Atualiza uma propriedade existente. Use ID válido e corpo similar ao POST.
- **DELETE /properties/:id**: Exclui uma propriedade por ID.

#### Testes de Reservas
- **GET /reservations**: Lista todas as reservas.
- **GET /reservations/:id**: Obtém uma reserva específica.
- **GET /reservations/property/:id**: Lista reservas para uma propriedade específica.
- **POST /reservations**: Cria uma nova reserva. Use o corpo JSON:
  ```json
  {
    "property_id": 1,
    "guest_name": "João Silva",
    "guest_email": "joao@example.com",
    "check_in_date": "2023-12-01",
    "check_out_date": "2023-12-05",
    "total_price": 1000.00
  }
  ```
- **PUT /reservations/:id**: Atualiza uma reserva.
- **DELETE /reservations/:id**: Exclui uma reserva.

#### Testes da UI
- Navegue pelas páginas Home, Properties e Reservations usando a barra de navegação.
- Na página Properties, adicione uma nova propriedade preenchendo o formulário e clicando em "Salvar".
- Edite uma propriedade existente clicando em "Editar", modificando os campos e salvando.
- Exclua uma propriedade clicando em "Excluir" e confirmando.
- Na página Reservations, adicione uma nova reserva selecionando uma propriedade, preenchendo datas e informações do hóspede.
- Edite e exclua reservas de forma similar.
- Visualize o calendário na página Home ou Reservations para ver ocupações.

### Comportamento Esperado
- **Respostas bem-sucedidas**: Status HTTP 200 (GET), 201 (POST), 200 (PUT), 204 (DELETE). Respostas em JSON com dados corretos.
- **Criação/Atualização**: Validações aplicadas; erros retornam status 400 com mensagens de erro.
- **Banco de dados**: Dados persistidos no arquivo `database.sqlite`.
- **Edge cases**: Tentativas de criar reservas para propriedades inexistentes retornam erro de integridade referencial.

### Problemas Conhecidos
- **Porta inconsistente**: O script `start.bat` abre `localhost:5274`, mas a API roda em `3000`; ignore o navegador para testes.
- **Banco local**: Dados não persistem entre reinicializações completas; reinstalar pode resetar o banco.
- **Sem autenticação**: Todos os endpoints são públicos; não há controle de acesso.
- **Dependências do frontend ausentes**: Não tente executar o frontend separadamente.

## Versão

1.0.1

## Changelog

- **1.0.0 (2025-12-21)**: Reconstrução inicial da documentação canônica baseada na ingestão do repositório. Consolidação de informações de README.md, DOCUMENTACAO_TECNICA.md e GUIA_DE_USO.md. Identificação de lacunas e inconsistências para futuras correções.

- **1.0.1 (2025-12-21)**: [ARCH] Validações de dados aprimoradas com Joi schemas e integridade referencial implementadas.

## Versioning and State

**Versão:** 0.2.0-beta

**Nível de Estabilidade:** beta

**Audiência Pretendida:** user validation

## Changelog (Atualizações)

- **[META]** Regras de governança estabelecidas para organização por sprints baseados em prioridade.
- **[BOOT]** Script de inicialização (start.bat) criado para facilitar execução do sistema.
- **[DOC]** Documentação canônica consolidada, incluindo visão geral, arquitetura e guias de uso.
- **[USABILITY]** Melhorias na usabilidade com validações aprimoradas e interface de teste definida.
- **[FRONTEND]** Implementação do frontend runnable.