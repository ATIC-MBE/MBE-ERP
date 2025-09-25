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
│   │   ├── @types/                      //definiciones de tipos TypeScript personalizadas
│   │   ├── logs/                        //registro errores, accesos...
│   │   ├── public/                      //imagen, logos...
│   │   │   └── img/
│   │   ├── src/
│   │   │   ├── api/                    //Carpeta donde se definen las rutas de API (endpoints) de la aplicación.
│   │   │   │   ├── business/           //Clases o servicios que aplican reglas propias del dominio de la app (validaciones, cálculos, flujos).
│   │   │   │   ├── data/               //Funciones o clases que se conectan a la base de datos: consultas SQL, ORMs (Prisma, TypeORM, etc.).
│   │   │   │   ├── helpers/            //Funciones pequeñas y reutilizables (formatear fechas, generar tokens, validar correos, etc.).
│   │   │   │   ├── models/             //Interfaces o clases TypeScript que describen las entidades de la base de datos (por ejemplo IUser, IContact, etc.).
│   │   │   │   ├── modelsextra/        //
│   │   │   │   ├── pages/              //Archivos .ts que exportan funciones (req/res) para manejar rutas como /api/usuarios...
│   │   │   │   └── types/              //Archivos *.d.ts o .ts con definiciones de tipos que se usan en varias capas,
│   │   │   ├── pages/                  //páginas del frontend
│   │   │   │   └── api/
│   │   │   └── styles/
│   │   │   └── db.ts                   //Archivo TypeScript que centraliza la conexión a la base de datos.
│   │   │
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
│   │
│   │
│   │
│   ├── mbeapp/                         **APP DE FICHAJE**
│   │   ├── modules/                    //funciones, controladores, servicios, etc.
│   │   │   ├── credentials/            //Credenciales o llaves que el proyecto necesita: certificados, archivos JSON con claves de servicio, tokens...
│   │   │   ├── data/                   //datos de la aplicación: por ejemplo, archivos JSON, CSV, BD en formato local
│   │   │   ├── js/                     //código JavaScript del lado del cliente
│   │   │   └── services/               //Módulos de lógica de servicios que se encargan de tareas: Centraliza configuración de la API, keys, autenticación
│   │   ├── public/                     //Archivos estáticos que se sirven tal cual al navegador: imágenes, CSS, JS del lado cliente, fuentes...
│   │   │   ├── img/                    //
│   │   │   └── js/                     //
│   │   ├── views/                      **Páginas del fichaje**
│   │   │   ├── layouts/                //
│   │   │   └── (varias .handlebars)    //
│   │   ├── logs/                       //registro errores, accesos...
│   │   ├── app.js                      //Punto de entrada principal de la aplicación (configuración del servidor, rutas, middlewares).
│   │   ├── app_backup.js               //Copia de seguridad del app.js
│   │   ├── package-lock.json           //Versión de las dependencia
│   │   ├── package.json                //Lista de dependencias, scripts(npm run dev...), metadatos del proyecto.
│   │   ├── .env                        //define puertos y URLs de servicios externos (TCP y API REST) para distintos entornos (desarrollo/producción).
│   │   ├── .dockerignore               //archivos o carpetas se excluyen al crear la imagen de Docker
│   │   └── .gitignore                  //archivos/carpetas que Git debe ignorar
│   │
│   │
│   │
│   │
│   ├── mbeappClient/                   **ERP**
│   │   ├── @types/
│   │   ├── logs/
│   │   ├── public/
│   │   │   └── img/                    **Iconos y logos**
│   │   ├── src/
│   │   │   ├── client/
│   │   │   │   ├── Helpers/
│   │   │   │   │   ├── Constants       **BARRA LATERAL y BOTONES por su ROL**
│   │   │   ├── components/             **Cada carpeta se accede por su ROL**
│   │   │   │   ├── AccesoDirectoContainer.tsx   **Iconos de los botones**
│   │   │   │   ├── Layout.tsx                   **Iconos de la barra lateral**
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
