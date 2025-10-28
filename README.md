haunted.gr is now a **Next.js 16** app (SSR) that runs behind **Nginx** on the production server.  
Node.js **≥20.9** is required (`.nvmrc` is set to `v20.11.1`).

## Local development

```bash
nvm use          # reads .nvmrc
npm install
npm run dev      # http://localhost:3000
```


```

## Update flow (SSH)

```bash
cd /var/www/haunted.gr
source ~/.nvm/nvm.sh
nvm use 20.11.1
git pull
npm ci            # only if dependencies changed
npm run build
pm2 restart haunted
pm2 save
```

If Nginx config changed:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Useful checks:

```bash
pm2 list
pm2 logs haunted --lines 50
ss -ltnp | grep :4000    # verify the port listener
```

## Optional helper script

You can drop something like this in `/var/www/haunted.gr/deploy.sh` and run it after each push:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd /var/www/haunted.gr
source ~/.nvm/nvm.sh
nvm use 20.11.1

git pull
npm run build
pm2 restart haunted
pm2 save

if [ -f /etc/nginx/sites-enabled/haunted.gr.conf ]; then
  sudo nginx -t && sudo systemctl reload nginx
fi
```

Make it executable with `chmod +x deploy.sh`.
