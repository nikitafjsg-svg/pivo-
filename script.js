const products = [
  { id: 1, name: "Золотой час", type: "Светлый лагер", category: "light", description: "Мягкий солодовый вкус, луговые травы и чистый финиш.", price: 290, abv: "4.7% · 0.5 л", tag: "Хит", image: "assets/beer-lager.png", stock: 24, taste: { Горечь: 25, Сладость: 45, Плотность: 35 } },
  { id: 2, name: "Белая ночь", type: "Пшеничное", category: "light", description: "Цитрусовая свежесть, банан и лёгкая пряность.", price: 320, abv: "4.9% · 0.5 л", tag: "", image: "assets/beer-wheat.png", stock: 13, taste: { Горечь: 18, Сладость: 58, Плотность: 48 } },
  { id: 3, name: "Старый порт", type: "Балтийский портер", category: "dark", description: "Шоколад, жжёный сахар и долгое кофейное послевкусие.", price: 390, abv: "7.2% · 0.5 л", tag: "Выбор пивовара", image: "assets/beer-porter.png", stock: 7, taste: { Горечь: 55, Сладость: 70, Плотность: 90 } },
  { id: 4, name: "Чёрный мёд", type: "Медовый стаут", category: "dark", description: "Бархатный стаут с гречишным мёдом и какао.", price: 410, abv: "6.5% · 0.5 л", tag: "", image: "assets/beer-stout.png", stock: 4, taste: { Горечь: 62, Сладость: 76, Плотность: 86 } },
  { id: 5, name: "Таёжный IPA", type: "India Pale Ale", category: "craft", description: "Сосновая хвоя, грейпфрут и яркая хмелевая горечь.", price: 360, oldPrice: 430, abv: "6.2% · 0.5 л", tag: "Пиво недели", image: "assets/beer-ipa.png", stock: 9, taste: { Горечь: 92, Сладость: 22, Плотность: 64 } },
  { id: 6, name: "Дикий сад", type: "Вишнёвый эль", category: "craft", description: "Спелая вишня, лёгкая кислинка и сухой финиш.", price: 450, abv: "5.4% · 0.5 л", tag: "Лимитка", image: "assets/beer-cherry.png", stock: 5, taste: { Кислость: 78, Сладость: 60, Плотность: 52 } },
  { id: 7, name: "Нулевой меридиан", type: "Безалкогольный IPA", category: "zero", description: "Полный хмелевой вкус с нотами манго — и никаких компромиссов.", price: 310, abv: "0.4% · 0.5 л", tag: "", image: "assets/beer-zero-ipa.png", stock: 18, taste: { Горечь: 72, Сладость: 32, Плотность: 38 } },
  { id: 8, name: "Свободный лагер", type: "Безалкогольный лагер", category: "zero", description: "Свежий, хрустящий и лёгкий — для любого повода.", price: 280, abv: "0.3% · 0.5 л", tag: "", image: "assets/beer-zero-lager.png", stock: 21, taste: { Горечь: 20, Сладость: 30, Плотность: 25 } },
  { id: 9, name: "Яблочный сухой", type: "Фермерский сидр", category: "alcohol", description: "Свежие яблоки, лёгкая кислинка и сухой игристый финиш.", price: 360, abv: "5.2% · 0.5 л", tag: "Новинка", image: "assets/drink-cider.png", stock: 11, taste: { Кислость: 65, Сладость: 35, Сухость: 82 } },
  { id: 10, name: "Сибирский сет", type: "Набор настоек", category: "alcohol", description: "Клюква и хреновуха — две домашние настойки для яркого вечера.", price: 690, abv: "2 × 100 мл", tag: "Крепкое", image: "assets/drink-tinctures.png", stock: 8, taste: { Крепость: 88, Пряность: 70, Сладость: 42 } },
  { id: 11, name: "Таёжное мясо", type: "Говяжьи джерки", category: "food", description: "Вяленая говядина с копчёной паприкой, перцем и розмарином.", price: 390, abv: "120 г", tag: "Хит", image: "assets/food-jerky.png", stock: 16 },
  { id: 12, name: "Сырная доска", type: "Ассорти сыров", category: "food", description: "Копчёный сыр, выдержанный чеддер, косичка, орехи и мёд.", price: 590, abv: "280 г", tag: "", image: "assets/food-cheese.png", stock: 6 },
  { id: 13, name: "Большой крендель", type: "Баварский брецель", category: "food", description: "Тёплый солёный крендель с горчицей и сырным соусом.", price: 320, abv: "250 г", tag: "", image: "assets/food-pretzel.png", stock: 14 },
  { id: 14, name: "Огненные крылья", type: "Куриные крылья", category: "food", description: "Хрустящие крылья в остром соусе с сельдереем и дипом.", price: 520, abv: "350 г", tag: "Острое", image: "assets/food-wings.png", stock: 9 }
];

let cart = JSON.parse(localStorage.getItem("beer-cart") || "[]");
let packSelection = [];
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function initAgeGate() {
  const gate = $("#ageGate");
  if (localStorage.getItem("beer-age-confirmed") === "yes") return;
  gate.classList.add("open");
  gate.setAttribute("aria-hidden", "false");
  document.body.classList.add("age-locked");
}

