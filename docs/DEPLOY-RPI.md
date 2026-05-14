# 🥧 Despliegue en Raspberry Pi

Guía paso a paso para desplegar el e-commerce en una Raspberry Pi (3B+, 4 o 5).
El backend es Supabase en la nube, así que el Pi solo sirve los archivos estáticos del frontend.

## 📋 Pre-requisitos

- Raspberry Pi con Raspberry Pi OS instalado (Lite o Desktop, da igual)
- Acceso por SSH o teclado/monitor
- Conexión a internet en el Pi
- Una IP local (idealmente fija) para acceder desde la red

```bash
# Verificar tu IP local en el Pi
hostname -I
```

## ⚠️ ¿Por qué Nginx y no `npm run dev`?

Vite dev server está pensado para desarrollo, no para producción. En un hackatón funcionaría a corto plazo, pero:
- Consume mucha más RAM/CPU (problemático en Pi 3 o 4 con 2GB)
- No optimiza ni cachea agresivamente
- Recarga en caliente añade sobrecarga innecesaria

La estrategia correcta es **build estático servido por Nginx**: una sola vez compilas, y luego sirves archivos estáticos. Es lo que escala bien en hardware modesto.

## 🛠️ Estrategia A: Build en tu portátil, copiar al Pi (RECOMENDADO en hackatón)

Esto es **5-10× más rápido** que compilar en el Pi y casi siempre lo que querrás en un hackatón.

### 1. En tu portátil (donde tienes el repo)

```bash
# Asegúrate de tener .env con las claves de Supabase
cat .env
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...

# Build de producción
npm run build

# Esto genera dist/ con HTML, CSS y JS minificados (~200-400 KB total)
ls dist/
```

### 2. Copiar al Pi por SCP

```bash
# Reemplaza pi@192.168.1.50 por tu user@IP
scp -r dist/* pi@192.168.1.50:/tmp/dist/
```

### 3. En el Pi, mover a Nginx

```bash
ssh pi@192.168.1.50

# Asegurar Nginx instalado
sudo apt update && sudo apt install -y nginx

# Mover los archivos al directorio público
sudo rm -rf /var/www/html/*
sudo cp -r /tmp/dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

### 4. Configurar Nginx para SPA (importante!)

React Router usa rutas del lado cliente. Sin esta config, recargar `/productos` da 404.

```bash
sudo nano /etc/nginx/sites-available/default
```

Reemplaza el bloque `server` por:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # Cache agresiva para assets estáticos (Vite ya añade hash al filename)
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA fallback: TODA ruta no existente cae en index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Compresión gzip (ahorra ~70% de transferencia)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}
```

### 5. Recargar Nginx

```bash
sudo nginx -t                 # validar config
sudo systemctl reload nginx   # aplicar sin downtime
```

### 6. Probar

Desde cualquier dispositivo en la misma red:

```
http://<IP-DEL-PI>/
```

Navega entre páginas y recarga para confirmar que el SPA fallback funciona.

---

## 🛠️ Estrategia B: Build directamente en el Pi

Solo úsala si **no puedes** compilar en otra máquina. En Pi 4 (4GB+) tarda ~2-3 min, en Pi 3 puede tardar 10+ min.

### 1. Instalar Node 20 en el Pi

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
node -v   # verificar
```

### 2. Clonar y configurar

```bash
cd ~
git clone <url-de-tu-repo> ecommerce
cd ecommerce
cp .env.example .env
nano .env  # rellenar con tus claves de Supabase
```

### 3. Build

```bash
# Aumenta memoria si el build se cae por OOM (típico en Pi 3)
NODE_OPTIONS=--max-old-space-size=2048 npm ci
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

### 4. Mover a Nginx y configurar

```bash
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
# Configurar Nginx igual que en la Estrategia A, paso 4
sudo systemctl reload nginx
```

---

## 🔧 Troubleshooting

### "Recargo `/productos` y me da 404"
La config de `try_files` no se aplicó. Verifica que editaste `/etc/nginx/sites-available/default` y recargaste con `sudo systemctl reload nginx`.

### "Pantalla en blanco después de cargar"
Abre la consola del navegador (F12). Lo más habitual:
- **Error CORS contra Supabase**: en Supabase → Settings → API → URL Configuration añade `http://<IP-DEL-PI>` a "Site URL" y a "Additional Redirect URLs"
- **Variables de entorno vacías**: el build se hizo sin `.env`. Repite el `npm run build` con el `.env` configurado y vuelve a copiar `dist/`.

### "El build se cae con `JavaScript heap out of memory`"
Estás en un Pi con poca RAM. Opciones:
1. Activa swap: `sudo dphys-swapfile swapoff && sudo nano /etc/dphys-swapfile` → poner `CONF_SWAPSIZE=2048` → `sudo dphys-swapfile setup && sudo dphys-swapfile swapon`
2. O usa la Estrategia A (build en tu portátil)

### "No puedo acceder desde otro dispositivo"
- Verifica firewall: `sudo ufw status` — si está activo, `sudo ufw allow 80`
- Verifica IP: `hostname -I`
- Prueba un ping desde el otro dispositivo

### "Quiero acceder por dominio en lugar de IP"
Hay dos rutas:
1. **Local**: edita `/etc/hosts` en los dispositivos cliente con `192.168.1.X tienda.local`
2. **Internet**: usa Cloudflare Tunnel (`cloudflared`) o ngrok para exponer el Pi sin abrir puertos del router. Para un hackatón, ngrok es lo más rápido:
   ```bash
   curl -fsSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc > /dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   ngrok http 80
   ```

---

## 🚀 Workflow durante el hackatón

Cuando hagas cambios, lo más rápido es:

**En tu portátil:**
```bash
npm run build && scp -r dist/* pi@<IP>:/tmp/dist/
```

**En el Pi (una sola vez deja este alias en `.bashrc`):**
```bash
alias deploy='sudo rm -rf /var/www/html/* && sudo cp -r /tmp/dist/* /var/www/html/ && sudo chown -R www-data:www-data /var/www/html && echo "✓ Deploy hecho"'
```

Luego cada deploy es: build en portátil → scp → `deploy` en el Pi. ~30 segundos.

## ✅ Checklist demo-day

- [ ] Pi conectado a la misma red WiFi que los jueces (o tethering del móvil)
- [ ] IP del Pi anotada y mostrada en pantalla / QR code para acceso rápido
- [ ] Supabase con "Site URL" apuntando a esa IP
- [ ] Datos seed cargados (productos, métodos de envío)
- [ ] Usuario admin promovido con `UPDATE profiles SET role = 'admin' WHERE email = ...`
- [ ] Probado el flujo completo: catálogo → carrito → checkout → orden en admin
- [ ] Probado responsive desde móvil
