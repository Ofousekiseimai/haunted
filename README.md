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
npm install
npm run build

pm2 start npm --name haunted -- start -- -p 4000
pm2 save
pm2 status
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

## Content entry quick guide

- Σύνδεση άρθρων (εμφάνιση κάτω μέρους): πρόσθεσε `relatedArticles` με `slug`, `title`, προαιρετικά `description`.

```json
"relatedArticles": [
  {
    "slug": "tilekinitika-fainomena-kallithea-1931",
    "title": "Τηλεκινητικά φαινόμενα στην Καλλιθέα (1931)",
    "description": "Εκσφενδονισμοί αντικειμένων σε σπίτι της Καλλιθέας."
  }
]
```

- Επιπλέον εικόνες μέσα στο άρθρο: βάλε block τύπου `image` στη ροή του `content`.

```json
{
  "type": "image",
  "value": {
    "src": "/images/efimerides/foto-reportaz-vithos.webp",
    "alt": "Φωτορεπόρτερ στο Βυθό Κοζάνης (1952)"
  }
}
```

- Δομή ολοκληρωμένου JSON υποκατηγορίας: `category`/`subcategorySlug`/`subcategory`/`slug` ➜ `articles` ➜ `article` πεδία (id, title, slug, date, author, excerpt, locationTags/lat/lng/image/content/relatedArticles/sources/tags) ➜ `seo` (metaTitle/metaDescription/keywords/structuredData κ.λπ.).

- Προσθήκη τοποθεσίας για χάρτη: χρησιμοποίησε `lat`/`lng` στο άρθρο ή πλήρες `location` αντικείμενο.

```json
"lat": 40.3297,
"lng": 21.1093
```

ή

```json
"location": {
  "name": "Βυθός Κοζάνης",
  "region": "Δυτική Μακεδονία",
  "country": "Ελλάδα",
  "lat": 40.3297,
"lng": 21.1093
}
```

## Mailchimp σύνδεση (newsletter)

- Ρύθμισε env vars (π.χ. `.env.local`):

```
NEXT_PUBLIC_MAILCHIMP_FORM_ACTION="https://<dc>.list-manage.com/subscribe/post?u=<user-id>&id=<audience-id>"
NEXT_PUBLIC_MAILCHIMP_HONEYPOT_NAME="b_<user-id>_<audience-id>"   # από το Mailchimp embed
NEXT_PUBLIC_MAILCHIMP_TAGS="haunted-newsletter"
```

- Στο `components/marketing/mailchimp-signup.tsx` άλλαξε το `isVisible` σε `true` για να εμφανιστεί στο footer. Μπορείς να προσαρμόσεις κείμενα/placeholder εκεί.
- Φρόντισε το Mailchimp list να έχει διπλό opt-in και σταθερό From email/domain. Unsubscribe link ρυθμίζεται από το template του Mailchimp.
