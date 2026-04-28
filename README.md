haunted.gr is now a **Next.js 16** app (SSR) that runs behind **Nginx** on the production server.  
Node.js **≥20.9** is required (`.nvmrc` is set to `v20.11.1`).

## Local development

```bash
nvm use          # reads .nvmrc
npm install
npm run dev      # http://localhost:3000
```


```


```

cd /var/www/haunted.gr

git pull

npm install
npm run build

sudo systemctl restart haunted

sudo nginx -t
sudo systemctl reload nginx

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
