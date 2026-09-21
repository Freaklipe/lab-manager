# Lab Manager

## 1. Descripción

**Lab Manager** es una aplicación web destinada a centralizar la gestión, documentación y monitorización básica de los dispositivos y servicios de un homelab.

El proyecto comenzará como un **MVP monolítico**, con una arquitectura sencilla y mantenible, y evolucionará progresivamente incorporando capacidades de testing, seguridad, containerización, deployment, CI/CD, monitoring y observabilidad.

El proyecto también funcionará como un **laboratorio de aprendizaje práctico**, permitiendo aplicar conocimientos de desarrollo Full Stack, arquitectura de software, bases de datos, DevOps y automatización.

---

## 2. Objetivos

### 2.1 Objetivo principal

Construir una aplicación Full Stack funcional que permita administrar y monitorizar los dispositivos y servicios de un homelab desde una interfaz web centralizada.

### 2.2 Objetivos de aprendizaje

El proyecto deberá permitir practicar progresivamente:

* Desarrollo Backend.
* Desarrollo Frontend.
* Diseño de APIs REST.
* Arquitectura de software.
* Modelado de bases de datos.
* Testing unitario e integración.
* Seguridad de aplicaciones.
* Git y control de versiones.
* Docker.
* Deployment.
* CI/CD.
* Monitoring.
* Observabilidad.
* Documentación técnica.
* Uso responsable de herramientas de IA para desarrollo.

El objetivo no es solamente obtener una aplicación funcional, sino utilizarla como **proyecto de aprendizaje y portfolio profesional**.

---

## 3. Usuario objetivo

La primera versión estará diseñada para un único usuario administrador del homelab.

No se implementará inicialmente un sistema complejo de usuarios, roles o permisos.

La arquitectura deberá permitir incorporar estas funcionalidades posteriormente sin necesidad de reconstruir completamente la aplicación.

---

## 4. Problema que resuelve

La información de un homelab suele encontrarse distribuida entre diferentes lugares:

* Router.
* Servidores.
* Raspberry Pi.
* Docker.
* Archivos de configuración.
* Terminal.
* Dashboards.
* Documentación.
* Repositorios Git.
* Memoria del administrador.

Lab Manager busca centralizar esta información y proporcionar una vista común de:

* dispositivos;
* servicios;
* direcciones;
* puertos;
* estado;
* disponibilidad;
* información técnica;
* proyectos relacionados.

---

# 5. Alcance del MVP

El MVP deberá mantenerse deliberadamente pequeño.

## 5.1 Gestión de dispositivos

El sistema permitirá registrar dispositivos físicos o virtuales del homelab.

Cada dispositivo tendrá como mínimo:

* ID.
* Nombre.
* Hostname.
* Dirección IP.
* Tipo.
* Sistema operativo.
* Descripción.
* Estado.
* Fecha de creación.
* Fecha de actualización.

Ejemplos:

* Raspberry Pi.
* PC principal.
* Laptop.
* Servidor virtual.
* Máquina virtual.

---

## 5.2 Gestión de servicios

Los servicios estarán asociados a dispositivos.

Cada servicio tendrá como mínimo:

* ID.
* Nombre.
* Descripción.
* Dispositivo asociado.
* URL.
* Puerto.
* Protocolo.
* Tipo de servicio.
* Estado.
* Configuración de health check.
* Fecha de creación.
* Fecha de actualización.

Ejemplos:

* Pi-hole.
* WireGuard.
* PostgreSQL.
* Ollama.
* API.
* Docker.
* Aplicaciones propias.

---

## 5.3 Health Checks

El sistema deberá poder comprobar la disponibilidad básica de determinados servicios.

Inicialmente se contemplan:

* HTTP.
* HTTPS.
* TCP.

Un health check deberá permitir determinar al menos:

```text
UP
DOWN
TIMEOUT
UNKNOWN
```

Se deberán registrar datos básicos de la comprobación, como:

* fecha/hora;
* duración;
* resultado;
* código HTTP cuando corresponda;
* mensaje de error cuando corresponda.

La implementación inicial deberá ser sencilla y no pretende reemplazar herramientas especializadas de monitoring.

---

## 5.4 Dashboard

El sistema deberá disponer de un dashboard inicial que permita visualizar rápidamente:

* cantidad de dispositivos;
* dispositivos online/offline;
* cantidad de servicios;
* servicios disponibles/no disponibles;
* últimos health checks;
* servicios con problemas.

Ejemplo conceptual:

```text
+------------------------------------------------+
|                 LAB MANAGER                    |
+------------------------------------------------+
|                                                |
| Devices                  Services              |
|                                                |
| 3 Total                  8 Total               |
| 3 Online                 7 Online              |
| 0 Offline                1 Offline             |
|                                                |
+------------------------------------------------+
| Services                                       |
|                                                |
| Pi-hole          cerberus       ONLINE         |
| WireGuard        cerberus       ONLINE         |
| PostgreSQL       main-pc        ONLINE         |
| Lab API          main-pc        OFFLINE        |
|                                                |
+------------------------------------------------+
```

