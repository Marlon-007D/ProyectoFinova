# FINOVA Backend

Backend API for the FINOVA personal finance application.

## Tecnologías
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- Validation
- Springdoc OpenAPI (Swagger)

## Instalación
1. Ir al directorio del backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias y compilar:
   ```bash
   mvn clean package
   ```

## Configuración
Copiar el archivo de ejemplo o definir las variables de entorno necesarias:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Ejemplo de URL:
```text
jdbc:mysql://localhost:3306/finova_db?useSSL=false&serverTimezone=UTC
```

## Ejecución
```bash
mvn spring-boot:run
```

## Documentación Swagger
- `http://localhost:8080/swagger-ui.html`
- `http://localhost:8080/api-docs`

## Endpoints principales
- `GET /api/bank-accounts`
- `GET /api/bank-accounts/{id}`
- `POST /api/bank-accounts`
- `PUT /api/bank-accounts/{id}`
- `DELETE /api/bank-accounts/{id}`

- `GET /api/transactions`
- `GET /api/transactions/{id}`
- `POST /api/transactions`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

- `GET /api/budgets`
- `GET /api/budgets/{id}`
- `POST /api/budgets`
- `PUT /api/budgets/{id}`
- `DELETE /api/budgets/{id}`

- `GET /api/savings-goals`
- `GET /api/savings-goals/{id}`
- `POST /api/savings-goals`
- `PUT /api/savings-goals/{id}`
- `DELETE /api/savings-goals/{id}`

## Validaciones
- Campos obligatorios
- Valores numéricos positivos
- Longitudes mínimas y máximas
- Identificadores existentes para actualizar/eliminar

## Datos de prueba
La base de datos se inicializa con datos de ejemplo mediante el archivo `src/main/resources/data.sql`.
