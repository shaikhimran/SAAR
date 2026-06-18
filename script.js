/* ============================================================
   SAAR Aroma — Complete Cleaning Combo — landing page logic
   - Daily-rotating offers (deterministic, changes once per day)
   - Combo price + savings calculated from product prices
   - Product rendering with today's discount applied
   - Order / Enquiry via WhatsApp or Email (no backend needed)
   ============================================================ */

// ---- CONFIG: update these for the real business ----
const CONFIG = {
  whatsappNumber: "917558692892",        // international format, no "+" or spaces
  email: "shkemran@gmail.com",
  comboPrice: 299,                        // ₹ combo price for all 4 products
  currency: "₹",
};

// The four products (regular prices in ₹)
const PRODUCTS = [
  {
    id: "handwash",
    name: "Rose Fresh Hand Wash",
    emoji: "🌹",
    bg: "#fde3ef",
    size: "250 ml",
    desc: "Soft on hands, tough on germs. Long-lasting rose fragrance.",
    price: 99,
  },
  {
    id: "dishwash",
    name: "Active Dish Wash",
    emoji: "🍋",
    bg: "#fdf6cf",
    size: "250 ml",
    desc: "Lemon Power — tough on grease, gentle on hands.",
    price: 89,
  },
  {
    id: "toilet",
    name: "Power Toilet Cleaner",
    emoji: "🚽",
    bg: "#dce7fb",
    size: "500 ml",
    desc: "10x cleaning power. Thick formula, fresh fragrance, kills germs.",
    price: 129,
  },
  {
    id: "floor",
    name: "Sparkle Floor Cleaner",
    emoji: "🌸",
    bg: "#fde3ef",
    size: "500 ml",
    desc: "3x cleaning power. Clean, shine & freshness — safe on all floors.",
    price: 119,
  },
];

// Pool of daily offers. One is shown each day, rotating by date.
const OFFERS = [
  { text: "🎉 Combo @ ₹299 — that's 30%+ OFF all 4 products today!", discount: 0.00, target: "combo" },
  { text: "🌹 20% OFF Rose Fresh Hand Wash today!", discount: 0.20, target: "handwash" },
  { text: "🍋 15% OFF Active Dish Wash — today only!", discount: 0.15, target: "dishwash" },
  { text: "🚽 25% OFF Power Toilet Cleaner today!", discount: 0.25, target: "toilet" },
  { text: "🌸 22% OFF Sparkle Floor Cleaner today!", discount: 0.22, target: "floor" },
  { text: "🔥 Flat 10% OFF everything today!", discount: 0.10, target: "all" },
  { text: "🚚 Free delivery on the ₹299 combo today!", discount: 0.00, target: "combo" },
];

// Day index since epoch — same offer all day, new one tomorrow.
function dayIndex() {
  const now = new Date();
  const utcMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(utcMidnight / 86400000);
}

const todaysOffer = OFFERS[dayIndex() % OFFERS.length];

function discountFor(productId) {
  if (todaysOffer.target === "all" || todaysOffer.target === productId) {
    return todaysOffer.discount;
  }
  return 0;
}

function money(n) {
  return CONFIG.currency + n.toFixed(0);
}

// ---- Offer banner ----
document.getElementById("offerText").textContent = todaysOffer.text;

// ---- Combo savings (from real product prices) ----
const comboTotal = PRODUCTS.reduce((sum, p) => sum + p.price, 0);
const comboSaving = comboTotal - CONFIG.comboPrice;
document.getElementById("comboStrike").textContent = money(comboTotal);
document.getElementById("comboSave").textContent = "SAVE " + money(comboSaving);

// ---- Render products ----
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map((p) => {
    const d = discountFor(p.id);
    const finalPrice = p.price * (1 - d);
    const badge = d > 0 ? `<span class="deal-badge">-${Math.round(d * 100)}%</span>` : "";
    const priceHtml = d > 0
      ? `<span class="price">${money(finalPrice)}</span><span class="price-old">${money(p.price)}</span>`
      : `<span class="price">${money(p.price)}</span>`;
    return `
      <article class="product-card">
        ${badge}
        <div class="product-emoji" style="background:${p.bg}">${p.emoji}</div>
        <h3>${p.name}</h3>
        <span class="size">${p.size}</span>
        <p>${p.desc}</p>
        <div class="price-row">${priceHtml}</div>
        <a href="#order" class="btn btn-sm" data-product="${p.name}">Order Now</a>
      </article>`;
  }).join("");
}
renderProducts();

// ---- Pre-select product when any "Order" button (incl. combo) is clicked ----
document.querySelectorAll("[data-product]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sel = document.getElementById("product");
    const val = btn.dataset.product;
    if ([...sel.options].some((o) => o.value === val)) sel.value = val;
  });
});

// ---- Form handling ----
const form = document.getElementById("orderForm");
const note = document.getElementById("formNote");

function buildMessage() {
  const f = form.elements;
  return [
    `*New ${f.type.value} — SAAR Aroma*`,
    `Name: ${f.name.value}`,
    `Phone: ${f.phone.value}`,
    `Product: ${f.product.value}`,
    `Quantity: ${f.qty.value}`,
    f.address.value ? `Address: ${f.address.value}` : null,
    f.message.value ? `Message: ${f.message.value}` : null,
    `Today's offer: ${todaysOffer.text}`,
  ].filter(Boolean).join("\n");
}

function validate() {
  const f = form.elements;
  if (!f.name.value.trim() || !f.phone.value.trim()) {
    note.textContent = "Please enter your name and phone number.";
    note.className = "form-note error";
    return false;
  }
  note.textContent = "";
  note.className = "form-note";
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;
  const text = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${text}`, "_blank");
  note.textContent = "Opening WhatsApp… complete sending there to confirm.";
  note.className = "form-note ok";
});

document.getElementById("emailBtn").addEventListener("click", () => {
  if (!validate()) return;
  const subject = encodeURIComponent(`${form.elements.type.value} — SAAR Aroma`);
  const body = encodeURIComponent(buildMessage());
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  note.textContent = "Opening your email app…";
  note.className = "form-note ok";
});

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();
