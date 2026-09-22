# Lab Manager — Architecture

## 1. Overview

Lab Manager es una aplicación web Full Stack destinada a administrar y monitorear los recursos, servicios y proyectos de un laboratorio tecnológico.

El sistema estará compuesto inicialmente por tres componentes principales:

* **Frontend:** aplicación web desarrollada con Angular.
* **Backend:** API REST desarrollada con Node.js.
* **Database:** base de datos PostgreSQL.

La comunicación entre el frontend y el backend se realizará mediante HTTP utilizando una API REST.

El backend será responsable de la lógica de negocio y de la comunicación con la base de datos.

La aplicación será desarrollada inicialmente como un **monorepo**, manteniendo frontend, backend, documentación y configuración de infraestructura dentro del mismo repositorio Git.

### Arquitectura inicial

```text
                    ┌─────────────────┐
                    │     Usuario     │
                    │    Navegador    │
                    └────────┬────────┘
                             │
                             │ HTTP/REST
                             ▼
                    ┌─────────────────┐
                    │     Angular     │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             │ HTTP/REST
                             ▼
                    ┌─────────────────┐
                    │     Node.js     │
                    │   REST API      │
                    └────────┬────────┘
                             │
                             │ SQL
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

### Principios iniciales

La arquitectura buscará mantener una separación clara de responsabilidades entre presentación, lógica de negocio y persistencia de datos.

Se priorizará una arquitectura sencilla y evolutiva, evitando introducir tecnologías o patrones innecesariamente complejos mientras no exista una necesidad concreta.

## 2. Responsibilities

### 2.1 Frontend — Angular

El frontend será responsable de la interacción con el usuario y de la presentación de la información.

Sus principales responsabilidades serán:

* Mostrar la interfaz gráfica.
* Gestionar la navegación de la aplicación.
* Capturar información ingresada por el usuario.
* Realizar validaciones relacionadas con la interfaz.
* Consumir la API REST del backend.
* Mostrar los datos recibidos desde el backend.
* Gestionar estados de carga y errores de comunicación.

El frontend **no tendrá acceso directo a la base de datos**.

---

### 2.2 Backend — Node.js

El backend será responsable de exponer la API REST y ejecutar la lógica de negocio de la aplicación.

Sus principales responsabilidades serán:

* Exponer endpoints HTTP.
* Validar los datos recibidos.
* Ejecutar la lógica de negocio.
* Gestionar autenticación y autorización cuando sean implementadas.
* Comunicarse con PostgreSQL.
* Transformar y preparar los datos para el frontend.
* Gestionar errores.
* Aplicar reglas de seguridad.
* Registrar eventos relevantes mediante logs.

El backend será el único componente de la aplicación con acceso directo a la base de datos.

---

### 2.3 Database — PostgreSQL

PostgreSQL será responsable de la persistencia de los datos.

Sus principales responsabilidades serán:

* Almacenar información de forma persistente.
* Mantener la integridad de los datos.
* Aplicar restricciones y relaciones entre entidades.
* Ejecutar consultas solicitadas por el backend.
* Proporcionar transacciones cuando sean necesarias.

La base de datos no tendrá conocimiento de la interfaz gráfica ni de la lógica específica del frontend.

---

### 2.4 Docker

Docker será utilizado para proporcionar entornos reproducibles durante el desarrollo y posteriormente durante el despliegue.

Inicialmente se utilizará principalmente para ejecutar PostgreSQL.

Posteriormente podrá utilizarse para empaquetar otros componentes de la aplicación cuando sea necesario.

---

### 2.5 Git y GitHub

Git será utilizado para el control de versiones del proyecto.

GitHub será utilizado como repositorio remoto y posteriormente como plataforma para implementar procesos de integración y despliegue continuo mediante GitHub Actions.

## 3. Component Communication

La comunicación entre los componentes seguirá un modelo basado en HTTP y API REST.

### 3.1 Flujo general

El flujo principal de una solicitud será:

```text
Usuario
   │
   ▼