El diseño visual no es una prioridad durante la primera iteración.

La prioridad será funcionalidad, arquitectura y calidad técnica.

---

# 6. Arquitectura inicial

La aplicación comenzará utilizando una arquitectura monolítica modular.

```text
                    ┌───────────────────┐
                    │     Angular       │
                    │     Frontend      │
                    └─────────┬─────────┘
                              │
                           HTTP/REST
                              │
                              ▼
                    ┌───────────────────┐
                    │      Backend      │
                    │   Node + Fastify  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    PostgreSQL     │
                    └───────────────────┘
```

No se utilizarán microservicios inicialmente.

El objetivo será construir primero una aplicación modular, testeable y mantenible.

---

# 7. Stack tecnológico

## Frontend

### Angular

Angular será utilizado como framework principal del frontend.

Se utilizará:

* Angular.
* TypeScript.
* Angular Router.
* Angular HTTP Client.
* Angular Forms.
* Componentes y servicios.
* Testing de Angular.

El proyecto servirá también como oportunidad para adquirir experiencia práctica con Angular.

---

## Backend

### Node.js + Fastify + TypeScript

El backend será desarrollado utilizando:

* Node.js.
* TypeScript.
* Fastify.
* API REST.

Se priorizará:

* separación de responsabilidades;
* validación de entrada;
* manejo consistente de errores;
* logging;
* configuración mediante variables de entorno;
* testing;
* seguridad.

---

## Base de datos

### PostgreSQL

PostgreSQL será la base de datos principal.

El modelo deberá contemplar inicialmente relaciones similares a:

```text
Device
   │
   └──────< Service
               │
               └──────< HealthCheck
```

Se deberán utilizar:

* constraints;
* foreign keys;
* índices cuando correspondan;
* migrations;
* validaciones apropiadas.

El ORM/query builder se decidirá durante la etapa de diseño técnico.

---

## Infraestructura

Inicialmente:

* Docker.
* Docker Compose.
* Git.
* GitHub.

Posteriormente:

* CI.
* CD.
* Deployment.
* Monitoring.
* Observabilidad.

---

# 8. Estructura conceptual

La aplicación estará organizada inicialmente alrededor de los siguientes módulos:

```text
Lab Manager
│
├── Devices
│
├── Services
│
├── Health Checks
│
├── Dashboard
│
└── Projects
```

El módulo `Projects` puede tener una implementación mínima inicialmente y crecer posteriormente.

---

# 9. API

El backend deberá exponer una API REST.

Ejemplos conceptuales:

```text
GET    /api/devices
GET    /api/devices/:id
POST   /api/devices
PUT    /api/devices/:id
DELETE /api/devices/:id
```

Servicios:

```text
GET    /api/services
GET    /api/services/:id
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
```

Health checks:

```text
GET    /api/services/:id/health
GET    /api/health-checks
```

Los endpoints definitivos se definirán durante la etapa de diseño de la API.

---

# 10. Testing

El proyecto deberá incorporar testing desde una etapa temprana.

Se contemplan:

### Backend

* Unit tests.
* Integration tests.
* API tests.

### Frontend

* Unit tests.
* Component tests.

### End-to-end

Se incorporarán posteriormente cuando la aplicación tenga un flujo funcional suficiente.

El objetivo es evitar que los tests sean agregados únicamente al final del proyecto.

---

# 11. Seguridad

La seguridad será considerada desde el diseño.

Como mínimo se deberán considerar:

* validación de entradas;
* sanitización cuando corresponda;
* manejo seguro de errores;
* gestión de secretos mediante variables de entorno;
* evitar credenciales hardcodeadas;
* protección contra vulnerabilidades comunes;
* configuración segura de CORS;
* rate limiting cuando sea necesario;
* headers de seguridad;
* control de acceso cuando se incorpore autenticación.

Se utilizará OWASP como referencia para las decisiones de seguridad.

---

# 12. Docker

El proyecto deberá poder ejecutarse mediante contenedores.

Objetivo conceptual:

```text
docker compose up
```

Debería permitir levantar:

```text
Angular
   │
Backend
   │
PostgreSQL
```

La estrategia exacta de desarrollo y producción se definirá posteriormente.

---

# 13. Git

Git será utilizado desde el comienzo del proyecto.

El repositorio deberá mantener:

* commits pequeños y descriptivos;
* ramas cuando corresponda;
* `.gitignore`;
* documentación;
* historial limpio;
* configuración reproducible.

El repositorio será parte importante del portfolio del proyecto.

---

# 14. Deployment

Una vez que el MVP sea funcional, se realizará una primera implementación en un entorno de producción.

