# Actualizador de DNS Dinámico

Este proyecto es un simple actualizador de DNS dinámico que utiliza Node.js y la API de Cloudflare para actualizar automáticamente un registro DNS con tu dirección IP actual y un dominio dinamico creado en cpanel.

## Requisitos Previos

*   Node.js y npm instalados
*   Una cuenta de Cloudflare con un dominio registrado
*   Un token de API de Cloudflare con permisos de edición de DNS
*   El ID de zona de Cloudflare para tu dominio
*   XAMPP instalado
*   **cPanel:** Se utiliza cPanel para crear la URL del dominio dinámico.

## Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone <url_del_repositorio>
    cd dynamic-dns
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install node-fetch
    ```

3.  **Configura el script:**

    *   Edita el archivo `app.js` y reemplaza los siguientes marcadores de posición con tus valores reales:

        *   `zoneId`: Tu ID de zona de Cloudflare
        *   `dnsRecordName`: El nombre del registro DNS que deseas actualizar (por ejemplo, `host.example.com`)
        *   `cloudflareApiToken`: Tu token de API de Cloudflare

4.  **Configura el Host Virtual de Apache:**

    *   Edita el archivo `/opt/lampp/etc/extra/httpd-vhosts.conf` y agrega la siguiente configuración de host virtual:

        ```
        <VirtualHost *:80>
            ServerAdmin webmaster@host.dominio.cl
            DocumentRoot "/opt/lampp/htdocs"
            ServerName host.dominio.cl
            ErrorLog "logs/host.dominio.cl-error_log"
            CustomLog "logs/host.dominio.cl-access_log" common
        </VirtualHost>
        ```

5.  **Configura el Firewall:**

    *   Permite el tráfico TCP y UDP en el puerto 80 usando `ufw`:

        ```bash
        sudo ufw allow 80/tcp
        sudo ufw allow 80/udp
        ```

## Uso

1.  **Ejecuta el script:**

    ```bash
    node app.js
    ```

    Esto iniciará el script y actualizará el registro DNS con tu dirección IP actual.

2.  **Configura un trabajo cron (Opcional):**

    Para actualizar automáticamente la dirección IP cada 5 minutos, puedes configurar un trabajo cron:

    ```bash
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/bin/node /ruta/a/dynamic-dns/app.js >/dev/null 2>&1") | crontab -
    ```

    Reemplaza `/ruta/a/dynamic-dns/app.js` con la ruta real al archivo `app.js`.