Angular
   │
   │ HTTP Request
   ▼
Node.js API
   │
   │ Query
   ▼
PostgreSQL
   │
   │ Result
   ▼
Node.js API
   │
   │ HTTP Response
   ▼
Angular
   │
   ▼
Usuario
```

Angular será responsable de iniciar las solicitudes relacionadas con las acciones del usuario.

Node.js procesará las solicitudes, ejecutará las reglas de negocio necesarias y accederá a PostgreSQL cuando sea necesario.

PostgreSQL devolverá los datos al backend, que será responsable de preparar la respuesta que recibirá Angular.

---

### 3.2 API REST

La API utilizará el prefijo:

```text
/api
```

Los recursos serán representados mediante endpoints REST.

Por ejemplo, para administrar laboratorios:

```text
GET    /api/labs
GET    /api/labs/:id
POST   /api/labs
PUT    /api/labs/:id
DELETE /api/labs/:id
```

Estos endpoints representarán las operaciones principales sobre el recurso `labs`.

---

### 3.3 Ejemplo de solicitud

Cuando el usuario solicite la lista de laboratorios:

```text
GET /api/labs
```

el flujo será:

```text
Angular
   │
   │ GET /api/labs
   ▼
Node.js
   │
   │ SELECT ...
   ▼
PostgreSQL
   │
   │ resultados
   ▼
Node.js
   │
   │ HTTP 200 + JSON
   ▼
Angular
```

Una respuesta exitosa podría tener una estructura similar a:

```json
[
  {
    "id": 1,
    "name": "Home Lab",
    "description": "Laboratorio doméstico"
  },
  {
    "id": 2,
    "name": "Development Lab",
    "description": "Entorno de desarrollo"
  }
]
```

La estructura definitiva de las respuestas será definida durante el desarrollo de la API.

---

### 3.4 Códigos HTTP

La API utilizará códigos HTTP para representar el resultado de las operaciones.

Ejemplos:

| Código                      | Uso                                           |
| --------------------------- | --------------------------------------------- |
| `200 OK`                    | Solicitud procesada correctamente             |
| `201 Created`               | Recurso creado correctamente                  |
| `204 No Content`            | Operación correcta sin contenido de respuesta |
| `400 Bad Request`           | Datos de entrada inválidos                    |
| `401 Unauthorized`          | Usuario no autenticado                        |
| `403 Forbidden`             | Usuario sin permisos suficientes              |
| `404 Not Found`             | Recurso no encontrado                         |
| `409 Conflict`              | Conflicto con el estado actual                |
| `500 Internal Server Error` | Error inesperado del servidor                 |

El backend será responsable de utilizar estos códigos de forma consistente.

---

### 3.5 Formato de datos

La comunicación entre Angular y Node.js utilizará inicialmente JSON.

Las solicitudes y respuestas utilizarán `application/json` cuando corresponda.

Ejemplo:

```http
Content-Type: application/json
```

La API deberá mantener estructuras de datos consistentes para facilitar su consumo desde el frontend.

## 4. Initial Domain Model

El sistema administrará inicialmente recursos y componentes de un laboratorio tecnológico.

El modelo de dominio inicial estará compuesto por las siguientes entidades:

### 4.1 Lab

Representa un laboratorio o entorno tecnológico administrado por el sistema.

Ejemplos:

* Home Lab
* Development Lab
* Production Lab

Un `Lab` puede contener múltiples servidores y proyectos.

---

### 4.2 Server

Representa un equipo físico o virtual perteneciente a un laboratorio.

Ejemplos:

* Raspberry Pi
* PC de desarrollo
* Servidor virtual
* NAS

Un `Server` pertenece a un `Lab` y puede ejecutar múltiples servicios.

---

### 4.3 Service

Representa una aplicación, servicio o proceso ejecutándose en un servidor.

Ejemplos:

* PostgreSQL
* Docker
* Pi-hole
* API de un proyecto
* Servicio web

Un `Service` pertenece a un `Server`.

---

### 4.4 Project

Representa un proyecto de software administrado dentro del laboratorio.

Ejemplos:

* Lab Manager
* Proyecto de pruebas
* API experimental

Un proyecto puede utilizar uno o más servidores y servicios.

---

### 4.5 Deployment

Representa una implementación de una versión de un proyecto en un entorno determinado.

Ejemplos:

```text
Lab Manager
    │
    └── Deployment
          ├── Version: 1.0.0
          ├── Environment: production
          └── Status: successful
