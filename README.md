# SAAR Aroma — Complete Cleaning Combo (Landing Site)

A minimal, single-page static website for **SAAR Aroma** cleaning products (India / INR). Highlights the **₹299 Complete Cleaning Combo** of 4 products — Rose Fresh Hand Wash, Active Dish Wash, Power Toilet Cleaner, and Sparkle Floor Cleaner — with a daily-rotating offer and an order/enquiry form that sends straight to WhatsApp or email. No backend or build tools required.

## Files
- `index.html` — page structure (hero, combo offer, products, why-us, order form, care bar)
- `styles.css` — SAAR Aroma purple + gold branding (responsive)
- `script.js` — daily offers, combo savings, product pricing, form handling
- `assets/combo.jpg` — **add your poster image here** (shows as the hero)

## Add your poster
Save the SAAR Aroma combo poster as `assets/combo.jpg`. It appears automatically in the hero. If missing, a placeholder shows and the page still works.

## Combo offer (highlighted)
The combo is the centerpiece. Its strikethrough price and savings are computed automatically from the individual product prices vs. `CONFIG.comboPrice`. Change the combo price in `script.js`:

```js
const CONFIG = {
  whatsappNumber: "919999999999", // your number, international format, no "+" or spaces
  email: "hello@saararoma.example",
  comboPrice: 299,                // ₹ combo price
  currency: "₹",                  // INR
};
```

## How the daily offer works
`script.js` computes a day index from the current date and picks one offer from the `OFFERS` array. The same offer shows all day and automatically changes the next day. Discounts apply live to the matching product card.

## Edit products / offers
Update `PRODUCTS` (names, sizes, ₹ prices) and `OFFERS` in `script.js`. Update the WhatsApp number and email in the footer of `index.html` too.

## Run locally
Open `index.html` directly, or serve it:

```bash
python -m http.server 8000   # visit http://localhost:8000
```

## Deploy
Drop the files on any static host (GitHub Pages, Netlify, Vercel, or any web server).

## Notes
- All pricing is in **INR (₹)**.
- Orders/enquiries are **not stored** — they open a pre-filled WhatsApp chat or email draft (with delivery address) that the customer sends. For automated orders to a sheet/inbox, add a form service (e.g. Formspree) or a backend.
