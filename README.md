# Sistema de Créditos - Frontend

Aplicación web desarrollada en Angular 19 para la gestión de solicitudes de crédito en línea. Permite a los solicitantes crear solicitudes de crédito y a los analistas del banco gestionar y evaluar dichas solicitudes.

## Tecnologías Utilizadas

- **Angular 19** - Framework principal
- **Angular Material** - Componentes de UI
- **NgRx** - Gestión de estado
- **RxJS** - Programación reactiva
- **TypeScript** - Lenguaje de programación
- **SCSS** - Estilos avanzados

## Requisitos Previos

- Node.js (versión 22 o superior)
- npm (incluido con Node.js)
- Angular CLI (versión 19)

## Instalación y Puesta en Marcha

1. **Clonar el repositorio**

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crea o edita el archivo `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:5219/api", // 5219 sera el puerto por defecto que intentará levantar el back
   };
   ```

4. **Ejecutar la aplicación**

   ```bash
   npm start
   ```

   La app estará disponible en `http://localhost:4200`

## Puesta en Marcha con Docker

#### Requisitos Previos

- Docker engine o desktop
- Make (Opcional), en linux y mac debería venir por defecto en windows: con el manejador de paquetes chocolatey `choco install make`.

  1.1. **Ejecutar la aplicación con Makefile**

```bash
make dev
```

1.2 **Ejecutar la aplicación sin Makefile**

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml
```

La app estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes de la aplicación
│   │   ├── login/           # Componente de login/registro
│   │   ├── dashboard/       # Layout principal
│   │   ├── new-request/  # Formulario de nueva solicitud
│   │   ├── credit-requests-list/ # Lista de solicitudes
│   │   └── profile/         # Perfil de usuario
│   ├── models/              # Interfaces y tipos
│   ├── services/            # Servicios de API
│   ├── store/               # NgRx store
│   │   ├── actions/         # Acciones
│   │   ├── effects/         # Efectos
│   │   ├── reducers/        # Reducers
│   │   └── selectors/       # Selectores
│   ├── interceptors/        # Interceptores HTTP
│   └── app.component.ts     # Componente raíz
├── environments/            # Configuración de entornos
└── styles.scss             # Estilos globales
```

## API Endpoints Esperados

La aplicación espera que el backend proporcione los siguientes endpoints:

### Autenticación

- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

### Solicitudes de Crédito

- `GET /api/credit-requests` - Obtener solicitudes (con filtros)
- `GET /api/credit-requests/:id` - Obtener solicitud por ID
- `POST /api/credit-requests` - Crear nueva solicitud
- `PUT /api/credit-requests/:id/status` - Actualizar estado

## Flujo de Uso

### Para Solicitantes

1. Registrarse o iniciar sesión
2. Navegar a "Nueva Solicitud"
3. Completar el formulario con los datos requeridos
4. Enviar la solicitud
5. Consultar el estado en "Mis Solicitudes"

### Para Analistas

1. Iniciar sesión con credenciales de analista
2. Navegar a "Todas las Solicitudes"
3. Filtrar por estado si es necesario
4. Revisar los detalles de cada solicitud
5. Aprobar o rechazar solicitudes pendientes

## Variables de Entorno (versionadas en git)

### Desarrollo

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};
```
