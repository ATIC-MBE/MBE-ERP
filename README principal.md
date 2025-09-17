# ERP Interno – MBE Madrid

ERP a medida para la gestión académica, operativa y administrativa del máster **MBE Madrid**. Este sistema centraliza todos los procesos internos del programa, sin depender de integraciones externas.

## 📁 Estructura del proyecto
```
MBE-ERP/
│
├── appfichaje/
│   ├── database-setup-fichaje.sql
│   ├── ecosystem.config.js            //Ejecuta los tres programas necesarios: frontend, backend, BBDD
│   ├── logs/
│   │
│   ├── mbeApi/                         **API DEL PROYECTO**
│   │   ├── @types/
│   │   ├── logs/                        //registro errores, accesos...
│   │   ├── public/                      //imagen, logos...
│   │   │   └── img/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── business/
│   │   │   │   ├── data/
│   │   │   │   ├── helpers/
│   │   │   │   ├── models/
│   │   │   │   ├── modelsextra/
│   │   │   │   ├── pages/
│   │   │   │   └── types/
│   │   │   ├── pages/
│   │   │   │   └── api/
│   │   │   └── styles/
│   │   ├── .env                        //acceso BBDD
│   │   ├── .dockerignore               //archivos o carpetas se excluyen al crear la imagen de Docker
│   │   ├── package.json                //Lista de dependencias, scripts(npm run dev...), metadatos del proyecto.
│   │   └── tsconfig.json               //Configuración del compilador TypeScript: paths, strict mode, target de JS, etc.
│   │   └── .gitignore                  //archivos/carpetas que Git debe ignorar
│   │   └── Dockerfile                  //Pasos para construir la imagen Docker de la app (inst. dependencias, compilar, exponer puerto...). En el servidor
│   │   └── fly.toml                    //Configuración para despliegue en Fly.io: nombre de la app, regiones, puertos, etc.
│   │   └── next.config.js              //Configuración Next.js (redirecciones, variables públicas, imágenes remotas...)
│   │   └── package-lock.json           //Versión de las dependencia
│   │   └── postcss.config.js           //Configuración de PostCSS, normalmente para procesar CSS (Tailwind, autoprefixer, etc.).


│   │
│   ├── mbeapp/                         **APP DE FICHAJE**
│   │   ├── modules/
│   │   │   ├── credentials/
│   │   │   ├── data/
│   │   │   ├── js/
│   │   │   └── services/
│   │   ├── public/
│   │   │   ├── img/
│   │   │   └── js/
│   │   ├── views/                      **Páginas del fichaje**
│   │   │   ├── layouts/
│   │   │   └── (varias .handlebars)
│   │   ├── logs/
│   │   ├── app.js
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── mbeappClient/                   **ERP**
│   │   ├── @types/
│   │   ├── logs/
│   │   ├── public/
│   │   │   └── img/
│   │   ├── src/
│   │   │   ├── client/
│   │   │   │   ├── Helpers/
│   │   │   │   │   ├── Constants       **BARRA LATERAL y BOTONES por su ROL**
│   │   │   ├── components/             **Cada carpeta se accede por su ROL**
│   │   │   │   ├── components/
│   │   │   │   │   ├── AccesoDirectoContainer.tsx   **Iconos de los botones**
│   │   │   ├── data/
│   │   │   ├── pages/
│   │   │   │   ├── atic/
│   │   │   │   │   ├── index.tsx       **Cuerpo principal y avisos de Inicio**
│   │   │   └── styles/
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── pids/
├── .gitignore
└── README principal.md
```

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
git clone https://github.com/ATIC-MBE/MBE-ERP.git
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



Desarrollado para uso interno del máster MBE Madrid – https://mbe.madrid
