# 🏢 MCH API - Management Control Hub API 🚀

![MBE Logo](/mbeappClien/public/img/ico/logo_mbe.png)

## 📋 Table of Contents
- [👋 Introduction](#introduction)
- [🔧 Setup and Configuration](#setup-and-configuration)
- [🌐 API Structure](#api-structure)
  - [📦 Articles and Inventory Management](#articles-and-inventory-management)
  - [🏠 Apartment Management](#apartment-management)
  - [👥 Users and Authentication](#users-and-authentication)
  - [📊 Statistics and Reports](#statistics-and-reports)
  - [⏰ Time Control and Check-ins](#time-control-and-check-ins)
- [💻 Project Architecture](#project-architecture)
- [🔄 Data Flow](#data-flow)
- [📱 Devices and Reports](#devices-and-reports)
- [📚 Usage Examples](#usage-examples)
- [🚀 Deployment](#deployment)

## 👋 Introduction

MCH API is a comprehensive system developed with Next.js for real estate management and apartment control. The application provides a robust API to handle articles, inventories, apartments, users, statistics, and more.

## 🔧 Setup and Configuration

### Prerequisites
- Node.js 14.x or higher
- PostgreSQL database (with UNACCENT extension enabled)
- npm or yarn

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
yarn install

# Configure environment variables
# Create a .env file based on .env.example

# Start development server
npm run dev
# or
yarn dev
```

## 🌐 API Structure

The system is organized into main modules with RESTful endpoints:

### 📦 Articles and Inventory Management

**Base Endpoints: `/api/share/articulos`**

- `GET /api/share/articulos` - Paginated list of articles
- `POST /api/share/articulos` - Create new article (includes inventory registration)
- `PUT /api/share/articulos/:id` - Update existing article
- `DELETE /api/share/articulos/:id` - Delete article (logical deactivation)

**Inventory Endpoints: `/api/share/inventario`**

- `GET /api/share/inventario` - Query inventory
- `POST /api/share/inventario` - Register new inventory
- `PUT /api/share/inventario/:id` - Update inventory

### 🏠 Apartment Management

**Base Endpoints: `/api/share/apartments`**

- `GET /api/share/apartments` - List apartments
- `GET /api/share/apartments/:id` - Specific apartment details
- `POST /api/share/apartments` - Create new apartment
- `PUT /api/share/apartments/:id` - Update apartment
- `DELETE /api/share/apartments/:id` - Delete apartment

**Apartment Logs: `/api/share/logsapartment`**

- `GET /api/share/logsapartment/:id_apartment` - Change history

### 👥 Users and Authentication

**Authentication: `/api/share/auth`**

- `POST /api/share/auth/login` - Login
- `POST /api/share/auth/logout` - Logout
- `GET /api/share/auth/verify` - Verify session token

**User Management: `/api/share/users`**

- `GET /api/share/users` - List users
- `POST /api/share/users` - Create new user
- `PUT /api/share/users/:id` - Update user
- `DELETE /api/share/users/:id` - Deactivate user

**Roles: `/api/share/roles`**

- `GET /api/share/roles` - List roles
- `GET /api/share/userroles/:id_user` - Get user roles

### 📊 Statistics and Reports

**Statistics: `/api/share/estadisticas`**

- `GET /api/share/estadisticas/dn` - DN statistics data
- `GET /api/share/estadisticas/comercial` - Commercial statistics

**Device Reports: `/api/share/reportdevices`**

- `GET /api/share/reportdevices/lastreport` - Latest device report
- `GET /api/share/reportdevices/:id` - Specific report details

### ⏰ Time Control and Check-ins

**Time Control: `/api/share/controlfichaje`**

- `GET /api/share/controlfichaje` - Query records
- `POST /api/share/controlfichaje` - Register check-in/check-out
- `GET /api/share/controlfichaje/limpieza` - Cleaning time control

**Vacations: `/api/share/vacaciones`**

- `GET /api/share/vacaciones` - Query vacations
- `POST /api/share/vacaciones` - Request vacation
- `PUT /api/share/vacaciones/:id` - Update request

## 💻 Project Architecture

The project follows a layered architecture:

```
📁 src/
  📁 api/
    📁 business/ - Business logic
    📁 data/ - Data access (PostgreSQL)
    📁 helpers/ - Utilities and helper functions
    📁 models/ - Data model interfaces
    📁 modelsextra/ - Complementary models
    📁 types/ - Global type definitions
  📁 pages/
    📁 api/ - REST API endpoints
    📁 ... - Frontend pages (if any)
```

### 🔍 Data Flow

1. **HTTP Request** → Endpoint in `pages/api/`
2. **Controller/Handler** → Processes the request
3. **Business Layer** → Applies business rules
4. **Data Access Layer** → Interacts with database
5. **Response** → Returns data or error

## 📱 Devices and Reports

The system includes functionality to manage devices and their reports:

- Device registration
- Periodic reports
- Activity history
- Alerts and notifications

## 📚 Usage Examples

### Creating an Article

```javascript
// POST /api/share/articulos
const newArticle = {
  tag: "CHAIR-001",
  mobiliario: "Ergonomic office chair",
  descripcion: "Office chair with lumbar support",
  precio: 150.00,
  fecha_compra: "2025-03-01T00:00:00.000Z",
  meses_antiguedad: 12,
  depreciacion: 10,
  valor_depreciacion: 135.00,
  propietario: "MCH Furniture",
  notas: "Located in main office",
  url_imagen: "https://example.com/chair.jpg",
  stock: 5,
  total: 750.00,
  estado: 1
};

// The API will automatically create an inventory record
```

### Querying Apartments

```javascript
// GET /api/share/apartments?filter[limit]=10&filter[offset]=0&filter[search_all]=beach
// Returns apartments with "beach" in their description, name, or address
```

## 🚀 Deployment

The project is configured for deployment in different environments:

### ☁️ Vercel (Recommended)

The easiest way to deploy the application:

```bash
vercel
```

### 🐳 Docker

The project includes a Dockerfile for containerization:

```bash
# Build image
docker build -t mch-api .

# Run container
docker run -p 3000:3000 mch-api
```

### 🪂 Fly.io

The project includes configuration for Fly.io (`fly.toml`):

```bash
fly deploy
```

---

## 🛠️ Main Technologies

- **Next.js** - React Framework
- **TypeScript** - Static typing
- **PostgreSQL** - Database
- **Docker** - Containerization

---

💡 For more information, contact the development team.
