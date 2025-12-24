# Documentação Técnica do Rentogram

Esta documentação técnica fornece uma visão detalhada da arquitetura, funcionalidades e implementação do sistema Rentogram.

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Arquitetura do Backend](#arquitetura-do-backend)
   - [Estrutura de Diretórios](#estrutura-de-diretórios)
   - [Modelos de Dados](#modelos-de-dados)
   - [Controladores](#controladores)
   - [Rotas](#rotas)
   - [Middlewares](#middlewares)
3. [Arquitetura do Frontend](#arquitetura-do-frontend)
   - [Estrutura de Componentes](#estrutura-de-componentes)
   - [Gerenciamento de Estado](#gerenciamento-de-estado)
   - [Comunicação com a API](#comunicação-com-a-api)
4. [Banco de Dados](#banco-de-dados)
   - [Esquema do Banco de Dados](#esquema-do-banco-de-dados)
   - [Relacionamentos](#relacionamentos)
5. [API Detalhada](#api-detalhada)
   - [Endpoints de Propriedades](#endpoints-de-propriedades)
   - [Endpoints de Reservas](#endpoints-de-reservas)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Segurança](#segurança)
8. [Desempenho](#desempenho)
9. [Testes](#testes)
10. [Implantação](#implantação)
11. [Próximas Melhorias](#próximas-melhorias)

## Visão Geral da Arquitetura

O sistema Rentogram segue uma arquitetura cliente-servidor com separação clara entre frontend e backend:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            Rentogram System Architecture                        │
├─────────────────────────────┬─────────────────────────────┬───────────────────┤
│         Frontend            │          Backend            │    Database        │
│  (React/TypeScript)         │  (Node.js/Express)         │  (SQLite)         │
├─────────────────────────────┼─────────────────────────────┼───────────────────┤
│ - Components                │ - Controllers               │ - Properties      │
│ - Pages                     │ - Models                    │ - Reservations    │
│ - Config                    │ - Routes                    │                   │
│ - Styles                    │ - Middlewares               │                   │
│ - State Management          │ - Database Connection       │                   │
└─────────────────────────────┴─────────────────────────────┴───────────────────┘
```

## Arquitetura do Backend

### Estrutura de Diretórios

```
src/
├── config/            # Configurações da aplicação
│   ├── config.js      # Configurações gerais (CORS, etc.)
│   └── logger.js      # Configuração de logging com Winston
├── controllers/       # Controladores da API
├── database/          # Configuração do banco de dados
├── errors/            # Classes de erro customizadas
│   ├── AppError.js
│   ├── DatabaseError.js
│   ├── NotFoundError.js
│   └── ValidationError.js
├── middlewares/       # Middlewares
│   ├── errorMiddleware.js  # Tratamento global de erros
│   └── validationMiddleware.js  # Validação de dados com Joi
├── models/            # Modelos de dados
├── routes/            # Rotas da API
├── validators/        # Schemas de validação Joi
│   └── schemas.js
└── server.js          # Servidor principal
```

### Modelos de Dados

#### Property Model

```javascript
class Property {
  // Métodos síncronos com callbacks
  static create(propertyData, callback)
  static getAll(callback, page = 1, limit = null)
  static getById(id, callback)
  static getByIdWithReservations(id, callback)
  static update(id, propertyData, callback)
  static delete(id, callback)

  // Métodos assíncronos com Promises
  static createAsync(propertyData)
  static getAllAsync()
  static getByIdAsync(id)
  static updateAsync(id, propertyData)
  static deleteAsync(id)
}
```

**Campos:**
- `id`: INTEGER (PRIMARY KEY)
- `title`: TEXT (NOT NULL)
- `description`: TEXT
- `address`: TEXT (NOT NULL)
- `price_per_night`: REAL (NOT NULL)
- `bedrooms`: INTEGER
- `bathrooms`: INTEGER
- `max_guests`: INTEGER
- `amenities`: TEXT
- `image_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

#### Reservation Model

```javascript
class Reservation {
  // Métodos síncronos com callbacks
  static create(reservationData, callback)
  static getAll(callback)
  static getById(id, callback)
  static getByPropertyId(property_id, callback)
  static update(id, reservationData, callback)
  static delete(id, callback)

  // Métodos assíncronos com Promises
  static createAsync(reservationData)
  static getAllAsync()
  static getByIdAsync(id)
  static getByPropertyIdAsync(property_id)
  static updateAsync(id, reservationData)
  static deleteAsync(id)
}
```

**Campos:**
- `id`: INTEGER (PRIMARY KEY)
- `property_id`: INTEGER (NOT NULL, FOREIGN KEY)
- `guest_name`: TEXT (NOT NULL)
- `guest_email`: TEXT (NOT NULL)
- `check_in_date`: TEXT (NOT NULL)
- `check_out_date`: TEXT (NOT NULL)
- `total_price`: REAL (NOT NULL)
- `status`: TEXT (DEFAULT 'pending')
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Controladores

#### PropertyController

```javascript
class PropertyController {
  static async createProperty(req, res, next)
  static async getAllProperties(req, res, next)
  static async getPropertyById(req, res, next)
  static async updateProperty(req, res, next)
  static async deleteProperty(req, res, next)
}
```

**Responsabilidades:**
- Receber requisições HTTP
- Validar dados de entrada via middlewares
- Chamar métodos assíncronos do modelo
- Enviar respostas HTTP ou passar erros para o middleware global

#### ReservationController

```javascript
class ReservationController {
  static async createReservation(req, res, next)
  static async getAllReservations(req, res, next)
  static async getReservationById(req, res, next)
  static async getReservationsByPropertyId(req, res, next)
  static async updateReservation(req, res, next)
  static async deleteReservation(req, res, next)
}
```

### Rotas

#### Property Routes

```javascript
router.post('/', validatePropertyData, PropertyController.createProperty)
router.get('/', PropertyController.getAllProperties)
router.get('/:id', PropertyController.getPropertyById)
router.put('/:id', validatePropertyData, PropertyController.updateProperty)
router.delete('/:id', PropertyController.deleteProperty)
```

#### Reservation Routes

```javascript
router.post('/', validateReservationData, ReservationController.createReservation)
router.get('/', ReservationController.getAllReservations)
router.get('/:id', ReservationController.getReservationById)
router.get('/property/:property_id', ReservationController.getReservationsByPropertyId)
router.put('/:id', validateReservationData, ReservationController.updateReservation)
router.delete('/:id', ReservationController.deleteReservation)
```

### Middlewares

#### ValidationMiddleware

```javascript
async function validatePropertyData(req, res, next) {
  const { error } = propertySchema.validate(req.body);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }
  next();
}

async function validateReservationData(req, res, next) {
  const { error } = reservationSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  // Validação de integridade referencial
  const { property_id } = req.body;
  const property = await Property.getByIdAsync(property_id);
  if (!property) {
    throw new ValidationError('Propriedade inválida: propriedade não existe');
  }
  next();
}
```

**Validações implementadas:**
- Uso de Joi para schemas de validação
- Campos obrigatórios e formatos (email, datas, números)
- Validação de integridade referencial para reservas

#### ErrorMiddleware

```javascript
const errorHandler = (err, req, res, next) => {
  // Log do erro com Winston
  logger.error(err.message, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Tratamento específico de erros
  // Resposta padronizada
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

**Tratamento de erros:**
- Logging estruturado com Winston
- Tratamento de erros específicos (Joi, SQLite, etc.)
- Respostas padronizadas com códigos HTTP apropriados

## Arquitetura do Frontend

### Estrutura de Componentes

```
src/frontend
├── components/     # Componentes reutilizáveis
│   └── Navbar.tsx  # Barra de navegação
├── pages/          # Páginas da aplicação
│   ├── Home.tsx     # Dashboard
│   ├── Properties.tsx # Gestão de propriedades
│   └── Reservations.tsx # Gestão de reservas
├── config.ts       # Configurações da API
├── theme.ts        # Definições de tema (light/dark)
├── ThemeContext.tsx # Contexto para gerenciamento de tema
├── App.tsx         # Componente principal com roteamento
├── index.tsx       # Ponto de entrada
├── index.html      # Template HTML
├── styles.css      # Estilos globais
└── package.json    # Dependências do frontend
```

### Gerenciamento de Estado

O frontend utiliza React hooks para gerenciamento de estado local e Context API para estado global:

```typescript
// Estado local em componentes
const [properties, setProperties] = useState<Property[]>([])
const [reservations, setReservations] = useState<Reservation[]>([])
const [loading, setLoading] = useState<boolean>(true)
const [error, setError] = useState<string | null>(null)

// Contexto para tema (light/dark mode)
const { isDarkMode, toggleTheme } = useTheme()
```

### Comunicação com a API

O frontend se comunica com o backend usando a API REST, com endpoints centralizados em `config.ts`:

```typescript
import { API_ENDPOINTS } from './config'

// Exemplo de requisição para obter propriedades
const response = await fetch(API_ENDPOINTS.PROPERTIES)
const propertiesData = await response.json()

// Exemplo de requisição para criar reserva
const response = await fetch(API_ENDPOINTS.RESERVATIONS, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reservationData)
})
```

## Banco de Dados

### Esquema do Banco de Dados

```sql
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,
  amenities TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  check_in_date TEXT NOT NULL,
  check_out_date TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
)
```

### Relacionamentos

```
Properties (1) ┬─┬ Reservations (N)
               │
               └─ property_id (FOREIGN KEY)
```

## API Detalhada

### Endpoints de Propriedades

#### POST /api/properties

**Descrição:** Cria uma nova propriedade

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "address": "string",
  "price_per_night": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "max_guests": "number",
  "amenities": "string",
  "image_url": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "address": "string",
  "price_per_night": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "max_guests": "number",
  "amenities": "string",
  "image_url": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### GET /api/properties

**Descrição:** Lista todas as propriedades

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "address": "string",
    "price_per_night": "number",
    "bedrooms": "number",
    "bathrooms": "number",
    "max_guests": "number",
    "amenities": "string",
    "image_url": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

#### GET /api/properties/:id

**Descrição:** Obtém uma propriedade por ID

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "address": "string",
  "price_per_night": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "max_guests": "number",
  "amenities": "string",
  "image_url": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### PUT /api/properties/:id

**Descrição:** Atualiza uma propriedade

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "address": "string",
  "price_per_night": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "max_guests": "number",
  "amenities": "string",
  "image_url": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "address": "string",
  "price_per_night": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "max_guests": "number",
  "amenities": "string",
  "image_url": "string",
  "updated_at": "string"
}
```

#### DELETE /api/properties/:id

**Descrição:** Exclui uma propriedade

**Response:**
```json
{
  "message": "Property deleted successfully",
  "affectedRows": "number"
}
```

### Endpoints de Reservas

#### POST /api/reservations

**Descrição:** Cria uma nova reserva

**Request Body:**
```json
{
  "property_id": "number",
  "guest_name": "string",
  "guest_email": "string",
  "check_in_date": "string (YYYY-MM-DD)",
  "check_out_date": "string (YYYY-MM-DD)",
  "total_price": "number",
  "status": "string (optional, default: 'pending')"
}
```

**Response:**
```json
{
  "id": "number",
  "property_id": "number",
  "guest_name": "string",
  "guest_email": "string",
  "check_in_date": "string",
  "check_out_date": "string",
  "total_price": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### GET /api/reservations

**Descrição:** Lista todas as reservas

**Response:**
```json
[
  {
    "id": "number",
    "property_id": "number",
    "guest_name": "string",
    "guest_email": "string",
    "check_in_date": "string",
    "check_out_date": "string",
    "total_price": "number",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

#### GET /api/reservations/:id

**Descrição:** Obtém uma reserva por ID

**Response:**
```json
{
  "id": "number",
  "property_id": "number",
  "guest_name": "string",
  "guest_email": "string",
  "check_in_date": "string",
  "check_out_date": "string",
  "total_price": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

#### GET /api/reservations/property/:property_id

**Descrição:** Obtém reservas por propriedade

**Response:**
```json
[
  {
    "id": "number",
    "property_id": "number",
    "guest_name": "string",
    "guest_email": "string",
    "check_in_date": "string",
    "check_out_date": "string",
    "total_price": "number",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
]
```

#### PUT /api/reservations/:id

**Descrição:** Atualiza uma reserva

**Request Body:**
```json
{
  "property_id": "number",
  "guest_name": "string",
  "guest_email": "string",
  "check_in_date": "string (YYYY-MM-DD)",
  "check_out_date": "string (YYYY-MM-DD)",
  "total_price": "number",
  "status": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "property_id": "number",
  "guest_name": "string",
  "guest_email": "string",
  "check_in_date": "string",
  "check_out_date": "string",
  "total_price": "number",
  "status": "string",
  "updated_at": "string"
}
```

#### DELETE /api/reservations/:id

**Descrição:** Exclui uma reserva

**Response:**
```json
{
  "message": "Reservation deleted successfully",
  "affectedRows": "number"
}
```

## Fluxo de Dados

### Fluxo de Criação de Propriedade

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   Model     │    │  Database   │
│  (React)    │    │ (Controller)│    │  (Property) │    │  (SQLite)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ POST /properties  │                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ validatePropertyData()           │
       │                   ├──────────────────>│                   │
       │                   │ await Property.createAsync()     │
       │                   ├──────────────────>│                   │
       │                   │                   │ INSERT INTO properties
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ <──────────────────┤
       │                   │                   │                   │
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │ res.status(201).json(property)
       │<──────────────────┤                   │                   │
       │                   │                   │                   │
```

### Fluxo de Criação de Reserva

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   Model     │    │  Database   │
│  (React)    │    │ (Controller)│    │ (Reservation)│    │  (SQLite)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ POST /reservations│                   │                   │
       ├──────────────────>│                   │                   │
       │                   │ validateReservationData()       │
       │                   ├──────────────────>│                   │
       │                   │ await Reservation.createAsync() │
       │                   ├──────────────────>│                   │
       │                   │                   │ INSERT INTO reservations
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ <──────────────────┤
       │                   │                   │                   │
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │ res.status(201).json(reservation)
       │<──────────────────┤                   │                   │
       │                   │                   │                   │
```

## Tratamento de Erros

### Classes de Erro Customizadas

O sistema implementa classes de erro customizadas para melhor tratamento e padronização:

- **AppError**: Classe base para erros da aplicação
- **DatabaseError**: Erros relacionados ao banco de dados
- **NotFoundError**: Recurso não encontrado (404)
- **ValidationError**: Dados inválidos (400)

### Middleware de Tratamento de Erros

```javascript
const errorHandler = (err, req, res, next) => {
  // Log estruturado com Winston
  logger.error(err.message, { stack: err.stack, url: req.url });

  // Tratamento específico por tipo de erro
  // Respostas padronizadas com códigos HTTP apropriados
};
```

**Características:**
- Logging estruturado com Winston
- Tratamento de erros específicos (Joi, SQLite, etc.)
- Respostas padronizadas sem exposição de detalhes internos
- Stack trace em desenvolvimento

## Segurança

### Medidas de Segurança Atuais

1. **Validação de Dados:**
    - Schemas Joi para validação rigorosa
    - Validação de integridade referencial
    - Verificação de campos obrigatórios e formatos

2. **CORS:**
    - Configurado para permitir apenas origens específicas
    - Previne requisições de domínios não autorizados

3. **Tratamento de Erros:**
    - Respostas padronizadas para erros
    - Não expõe detalhes internos do servidor
    - Logging seguro de erros

### Melhorias de Segurança Recomendadas

1. **Autenticação:**
   - Implementar JWT ou OAuth2
   - Adicionar middleware de autenticação

2. **Autorização:**
   - Controle de acesso baseado em funções (RBAC)
   - Permissões granulares para diferentes tipos de usuários

3. **Proteção de Dados:**
   - Criptografia de dados sensíveis
   - Hash de senhas (quando implementado)

4. **Segurança da API:**
   - Rate limiting para prevenir ataques DDoS
   - Proteção contra CSRF
   - Headers de segurança (CSP, XSS Protection)

## Desempenho

### Otimizações Atuais

1. **Backend:**
   - Uso de callbacks para operações assíncronas
   - Conexão persistente com o banco de dados

2. **Frontend:**
   - React com hooks para gerenciamento eficiente de estado
   - Componentes reutilizáveis

### Melhorias de Desempenho Recomendadas

1. **Backend:**
   - Implementar caching para consultas frequentes
   - Usar connection pooling para o banco de dados
   - Otimizar consultas SQL

2. **Frontend:**
   - Implementar lazy loading para componentes
   - Usar memoization para evitar renderizações desnecessárias
   - Otimizar imagens e assets

3. **Banco de Dados:**
   - Adicionar índices para colunas frequentemente consultadas
   - Implementar paginação para listas grandes

## Testes

### Testes Atuais

O sistema implementa testes automatizados usando Jest como framework de testes, com Supertest para testes de integração da API. A configuração inclui:

- **Cobertura de código:** Thresholds definidos em 80% para branches, funções, linhas e statements
- **Estrutura de testes:** Localizada em `tests/` com subdiretórios para controladores, middlewares e modelos
- **Setup:** Arquivo `tests/setup.js` para configuração inicial
- **Comandos disponíveis:**
  - `npm test`: Executa todos os testes
  - `npm run test:coverage`: Executa testes com relatório de cobertura

#### Testes Implementados

1. **Backend:**
     - Testes unitários para controladores (propertyController, reservationController)
     - Testes para middlewares de validação com Joi
     - Testes para modelos de dados
     - Testes de integração para rotas

2. **Frontend:**
     - Testes ainda não implementados (recomendado para futuras iterações)

3. **Banco de Dados:**
     - Validação de esquema através de testes de modelos
     - Testes de integridade referencial

### Melhorias de Testes Recomendadas

1. **Frontend:**
    - Testes unitários para componentes React
    - Testes de integração para rotas e interações
    - Testes E2E com ferramentas como Cypress

2. **Integração:**
    - Testes de ponta a ponta cobrindo fluxos completos
    - Testes de performance e carga

## Implantação

### Requisitos para Implantação

1. **Servidor:**
   - Node.js 14+
   - SQLite
   - npm ou yarn

2. **Ambiente:**
   - Variáveis de ambiente configuradas
   - Permissões adequadas para escrita no banco de dados

### Processo de Implantação

1. **Backend:**
   ```bash
   npm install --production
   npm start
   ```

2. **Frontend:**
   ```bash
   npm run build
   # Servir os arquivos estáticos com um servidor web (Nginx, Apache, etc.)
   ```

### Configuração de Produção

1. **Variáveis de Ambiente:**
   ```env
   PORT=8080
   NODE_ENV=production
   DATABASE_PATH=/var/data/database.sqlite
   ```

2. **Segurança:**
   - Configurar HTTPS
   - Restringir acesso ao servidor
   - Configurar firewalls

## Próximas Melhorias

1. **Funcionalidades:**
   - Implementar autenticação e autorização
   - Adicionar sistema de pagamentos
   - Implementar notificações por email
   - Adicionar funcionalidade de busca e filtros

2. **Técnicas:**
   - Implementar testes automatizados
   - Adicionar logging e monitoramento
   - Implementar caching
   - Adicionar documentação Swagger/OpenAPI

3. **UI/UX:**
   - Melhorar a interface do usuário
   - Adicionar responsividade para dispositivos móveis
   - Implementar dark mode

## Conclusão

Esta documentação técnica fornece uma visão abrangente da arquitetura e implementação do sistema Rentogram. Para mais detalhes sobre o uso do sistema, consulte o [Guia de Uso](GUIA_DE_USO.md).