El objetivo de esta etapa será aprender:

* build de producción;
* configuración;
* variables de entorno;
* Docker;
* networking;
* reverse proxy;
* HTTPS;
* logs;
* backups básicos;
* actualización de versiones.

El proveedor de infraestructura se decidirá posteriormente.

---

# 15. CI/CD

CI/CD se incorporará después de tener una primera versión funcional desplegada.

### CI

Cada cambio deberá poder ejecutar automáticamente:

```text
Lint
   ↓
Tests
   ↓
Build
```

### CD

Posteriormente se automatizará:

```text
Git Push
   ↓
CI
   ↓
Build
   ↓
Tests
   ↓
Deploy
```

La implementación concreta se definirá durante la etapa correspondiente.

---

# 16. Monitoring y observabilidad

Estas capacidades serán incorporadas progresivamente.

Inicialmente:

* health checks;
* logs;
* estado de servicios.

Posteriormente:

* métricas;
* tiempos de respuesta;
* errores;
* historial de disponibilidad;
* dashboards;
* alertas.

No se pretende implementar una plataforma completa de observabilidad en el MVP.

---

# 17. Funcionalidades fuera del MVP

Las siguientes funcionalidades quedan explícitamente fuera de la primera versión:

* Kubernetes.
* Microservicios.
* Multi-tenancy.
* Sistema avanzado de usuarios.
* RBAC complejo.
* OAuth/SSO.
* Aplicación móvil.
* IA integrada.
* Provisionamiento automático.
* Terraform.
* Ansible.
* Administración completa de Docker.
* Administración completa del sistema operativo.
* Sistema avanzado de alertas.
* Monitoring distribuido avanzado.

Podrán evaluarse posteriormente.

---

# 18. Principios del proyecto

## 18.1 Simplicidad primero

No introducir complejidad arquitectónica sin una necesidad concreta.

## 18.2 Aprender construyendo

Cada funcionalidad deberá aportar aprendizaje técnico además de valor para la aplicación.

## 18.3 Evolución incremental

El proyecto crecerá mediante pequeñas iteraciones funcionales.

## 18.4 Automatización

Las tareas repetitivas deberán automatizarse progresivamente.

## 18.5 Seguridad desde el inicio

La seguridad no será una etapa exclusivamente posterior.

## 18.6 Código mantenible

Se priorizará código claro, testeable y documentado sobre soluciones excesivamente complejas.

## 18.7 IA como herramienta

Los LLM podrán utilizarse para:

* explorar alternativas;
* generar código;
* explicar errores;
* crear tests;
* revisar código;
* sugerir mejoras;
* documentar.

Sin embargo, el código generado por IA deberá ser comprendido, revisado y validado.

---

# 19. Criterio de éxito del MVP

Consideraremos terminado el MVP cuando sea posible:

1. Levantar el proyecto de forma reproducible.
2. Ejecutar frontend, backend y PostgreSQL.
3. Crear dispositivos.
4. Crear servicios asociados a dispositivos.
5. Visualizar dispositivos y servicios.
6. Ejecutar health checks.
7. Mostrar el estado de los servicios.
8. Ejecutar tests automatizados.
9. Ejecutar el proyecto mediante Docker.
10. Realizar un deployment funcional.
11. Tener el proyecto documentado en Git.
12. Tener una primera versión preparada para comenzar el proceso de CI/CD.

---

# 20. Roadmap general

```text
ETAPA 0
Definición del proyecto
        │
        ▼
ETAPA 1
Repositorio y estructura inicial
        │
        ▼
ETAPA 2
Diseño de arquitectura y modelo de datos
        │
        ▼
ETAPA 3
Desarrollo del MVP
        │
        ▼
ETAPA 4
Testing y seguridad
        │
        ▼
ETAPA 5
Dockerización
        │
        ▼
ETAPA 6
Primera implementación en producción
        │
        ▼
ETAPA 7
Continuous Integration
        │
        ▼
ETAPA 8
Continuous Deployment
        │
        ▼
ETAPA 9
Monitoring y observabilidad
        │
        ▼
ETAPA 10
Evolución del Lab Manager
```

---

# 21. Definición resumida

> **Lab Manager es una aplicación web Full Stack para centralizar la gestión, documentación y monitorización básica de los dispositivos y servicios de un homelab.**
>
> El proyecto utilizará Angular en el frontend, Node.js/Fastify/TypeScript en el backend y PostgreSQL como base de datos.
>
> Comenzará como un monolito modular y evolucionará progresivamente incorporando testing, seguridad, Docker, deployment, CI/CD, monitoring y observabilidad.
>
> Además de ser una herramienta funcional para el homelab, el proyecto tendrá como objetivo servir como laboratorio práctico para desarrollar competencias profesionales de desarrollo Full Stack, backend, arquitectura y DevOps.
