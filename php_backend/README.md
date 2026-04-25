# 🐘 Micro-Backend PHP (Favoritos)

Este directorio conforma la parte del backend requerida. Está escrita de forma nativa en PHP aprovechando `PDO` (PHP Data Objects) para su comunicación con la base de datos `MySQL`.

## 📦 Estructura

- `database.sql`: Script DDL para construir la base de datos `medicheck_db` y cargar algunos registros (Mocks).
- `db.php`: Conector PDO de PHP hacia MySQL. Requiere que exista un achivo `.env` en este directorio.
- `api_favoritos.php`: Enrutador y Controlador maestro que procesa las cabeceras REST limitando los verbos HTTP permitidos (GET, POST, PUT, DELETE).

## 🚀 Instalación y Despliegue Local

### 1. Activar Servidor MySQL
Asegúrate de tener un servicio de **MySQL** ejecutándose en el puerto `3306` (puedes encenderlo desde XAMPP o usar tu instalación local de MySQL).

### 2. Base de Datos
1. Accede a tu gestor de base de datos preferido (DBeaver, MySQL Workbench o `http://localhost/phpmyadmin`).
2. Crea una base de datos o simplemente ejecuta el archivo `database.sql` incluido en esta carpeta para precargar las tablas automáticamente.

### 3. Configurar Entorno (.env)
Este script PHP lee variables de entorno de un archivo en su propia carpeta para conectar con MySQL de manera profesional.
Debes crear una copia del archivo `.env.example` y nombrarlo `.env`:

```env
DB_HOST=127.0.0.1
DB_NAME=medicheck_db
DB_USER=root
DB_PASS=
```

### 4. Poner en Línea (Local)
Para evitar la necesidad de configurar Apache o rutas en XAMPP, este proyecto está configurado para aprovechar el servidor de desarrollo nativo de PHP:

1. Ve a la carpeta `php_backend`.
2. Haz doble clic en el archivo **`start_php.bat`** (o ejecútalo en la terminal de tu preferencia).
   - *Este script iniciará un servidor PHP en `http://localhost:8000` y cargará el driver `pdo_mysql` automáticamente.*
   - **Importante:** Deja esa ventana/terminal abierta para que la comunicación con Node se mantenga activa.

3. En el directorio raíz de `backend` de Node.js, asegúrate de que el `.env` tenga la ruta correcta configurada:
   ```env
   PHP_BACKEND_URL=http://localhost:8000/api_favoritos.php
   ```

Una vez que PHP está en línea, Node.js se conectará directamente como Proxy sin problemas.
