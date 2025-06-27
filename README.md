# ERP Interno – MBE Madrid

ERP a medida para la gestión académica, operativa y administrativa del máster **MBE Madrid**. Este sistema centraliza todos los procesos internos del programa, sin depender de integraciones externas.

## 🧱 Tecnologías utilizadas

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT + RBAC
- Zod para validación
- Jest + Supertest (testing)

### Frontend
- React + Vite
- Tailwind CSS + shadcn/ui
- Zustand (estado global)
- React Router DOM

## 🔐 Seguridad
- Autenticación con JWT
- Control de acceso por roles
- Validación de datos robusta

## 🧩 Módulos principales
- Gestión de usuarios con roles diferenciados
- Evaluación y seguimiento de candidaturas
- Proyectos personales: mentorías, entregas, feedback
- Gestión documental interna
- Comunicación interna (avisos, tareas, notificaciones)
- Panel de administración y seguimiento académico

## ⚙️ Instalación

### 1. Clona el repositorio
```bash
git clone https://github.com/tu_usuario/erp-mbe-madrid.git
```

### 2. Backend
```bash
cd apps/backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 📁 Estructura del proyecto
```
mbe-erp/
├── apps/
│   ├── frontend/
│   └── backend/
├── packages/
│   ├── ui/
│   ├── config/
│   └── types/
├── prisma/
├── docker/
├── .env
├── README.md
└── package.json
```

Desarrollado para uso interno del máster MBE Madrid – https://mbe.madrid