```

Los `Deployments` serán especialmente relevantes posteriormente para estudiar CI/CD.

---

## 5. Initial Relationships

Las relaciones principales serán:

```text
Lab
 │
 ├──── 1:N ──── Server
 │                  │
 │                  └──── 1:N ──── Service
 │
 └──── 1:N ──── Project
                       │
                       └──── 1:N ──── Deployment
```

### Relaciones

* Un `Lab` puede tener muchos `Server`.
* Un `Server` pertenece a un `Lab`.
* Un `Server` puede ejecutar muchos `Service`.
* Un `Service` pertenece a un `Server`.
* Un `Lab` puede contener muchos `Project`.
* Un `Project` pertenece a un `Lab`.
* Un `Project` puede tener múltiples `Deployment`.
* Un `Deployment` pertenece a un `Project`.

Este modelo inicial podrá evolucionar durante el desarrollo cuando aparezcan nuevos requisitos.

## 6. Initial Entity Attributes

Las entidades utilizarán inicialmente los siguientes atributos.

### 6.1 Lab

| Attribute     | Description                 |
| ------------- | --------------------------- |
| `id`          | Identificador único         |
| `name`        | Nombre del laboratorio      |
| `description` | Descripción del laboratorio |

---

### 6.2 Server

| Attribute          | Description                        |
| ------------------ | ---------------------------------- |
| `id`               | Identificador único                |
| `lab_id`           | Laboratorio al que pertenece       |
| `name`             | Nombre identificativo del servidor |
| `hostname`         | Hostname del equipo                |
| `ip_address`       | Dirección IP                       |
| `operating_system` | Sistema operativo                  |
| `status`           | Estado actual del servidor         |

---

### 6.3 Service

| Attribute     | Description                |
| ------------- | -------------------------- |
| `id`          | Identificador único        |
| `server_id`   | Servidor donde se ejecuta  |
| `name`        | Nombre del servicio        |
| `description` | Descripción del servicio   |
| `port`        | Puerto utilizado           |
| `status`      | Estado actual del servicio |

---

### 6.4 Project

| Attribute        | Description                  |
| ---------------- | ---------------------------- |
| `id`             | Identificador único          |
| `lab_id`         | Laboratorio al que pertenece |
| `name`           | Nombre del proyecto          |
| `description`    | Descripción del proyecto     |
| `repository_url` | URL del repositorio          |

---

### 6.5 Deployment

| Attribute     | Description                            |
| ------------- | -------------------------------------- |
| `id`          | Identificador único                    |
| `project_id`  | Proyecto asociado                      |
| `version`     | Versión desplegada                     |
| `environment` | Entorno donde se realizó el despliegue |
| `status`      | Resultado del despliegue               |
| `deployed_at` | Fecha y hora del despliegue            |

---

## 7. Initial Data Types

Los tipos concretos de PostgreSQL serán definidos durante el diseño de la base de datos.

De forma inicial se consideran:

* Identificadores: `integer` o `bigint`.
* Nombres y textos cortos: `varchar`.
* Descripciones: `text`.
* Puertos: `integer`.
* Fechas: `timestamp`.
* Estados: valores controlados mediante restricciones o tipos apropiados.

Los tipos definitivos serán revisados antes de crear las tablas.
