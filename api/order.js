const catalog = {
  1: { name: "Золотой час", price: 290 },
  2: { name: "Белая ночь", price: 320 },
  3: { name: "Старый порт", price: 390 },
  4: { name: "Чёрный мёд", price: 410 },
  5: { name: "Таёжный IPA", price: 430 },
  6: { name: "Дикий сад", price: 450 },
  7: { name: "Нулевой меридиан", price: 310 },
  8: { name: "Свободный лагер", price: 280 },
  99: { name: "Вечер дегустации", price: 1990 }
};

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Разрешены только POST-запросы" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return response.status(500).json({ error: "Telegram ещё не настроен на сервере" });
  }

  const body = request.body || {};
  if (body.website) return response.status(200).json({ orderId: "OK" });

  const customer = body.customer || {};
  const name = clean(customer.name, 60);
  const phone = clean(customer.phone, 30);
  const address = clean(customer.address, 180);
  const comment = clean(customer.comment, 500);

  if (name.length < 2 || phone.length < 6 || address.length < 5) {
    return response.status(400).json({ error: "Проверьте имя, телефон и адрес" });
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
    return response.status(400).json({ error: "Корзина пуста или содержит ошибку" });
  }

  let total = 0;
  let itemCount = 0;
  const lines = [];

  for (const item of body.items) {
    const product = catalog[Number(item.id)];
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return response.status(400).json({ error: "В корзине обнаружен неверный товар" });
    }
    total += product.price * quantity;
    itemCount += quantity;
    lines.push(`• ${escapeHtml(product.name)} × ${quantity} — ${(product.price * quantity).toLocaleString("ru-RU")} ₽`);
  }

  const orderId = Date.now().toString().slice(-6);
  const message = [
    `🍺 <b>Новый заказ №${orderId}</b>`,
    "",
    lines.join("\n"),
    "",
    `<b>Товаров:</b> ${itemCount}`,
    `<b>Итого:</b> ${total.toLocaleString("ru-RU")} ₽`,
    "",
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
    `📍 <b>Адрес:</b> ${escapeHtml(address)}`,
    comment ? `💬 <b>Комментарий:</b> ${escapeHtml(comment)}` : ""
  ].filter(Boolean).join("\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      })
    });

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      console.error("Telegram API error:", telegramError);
      return response.status(502).json({ error: "Telegram не принял заказ. Проверьте настройки бота" });
    }

    return response.status(200).json({ ok: true, orderId });
  } catch (error) {
    console.error("Order API error:", error);
    return response.status(502).json({ error: "Не удалось связаться с Telegram" });
  }
}
