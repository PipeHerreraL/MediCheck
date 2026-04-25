# 🚀 Instalación Rápida (Quick Installation)

Si ya cuentas con los requisitos previos (**Node.js**, **PHP** y **MySQL**), sigue estos pasos.

### 1. Ubícate en el directorio raíz
Si acabas de descargar o clonar el código, usa una terminal y asegúrate de estar dentro de la carpeta principal del proyecto:
```bash
cd ruta/hacia/tu/carpeta/MediCheck
```

### 2. Base de Datos
1. Inicia tu servidor MySQL (por ejemplo desde XAMPP o nativo).
2. Asegúrate de tener creada y configurada la base de datos requerida por el backend PHP, tendrás el script para crearla en la carpeta `php_backend/database.sql`.
3. Verifica las variables de entorno para que el Backend tenga conexión (revisa tu archivo `.env`).

### 3. El Comando Mágico (Instalar todo)
Hemos configurado un comando unificado para que no tengas que instalar componente por componente de manera manual. En la raíz, simplemente escribe:

```bash
npm run install:all
```
*(Este comando automatiza la instalación de las dependencias requeridas en el Frontend, en el Backend y en la propia raíz del proyecto)*.

### 4. Lanzar la Aplicación
Una vez terminadas todas las instalaciones, levanta todos los servidores en bloque tecleando:

```bash
npm start
```

### ✅ ¡Listo para probar!
Abre tu navegador y explora o consume las APIs:
* 🖥️ **Angular UI**: `http://localhost:4200`
* 🟢 **Node API**: `http://localhost:3000`
* 🐘 **PHP API**: `http://localhost:8000`

> *Para terminar la ejecución presiona `Ctrl + C` en la terminal que dejaste abierta*
