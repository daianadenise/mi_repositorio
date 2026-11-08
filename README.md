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

### Alternativa sin FTP: Git de Hostinger

hPanel también ofrece **Avanzado → Git**: indica la URL del repositorio, la rama
`main` y deja el directorio vacío (`public_html`). Activa el
**despliegue automático** copiando la URL del webhook en
**GitHub → Settings → Webhooks**. Si usas esta opción, desactiva o borra el
workflow de FTP para no desplegar dos veces.
