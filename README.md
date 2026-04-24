# MediCheck

Este es el directorio raíz del proyecto **MediCheck**, que agrupa las tres partes principales de la aplicación: el Frontend (Angular), el Backend principal (Node.js) y el microservicio de Favoritos (PHP).

## Estructura del Proyecto

* **`/frontend`**: Aplicación web desarrollada en Angular.
* **`/backend`**: API principal en Node.js (Express) que resuelve las búsquedas y actúa como proxy de servicios.
* **`/php_backend`**: Microservicio en PHP (con conexión a MySQL) encargado específicamente de la gestión de favoritos.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu sistema local:
1. **[Node.js](https://nodejs.org/)** (v14+ recomendado, incluye `npm`).
2. **[PHP](https://www.php.net/)** (asegúrate de tenerlo agregado a las variables de entorno para usar el servidor integrado). 
   - *Nota*: Es necesario tener habilitada la extensión `pdo_mysql` en tu configuración de `php.ini`.
3. **Servidor MySQL** (XAMPP, WAMP, o instalación nativa).

---

## 🚀 Instalación y Configuración

Hemos unificado la instalación de dependencias en un solo comando para tu comodidad.

Sitúate en este directorio raíz y ejecuta:

```bash
npm run install:all
```

*Esto realizará lo siguiente:*
1. Instalará la librería `concurrently` en la raíz.
2. Instalará y configurará los `node_modules` dentro de `/frontend`.
3. Instalará y configurará los `node_modules` dentro de `/backend`.

---

## ▶️ Ejecución del Proyecto (En bloque)

Para facilitar el desarrollo, ya no necesitas abrir múltiples terminales. Puedes ejecutar las tres aplicaciones **al mismo tiempo** desde esta carpeta principal.

Usando tu terminal en la raíz del proyecto, ejecuta:

```bash
npm start
```

Esto disparará de forma sincronizada los siguientes procesos usando la librería **Concurrenty**:

* 🔋 **Frontend Angular**: `npm start` *(Disponible en http://localhost:4200)*
* ⚙️ **Backend Node.js**: `npm run dev` *(Disponible en http://localhost:3000)*
* 🐘 **Backend PHP**: `start_php.bat` *(Servidor PHP local iterando en http://localhost:8000)*

Podrás ver los logs de los 3 servidores agrupados y diferenciados en la misma ventana de comandos.

> **Nota para detener los servicios:** En tu terminal, simplemente presiona `Ctrl + C`, te preguntará si deseas terminar los procesos por lotes, escribe `S` (o `Y` en inglés) y todo se apagará de forma automática y controlada.