$("#ageConfirm").addEventListener("click", () => {
  localStorage.setItem("beer-age-confirmed", "yes");
  $("#ageGate").classList.remove("open");
  $("#ageGate").setAttribute("aria-hidden", "true");
  document.body.classList.remove("age-locked");
});

$("#ageDeny").addEventListener("click", () => {
  $("#ageGate").classList.add("denied");
  $("#ageGateTitle").innerHTML = "Возвращайтесь,<br><em>когда исполнится 18</em>";
});

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function tasteMarkup(taste) {
  if (!taste) return "";
  return `<div class="taste-map">${Object.entries(taste).map(([name, value]) =>
    `<div class="taste-row"><span>${name}</span><div class="taste-track"><i style="width:${value}%"></i></div></div>`
  ).join("")}</div>`;
}

function renderProducts(filter = "all") {
  const grid = $("#productGrid");
  grid.innerHTML = products
    .filter(product => filter === "all" || product.category === filter)
    .map(product => `
      <article class="product-card reveal visible" data-category="${product.category}">
        <div class="product-image" style="--image:url('${product.image}')">
          ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
          <span class="product-abv">${product.abv}</span>
        </div>
        <div class="product-info">
          <span class="product-type">${product.type}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          ${tasteMarkup(product.taste)}
          ${product.stock ? `<span class="stock ${product.stock <= 7 ? "low" : ""}">${product.stock <= 7 ? `Осталось всего ${product.stock}` : `В наличии: ${product.stock}`}</span>` : ""}
          <div class="product-buy">
            <strong>${formatPrice(product.price)} ${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}</strong>
            <button class="buy-button" data-id="${product.id}" aria-label="Добавить ${product.name} в корзину">＋</button>
          </div>
        </div>
      </article>
    `).join("");
}

function saveCart() {
  localStorage.setItem("beer-cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  const product = products.find(item => item.id === id);
  showToast(product?.name || "Дегустационный набор");
}

function getItemProduct(item) {
  if (item.id === 98) {
    return { id: 98, name: "Свой набор из 6", type: item.selections.map(id => products.find(p => p.id === id)?.name).join(", "), price: item.price, image: "assets/brewery-hero.png" };
  }
  if (item.id === 99) return { id: 99, name: "Вечер дегустации", type: "Набор · 6 бутылок", price: 1990, image: "assets/brewery-hero.png" };
  return products.find(product => product.id === item.id);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartTitleCount").textContent = count;
  $("#cartItems").innerHTML = cart.map(item => {
    const product = getItemProduct(item);
    return `
      <div class="cart-item">
        <div class="cart-thumb" style="--thumb:url('${product.image || "assets/brewery-hero.png"}')"></div>
        <div>
          <h4>${product.name}</h4>
          <p>${product.type} · ${formatPrice(product.price)}</p>
          <div class="cart-quantity">
            <button data-action="minus" data-key="${item.key || item.id}" aria-label="Уменьшить количество">−</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-key="${item.key || item.id}" aria-label="Увеличить количество">＋</button>
          </div>
        </div>
        <button class="remove-item" data-action="remove" data-key="${item.key || item.id}" aria-label="Удалить товар">×</button>
      </div>`;
  }).join("");

  const total = cart.reduce((sum, item) => {
    return sum + getItemProduct(item).price * item.quantity;
  }, 0);
  $("#cartTotal").textContent = formatPrice(total);
}

function openCart() {
  document.body.classList.add("cart-open", "no-scroll");
}

function closeCart() {
  document.body.classList.remove("cart-open", "no-scroll");
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = getItemProduct(item);
    return sum + product.price * item.quantity;
  }, 0);
}

function openCheckout() {
  if (!cart.length) return;
  closeCart();
  $("#checkoutTotal").textContent = formatPrice(getCartTotal());
  $("#checkoutStatus").textContent = "";
  $("#checkoutModal").classList.add("open");
  $("#checkoutModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  setTimeout(() => $("#checkoutForm [name='name']").focus(), 250);
}

function closeCheckout() {
  $("#checkoutModal").classList.remove("open");
  $("#checkoutModal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

let toastTimer;
function showToast(name) {
  $("#toastName").textContent = name;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2400);
}

renderProducts();
renderCart();
initAgeGate();

$("#productGrid").addEventListener("click", event => {
  const button = event.target.closest(".buy-button");
  if (button) addToCart(Number(button.dataset.id));
});

$(".filters").addEventListener("click", event => {
  const filter = event.target.closest(".filter");
  if (!filter) return;
  $$(".filter").forEach(item => item.classList.remove("active"));
  filter.classList.add("active");
  renderProducts(filter.dataset.filter);
});

$("#cartButton").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
$("#emptyShop").addEventListener("click", () => {
  closeCart();
  $("#catalog").scrollIntoView();
});

$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const key = button.dataset.key;
  const item = cart.find(item => String(item.key || item.id) === key);
  if (button.dataset.action === "plus") item.quantity++;
  if (button.dataset.action === "minus") item.quantity--;
  if (button.dataset.action === "remove" || item.quantity <= 0) cart = cart.filter(entry => entry !== item);
  saveCart();
});

