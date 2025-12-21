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
/src
├── config/            # Configurações da aplicação
├── controllers/       # Controladores da API
├── database/          # Configuração do banco de dados
├── middlewares/       # Middlewares
├── models/            # Modelos de dados
├── routes/            # Rotas da API
└── server.js          # Servidor principal
```

### Modelos de Dados

#### Property Model

```javascript
class Property {
  static create(propertyData, callback)
  static getAll(callback)
  static getById(id, callback)
  static update(id, propertyData, callback)
  static delete(id, callback)
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
  static create(reservationData, callback)
  static getAll(callback)
  static getById(id, callback)
  static getByPropertyId(property_id, callback)
  static update(id, reservationData, callback)
  static delete(id, callback)
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
  static createProperty(req, res)
  static getAllProperties(req, res)
  static getPropertyById(req, res)
  static updateProperty(req, res)
  static deleteProperty(req, res)
}
```

**Responsabilidades:**
- Receber requisições HTTP
- Validar dados de entrada
- Chamar métodos do modelo
- Enviar respostas HTTP

#### ReservationController

```javascript
class ReservationController {
  static createReservation(req, res)
  static getAllReservations(req, res)
  static getReservationById(req, res)
  static getReservationsByPropertyId(req, res)
  static updateReservation(req, res)
  static deleteReservation(req, res)
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
function validatePropertyData(req, res, next) {
  // Validação dos dados da propriedade
  // Verifica campos obrigatórios
  // Valida formatos de dados
  // Chama next() se válido ou envia erro
}

function validateReservationData(req, res, next) {
  // Validação dos dados da reserva
  // Verifica campos obrigatórios
  // Valida formatos de dados (email, datas)
  // Chama next() se válido ou envia erro
}
```

## Arquitetura do Frontend

### Estrutura de Componentes

```
/src/frontend
├── components/     # Componentes reutilizáveis
│   └── Navbar.tsx  # Barra de navegação
├── pages/          # Páginas da aplicação
│   ├── Home.tsx     # Dashboard
│   ├── Properties.tsx # Gestão de propriedades
│   └── Reservations.tsx # Gestão de reservas
├── config.ts       # Configurações
├── App.tsx         # Componente principal
└── index.tsx       # Ponto de entrada
```

### Gerenciamento de Estado

O frontend utiliza React hooks para gerenciamento de estado:

```typescript
const [properties, setProperties] = useState<Property[]>([])
const [reservations, setReservations] = useState<Reservation[]>([])
const [loading, setLoading] = useState<boolean>(true)
const [error, setError] = useState<string | null>(null)
```

### Comunicação com a API

O frontend se comunica com o backend usando a API REST:

```typescript
// Exemplo de requisição para obter propriedades
const response = await fetch('http://localhost:3000/api/properties')
const propertiesData = await response.json()

// Exemplo de requisição para criar reserva
const response = await fetch('http://localhost:3000/api/reservations', {
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
       │                   │                   │ create()          │
       │                   ├──────────────────>│                   │
       │                   │                   │ INSERT INTO properties
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ <──────────────────┤
       │                   │                   │                   │
       │                   │                   │ callback(null, property)
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │                   │ res.status(201).json(property)
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
       │                   │                   │ create()          │
       │                   ├──────────────────>│                   │
       │                   │                   │ INSERT INTO reservations
       │                   │                   ├──────────────────>│
       │                   │                   │                   │
       │                   │                   │ <──────────────────┤
       │                   │                   │                   │
       │                   │                   │ callback(null, reservation)
       │                   │<──────────────────┤                   │
       │                   │                   │                   │
       │                   │ res.status(201).json(reservation)
       │<──────────────────┤                   │                   │
       │                   │                   │                   │
```

## Segurança

### Medidas de Segurança Atuais

1. **Validação de Dados:**
   - Middlewares de validação para todos os endpoints
   - Verificação de campos obrigatórios
   - Validação de formatos (email, datas, números)

2. **CORS:**
   - Configurado para permitir apenas origens específicas
   - Previne requisições de domínios não autorizados

3. **Tratamento de Erros:**
   - Respostas padronizadas para erros
   - Não expõe detalhes internos do servidor

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

- Não há testes automatizados implementados

### Testes Recomendados

1. **Backend:**
   - Testes unitários para modelos e controladores
   - Testes de integração para endpoints da API
   - Testes de validação para middlewares

2. **Frontend:**
   - Testes unitários para componentes
   - Testes de integração para fluxos de usuário
   - Testes E2E para cenários completos

3. **Banco de Dados:**
   - Testes para validação de esquema
   - Testes para integridade referencial

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