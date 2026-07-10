# FINOVA 
## Descripción
FINOVA es una aplicación web SPA desarrollada en Angular para la gestión de finanzas personales.
La plataforma permite visualizar ingresos, gastos, presupuestos, metas de ahorro y cuentas bancarias en una sola interfaz moderna, intuitiva y responsive.
## Idea del proyecto
El proyecto nace con el objetivo de ofrecer una solución moderna para el control financiero personal, permitiendo a los usuarios visualizar y organizar su información económica de manera sencilla y eficiente.
## Problema que resuelve
Muchas personas no cuentan con herramientas simples y visuales para administrar correctamente sus finanzas personales.
FINOVA ayuda a:
- Organizar ingresos y gastos.
- Visualizar presupuestos.
- Llevar control de metas de ahorro.
- Analizar movimientos financieros mediante gráficos.
## Público objetivo
- Estudiantes
- Trabajadores
- Personas interesadas en controlar mejor sus finanzas
- Usuarios que buscan herramientas financieras modernas y simples
## Framework seleccionado
- Angular
## Tecnologías utilizadas
### Frontend (Cliente)
- Angular
- TailwindCSS
- TypeScript
- Chart.js
- HTML5

### Backend (Servidor)
- Java Spring Boot 3
- Spring Data JPA
- Hibernate
- Maven

### Base de Datos
- PostgreSQL (Migrado desde MySQL)
- PGAdmin 4

## Características principales
- **NUEVO:** Sistema completo de Autenticación (Login y Registro) conectado a base de datos.
- Dashboard financiero interactivo
- Registro de movimientos
- Gestión de presupuestos
- Metas de ahorro
- Visualización de gráficos financieros
- Simulación de conexión bancaria
- Navegación SPA
- Diseño responsive

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/Marlon-007D/ProyectoFinova
cd FINOVA
```

### 2. Configurar Base de Datos (PostgreSQL)
1. Abrir pgAdmin y crear una base de datos llamada `finova_db`.
2. Modificar el archivo `backend/src/main/resources/application.properties` con tu contraseña local de Postgres:
```ini
spring.datasource.password=TU_CONTRASEÑA
```

### 3. Ejecutar el Backend (Spring Boot)
Desde la carpeta `backend/`:
```bash
mvn spring-boot:run
```
El servidor backend se levantará en `http://localhost:8080`.

### 4. Ejecutar el Frontend (Angular)
Desde la raíz del proyecto (donde está el `package.json`):
```bash
npm install
npm run start
# O usando Angular CLI: ng serve
```
Abrir en el navegador:
```text
http://localhost:4200
```
## Estructura básica del proyecto

```text
src/
 ├── app/
 │   ├── pages/
 │   │   ├── banks/
 │   │   ├── budgets/
 │   │   ├── dashboard/
 │   │   ├── login/
 │   │   ├── main-layout/
 │   │   ├── savings/
 │   │   └── transactions/
 │   ├── app.routes.ts
 │   ├── app.html
 │   └── app.ts
```
## Capturas del sistema

### Login
<img width="1913" height="939" alt="Login" src="https://github.com/user-attachments/assets/a2d8facf-7414-457c-a326-c3276f18b301" />

### Dashboard
<img width="1919" height="875" alt="Dashboard" src="https://github.com/user-attachments/assets/062b3a07-9f55-4537-80de-6470f32ad0bc" />


### Movimientos
<img width="1534" height="756" alt="Movimientos" src="https://github.com/user-attachments/assets/b9e73744-483b-41c9-ba07-e2afcbcc6e1e" />

### Presupuestos
<img width="1917" height="943" alt="Presupuesto" src="https://github.com/user-attachments/assets/18983cdd-5112-4fdc-9010-c99516f4ac8f" />


### Metas de ahorro
<img width="1916" height="948" alt="Ahorro" src="https://github.com/user-attachments/assets/2babf779-f9dd-4779-96ed-69cd4eaf6d78" />


### Bancos
<img width="1906" height="942" alt="Bancos" src="https://github.com/user-attachments/assets/e9a3ef38-db2d-4105-9b5e-801c042fcedf" />

## Responsive Design
La aplicación fue desarrollada utilizando diseño responsive para adaptarse a:
- Telefonos
- Tablets
- Computadoras
## Integrantes
- Marlon Demera
## Asignatura
Aplicaciones de Tecnologías Web