$("[data-add-set]").addEventListener("click", () => addToCart(99));
$("[data-weekly-add]").addEventListener("click", () => addToCart(5));

function renderPackOptions() {
  const beers = products.filter(product => product.id <= 8);
  $("#packOptions").innerHTML = beers.map(product => {
    const count = packSelection.filter(id => id === product.id).length;
    return `<button class="pack-option ${count ? "selected" : ""}" data-pack-id="${product.id}">
      <img src="${product.image}" alt=""><strong>${product.name}</strong><span>${formatPrice(product.price)}</span><b>${count || "✓"}</b>
    </button>`;
  }).join("");
  $("#packCount").textContent = `${packSelection.length} из 6`;
  $("#packBar").style.width = `${packSelection.length / 6 * 100}%`;
  const total = Math.round(packSelection.reduce((sum, id) => sum + products.find(p => p.id === id).price, 0) * .9);
  $("#packTotal").textContent = formatPrice(total);
  $("#addPack").disabled = packSelection.length !== 6;
}

$("#openPack").addEventListener("click", () => {
  packSelection = [];
  renderPackOptions();
  $("#packModal").classList.add("open");
  document.body.classList.add("no-scroll");
});

$$("[data-pack-close]").forEach(element => element.addEventListener("click", () => {
  $("#packModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}));

$("#packOptions").addEventListener("click", event => {
  const option = event.target.closest("[data-pack-id]");
  if (!option || packSelection.length >= 6) return;
  packSelection.push(Number(option.dataset.packId));
  renderPackOptions();
});

$("#resetPack").addEventListener("click", () => {
  packSelection = [];
  renderPackOptions();
});

$("#addPack").addEventListener("click", () => {
  const price = Math.round(packSelection.reduce((sum, id) => sum + products.find(p => p.id === id).price, 0) * .9);
  cart.push({ id: 98, key: `pack-${Date.now()}`, quantity: 1, selections: [...packSelection], price });
  saveCart();
  $("#packModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
  showToast("Свой набор из 6");
});

$("#checkoutButton").addEventListener("click", openCheckout);

$$("[data-checkout-close]").forEach(button => button.addEventListener("click", closeCheckout));

$("#checkoutForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector(".checkout-submit");
  const status = $("#checkoutStatus");
  const formData = new FormData(form);

  button.disabled = true;
  button.innerHTML = "Отправляем…";
  status.className = "checkout-status";
  status.textContent = "";

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: formData.get("name"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          comment: formData.get("comment"),
          deliveryDate: formData.get("deliveryDate"),
          deliveryTime: formData.get("deliveryTime")
        },
        website: formData.get("website"),
        items: cart.map(item => ({ id: item.id, quantity: item.quantity, selections: item.selections, price: item.price }))
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось отправить заказ");

    status.className = "checkout-status success";
    status.textContent = `Заказ №${result.orderId} отправлен! Скоро мы вам позвоним.`;
    localStorage.setItem("last-beer-order", result.orderId);
    cart = [];
    saveCart();
    form.reset();
    setTimeout(closeCheckout, 2600);
  } catch (error) {
    status.className = "checkout-status error";
    status.textContent = error.message === "Failed to fetch"
      ? "Сайт пока не подключён к Telegram. Проверьте настройки Vercel."
      : error.message;
  } finally {
    button.disabled = false;
    button.innerHTML = "Отправить заказ <span>→</span>";
  }
});

$("#menuButton").addEventListener("click", () => {
  $("#nav").classList.toggle("open");
});

$$(".nav a").forEach(link => link.addEventListener("click", () => $("#nav").classList.remove("open")));

$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const original = button.innerHTML;
  button.innerHTML = "Сообщение отправлено <span>✓</span>";
  event.currentTarget.reset();
  setTimeout(() => button.innerHTML = original, 3000);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

$$(".reveal").forEach(element => observer.observe(element));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
  }
});

function updateWeeklyTimer() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  end.setHours(0, 0, 0, 0);
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  $("#weeklyTimer").textContent = `${days}д ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}
updateWeeklyTimer();
setInterval(updateWeeklyTimer, 1000);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$("#deliveryDate").min = tomorrow.toISOString().split("T")[0];

const qrUrl = location.href.split("#")[0];
$("#siteQr").src = `https://api.qrserver.com/v1/create-qr-code/?size=380x380&data=${encodeURIComponent(qrUrl)}`;

$("#trackingForm").addEventListener("submit", event => {
  event.preventDefault();
  const number = $("#trackingInput").value.trim();
  const saved = localStorage.getItem("last-beer-order");
  const result = $("#trackingResult");
  result.classList.add("show");
  if (!number || number !== saved) {
    result.querySelector("strong").textContent = "Заказ не найден";
    result.querySelector("p").textContent = "Проверьте номер или позвоните нам — поможем найти заказ.";
  } else {
    result.querySelector("strong").textContent = "Заказ принят";
    result.querySelector("p").textContent = "Менеджер свяжется с вами и подтвердит доставку.";
  }
});
