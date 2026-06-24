const products = [
  { id: 1, name: "Золотой час", type: "Светлый лагер", category: "light", description: "Мягкий солодовый вкус, луговые травы и чистый финиш.", price: 290, abv: "4.7% · 0.5 л", tag: "Хит", image: "assets/beer-lager.png" },
  { id: 2, name: "Белая ночь", type: "Пшеничное", category: "light", description: "Цитрусовая свежесть, банан и лёгкая пряность.", price: 320, abv: "4.9% · 0.5 л", tag: "", image: "assets/beer-wheat.png" },
  { id: 3, name: "Старый порт", type: "Балтийский портер", category: "dark", description: "Шоколад, жжёный сахар и долгое кофейное послевкусие.", price: 390, abv: "7.2% · 0.5 л", tag: "Выбор пивовара", image: "assets/beer-porter.png" },
  { id: 4, name: "Чёрный мёд", type: "Медовый стаут", category: "dark", description: "Бархатный стаут с гречишным мёдом и какао.", price: 410, abv: "6.5% · 0.5 л", tag: "", image: "assets/beer-stout.png" },
  { id: 5, name: "Таёжный IPA", type: "India Pale Ale", category: "craft", description: "Сосновая хвоя, грейпфрут и яркая хмелевая горечь.", price: 430, abv: "6.2% · 0.5 л", tag: "Новинка", image: "assets/beer-ipa.png" },
  { id: 6, name: "Дикий сад", type: "Вишнёвый эль", category: "craft", description: "Спелая вишня, лёгкая кислинка и сухой финиш.", price: 450, abv: "5.4% · 0.5 л", tag: "Лимитка", image: "assets/beer-cherry.png" },
  { id: 7, name: "Нулевой меридиан", type: "Безалкогольный IPA", category: "zero", description: "Полный хмелевой вкус с нотами манго — и никаких компромиссов.", price: 310, abv: "0.4% · 0.5 л", tag: "", image: "assets/beer-zero-ipa.png" },
  { id: 8, name: "Свободный лагер", type: "Безалкогольный лагер", category: "zero", description: "Свежий, хрустящий и лёгкий — для любого повода.", price: 280, abv: "0.3% · 0.5 л", tag: "", image: "assets/beer-zero-lager.png" }
];

let cart = JSON.parse(localStorage.getItem("beer-cart") || "[]");
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
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
          <div class="product-buy">
            <strong>${formatPrice(product.price)}</strong>
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

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#cartTitleCount").textContent = count;
  $("#cartItems").innerHTML = cart.map(item => {
    const product = item.id === 99
      ? { id: 99, name: "Вечер дегустации", type: "Набор · 6 бутылок", price: 1990 }
      : products.find(product => product.id === item.id);
    return `
      <div class="cart-item">
        <div class="cart-thumb" style="--thumb:url('${product.image || "assets/brewery-hero.png"}')"></div>
        <div>
          <h4>${product.name}</h4>
          <p>${product.type} · ${formatPrice(product.price)}</p>
          <div class="cart-quantity">
            <button data-action="minus" data-id="${item.id}" aria-label="Уменьшить количество">−</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-id="${item.id}" aria-label="Увеличить количество">＋</button>
          </div>
        </div>
        <button class="remove-item" data-action="remove" data-id="${item.id}" aria-label="Удалить товар">×</button>
      </div>`;
  }).join("");

  const total = cart.reduce((sum, item) => {
    const price = item.id === 99 ? 1990 : products.find(product => product.id === item.id).price;
    return sum + price * item.quantity;
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
    const product = item.id === 99
      ? { price: 1990 }
      : products.find(product => product.id === item.id);
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
  const id = Number(button.dataset.id);
  const item = cart.find(item => item.id === id);
  if (button.dataset.action === "plus") item.quantity++;
  if (button.dataset.action === "minus") item.quantity--;
  if (button.dataset.action === "remove" || item.quantity <= 0) cart = cart.filter(item => item.id !== id);
  saveCart();
});

$("[data-add-set]").addEventListener("click", () => addToCart(99));

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
          comment: formData.get("comment")
        },
        website: formData.get("website"),
        items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Не удалось отправить заказ");

    status.className = "checkout-status success";
    status.textContent = `Заказ №${result.orderId} отправлен! Скоро мы вам позвоним.`;
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
