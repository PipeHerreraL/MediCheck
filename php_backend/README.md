# 🐘 Micro-Backend PHP (Favoritos)

Este directorio conforma la parte del backend requerida. Está escrita de forma nativa en PHP aprovechando `PDO` (PHP Data Objects) para su comunicación con la base de datos `MySQL`.

## 📦 Estructura

- `database.sql`: Script DDL para construir la base de datos `medicheck_db` y cargar algunos registros (Mocks).
- `db.php`: Conector PDO de PHP hacia MySQL. Requiere que exista un achivo `.env` en este directorio.
- `api_favoritos.php`: Enrutador y Controlador maestro que procesa las cabeceras REST limitando los verbos HTTP permitidos (GET, POST, PUT, DELETE).

## 🚀 Instalación y Despliegue Local

### 1. Activar Servidor MySQL y Apache
Abre XAMPP y presiona "Start" en los servicios **Apache** y **MySQL**.

### 2. Base de Datos
1. Ve a `http://localhost/phpmyadmin`
2. Ve a la sección **Importar** y selecciona el archivo `database.sql` incluido en esta carpeta.
3. Haz clic en "Continuar". Esto creará tu base de datos automáticamente.

### 3. Configurar Entorno (.env)
Este script PHP lee variables de entorno de un archivo en su propia carpeta para conectar con MySQL de manera profesional.
Debes crear una copia del archivo `.env.example` y nombrarlo `.env`:

```env
DB_HOST=127.0.0.1
DB_NAME=medicheck_db
DB_USER=root
DB_PASS=
```

### 4. Ponerlo en Línea
Para que tu Proxy de Node lo reconozca por medio del servidor Apache de puerto 80, lo ideal es crear un "Junction" hacia el directorio público de XAMPP mediante Powerhsell como Administrador:
```powershell
cmd.exe /c 'mklink /J "C:\xampp\htdocs\php_backend" "C:\Ruta\Al\Tu\Proyecto\php_backend"'
```
Con eso, tu backend estará vivo en `http://localhost/php_backend/...` y Node.js se podrá comunicar limpiamente.
