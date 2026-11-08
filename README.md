# mi_repositorio

Sitio estático de **Coaching Motivacional** (`index.html`, `estilo.css`, `script.js`).

## Publicar en Hostinger

Cada `push` a la rama `main` sube el sitio automáticamente a Hostinger por FTP
mediante GitHub Actions (`.github/workflows/deploy-hostinger.yml`). También se
puede lanzar a mano desde la pestaña **Actions → Desplegar en Hostinger → Run workflow**.

### 1. Datos de FTP en Hostinger

En **hPanel → Sitios web → Administrar → Archivos → Cuentas FTP** anota:

- **Servidor FTP** (p. ej. `ftp.tudominio.com` o una IP)
- **Usuario FTP** (p. ej. `u123456789` o `u123456789.tudominio.com`)
- **Contraseña FTP** (puedes cambiarla ahí si no la recuerdas)

### 2. Secretos en GitHub

En el repositorio: **Settings → Secrets and variables → Actions → New repository secret**
y crea estos tres:

| Nombre                   | Valor                  |
|--------------------------|------------------------|
| `HOSTINGER_FTP_SERVER`   | Servidor FTP           |
| `HOSTINGER_FTP_USERNAME` | Usuario FTP            |
| `HOSTINGER_FTP_PASSWORD` | Contraseña FTP         |

### 3. Carpeta de destino

El flujo sube los archivos a `public_html/`. Si el usuario FTP ya entra
directamente dentro de `public_html` (lo verás al conectarte), cambia
`server-dir` a `./` en el archivo del workflow. Para un subdominio, usa su
carpeta (p. ej. `public_html/coaching/`).

### 4. SSL

Activa el certificado SSL gratuito en **hPanel → Seguridad → SSL**. El archivo
`.htaccess` redirige todo el tráfico a HTTPS.

## Base de datos MySQL

La lista de tareas (marcadas / sin marcar) y los estados de ánimo elegidos se
guardan en MySQL a través de una pequeña API en PHP (`api/`).

| Archivo                  | Para qué sirve                                         |
|--------------------------|--------------------------------------------------------|
| `sql/schema.sql`         | Crea las tablas `tareas` y `estados_animo`             |
| `api/tareas.php`         | `GET` lista tareas · `POST {"id":1,"completada":true}` |
| `api/animo.php`          | `POST {"estado":"feliz"}` registra un estado de ánimo  |
| `api/db.php`             | Conexión PDO compartida                                |
| `api/config.example.php` | Plantilla de los datos de conexión                     |

### 1. Crear la base en hPanel

**hPanel → Bases de datos → Administración de bases de datos MySQL**: crea una
base y un usuario. Hostinger les añade un prefijo, por ejemplo
`u123456789_coaching` y `u123456789_usuario`. Guarda la contraseña.

### 2. Crear las tablas

En la misma pantalla pulsa **Ingresar a phpMyAdmin** junto a tu base, ve a la
pestaña **Importar**, elige `sql/schema.sql` y pulsa **Continuar**. Se puede
importar más de una vez sin duplicar las tareas iniciales.

### 3. Datos de conexión (`api/config.php`)

Este archivo tiene la contraseña, así que **no está en GitHub**. Elige una opción:

- **Con el despliegue automático**: añade en GitHub (Settings → Secrets and
  variables → Actions) estos secretos y el workflow creará `api/config.php` en
  cada despliegue:

  | Nombre                   | Valor                                 |
  |--------------------------|---------------------------------------|
  | `HOSTINGER_DB_NAME`      | `u123456789_coaching`                 |
  | `HOSTINGER_DB_USER`      | `u123456789_usuario`                  |
  | `HOSTINGER_DB_PASSWORD`  | Contraseña del usuario                |
  | `HOSTINGER_DB_HOST`      | Opcional; por defecto `localhost`     |

- **A mano**: en el **Administrador de archivos** de hPanel, dentro de
  `public_html/api/`, crea `config.php` copiando `config.example.php` y
  rellenando tus datos.

### 4. Comprobar

Abre `https://tudominio.com/api/tareas.php`: debe mostrar la lista de tareas en
JSON. Si ves `No se pudo conectar a la base de datos`, revisa el nombre, el
usuario y la contraseña de `config.php`.

Para ver lo guardado, en phpMyAdmin abre la tabla `estados_animo` o ejecuta:

```sql
SELECT estado, COUNT(*) AS veces FROM estados_animo GROUP BY estado;
```

## Alternativa sin FTP: Git de Hostinger

hPanel también ofrece **Avanzado → Git**: indica la URL del repositorio, la rama
`main` y deja el directorio vacío (`public_html`). Activa el
**despliegue automático** copiando la URL del webhook en
**GitHub → Settings → Webhooks**. Si usas esta opción, desactiva o borra el
workflow de FTP para no desplegar dos veces, y crea `api/config.php` a mano
(el Git de Hostinger no usa los secretos de GitHub).
