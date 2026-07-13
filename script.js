// Interaktivita pre homepage CardCenter

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initBrandSearch();
  initShowMoreCategories();
  initSortTabs();
  initQtySteppers();
  initCustomAmountInput();
  renderCartBadge();
  initAddToCart();
  initModal();
  initCartPage();
});

// Rozbaľovacie menu pre mobilné zobrazenie
function initMobileNav() {
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navMenu");

  if (!burger || !menu) return;

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  // Zatvorenie menu po kliknutí na ktorýkoľvek odkaz vo vnútri
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// Vyhľadávanie brandov — presun na sekciu a zvýraznenie zhôd
function initBrandSearch() {
  const form = document.querySelector(".search");
  const input = document.querySelector(".search__input");
  const brandCards = document.querySelectorAll(".card--brand, .card--product");

  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim().toLowerCase();

    brandCards.forEach((card) => {
      const name = card.querySelector(".card__name")?.textContent.toLowerCase() ?? "";
      const matches = query === "" || name.includes(query);
      card.style.display = matches ? "" : "none";
    });

    document.getElementById("brands")?.scrollIntoView({ behavior: "smooth" });
  });

  // Rýchly preklik cez štítky populárnych brandov naplní vyhľadávanie
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      input.value = tag.textContent;
    });
  });
}

// Rozbalenie skrytých kategórií vo filtroch (buy.html)
function initShowMoreCategories() {
  const toggle = document.getElementById("showMoreCategories");
  const extraItems = document.querySelectorAll(".checklist__item--extra");

  if (!toggle || extraItems.length === 0) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";

    extraItems.forEach((item) => item.classList.toggle("is-visible", !isExpanded));
    toggle.textContent = isExpanded ? "Show more" : "Show less";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
  });
}

// Rýchle prepínanie medzi kartami zoradenia (buy.html)
function initSortTabs() {
  const tabs = document.querySelectorAll(".sort-tab");
  const otherSelect = document.querySelector(".sort-other__select");

  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
    });
  });

  otherSelect?.addEventListener("change", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
  });
}

// Počítadlá množstva (+ / -) v boxe s cenou (product.html)
function initQtySteppers() {
  document.querySelectorAll("[data-qty-stepper]").forEach((stepper) => {
    const valueEl = stepper.querySelector("[data-qty-value]");
    const decrementBtn = stepper.querySelector("[data-qty-decrement]");
    const incrementBtn = stepper.querySelector("[data-qty-increment]");
    const min = Number(stepper.dataset.min ?? 0);

    if (!valueEl) return;

    decrementBtn?.addEventListener("click", () => {
      valueEl.textContent = String(Math.max(min, Number(valueEl.textContent) - 1));
    });

    incrementBtn?.addEventListener("click", () => {
      valueEl.textContent = String(Number(valueEl.textContent) + 1);
    });
  });
}

// Formátovanie vlastnej sumy na dve desatinné miesta (product.html)
function initCustomAmountInput() {
  const input = document.getElementById("customAmount");
  if (!input) return;

  input.addEventListener("blur", () => {
    const value = parseFloat(input.value.replace(/[^0-9.]/g, "")) || 0;
    input.value = value.toFixed(2);
  });
}

// ==========================================================================
// Košík — počet položiek sa uchováva v localStorage, takže odznak v hlavičke
// zostáva rovnaký naprieč index.html, buy.html aj product.html
// ==========================================================================

const CART_STORAGE_KEY = "cardcenter_cart_count";

function getCartCount() {
  return Number(localStorage.getItem(CART_STORAGE_KEY) || 0);
}

// Prekreslenie odznaku košíka na aktuálnej stránke podľa uloženého počtu
function renderCartBadge() {
  const count = getCartCount();

  document.querySelectorAll("#cartBadge").forEach((badge) => {
    badge.textContent = String(count);
  });

  document.querySelectorAll("#cartTrigger").forEach((trigger) => {
    trigger.setAttribute("aria-label", `View cart, ${count} item${count === 1 ? "" : "s"}`);
  });
}

// Krátka pulzujúca animácia odznaku po pridaní položky
function bumpCartBadge() {
  document.querySelectorAll("#cartBadge").forEach((badge) => {
    badge.classList.remove("is-bumped");
    // Vynútenie reflow, aby sa animácia dala spustiť opakovane za sebou
    void badge.offsetWidth;
    badge.classList.add("is-bumped");
  });
}

function addToCart(quantity) {
  const newCount = getCartCount() + quantity;
  localStorage.setItem(CART_STORAGE_KEY, String(newCount));
  renderCartBadge();
  bumpCartBadge();
}

// Zistí počet kusov na pridanie z aktívneho počítadla, prípadne z vlastnej sumy (product.html)
function getSelectedQuantity() {
  let total = 0;

  const customInput = document.getElementById("customAmount");
  const customAmount = parseFloat(customInput?.value || "0");

  if (customInput && customAmount > 0) {
    const customStepper = customInput.closest(".price-box__row--custom")?.querySelector("[data-qty-stepper]");
    total += Number(customStepper?.querySelector("[data-qty-value]")?.textContent || 1);
  }

  document.querySelectorAll(".price-box__list [data-qty-stepper]").forEach((stepper) => {
    total += Number(stepper.querySelector("[data-qty-value]")?.textContent || 0);
  });

  // Ak používateľ nenastavil žiadne množstvo, pridá sa aspoň 1 kus
  return total || 1;
}

// Kliknutie na "Add to cart" na product.html — pridá položky a otvorí modál
function initAddToCart() {
  const addButton = document.getElementById("addToCartBtn");
  if (!addButton) return;

  const modal = document.getElementById("cartModal");

  addButton.addEventListener("click", () => {
    addToCart(getSelectedQuantity());
    openModal(modal);
  });
}

// ==========================================================================
// Modálne okno s potvrdením pridania do košíka (product.html)
// ==========================================================================

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function initModal() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal(modal);
    }
  });
}

// ==========================================================================
// Stránka košíka (cart.html) — položky, upsell "Frequently Bought Together",
// promo kód a súhrn objednávky, všetko bez znovunačítania stránky
// ==========================================================================

function initCartPage() {
  const cartList = document.getElementById("cartItemsList");
  if (!cartList) return;

  cartList.querySelectorAll("[data-item-qty]").forEach(bindItemStepper);
  cartList.querySelectorAll("[data-remove-item]").forEach(bindRemoveButton);
  initUpsellAdd();
  initPromoForm();
  initCartTimer();
  recalcCartSummary();
}

// Naviaže +/- na jedno počítadlo množstva položky v košíku
function bindItemStepper(stepper) {
  const valueEl = stepper.querySelector("[data-qty-value]");
  const min = Number(stepper.dataset.min ?? 1);
  if (!valueEl) return;

  stepper.querySelector("[data-qty-decrement]")?.addEventListener("click", () => {
    valueEl.textContent = String(Math.max(min, Number(valueEl.textContent) - 1));
    recalcCartSummary();
  });

  stepper.querySelector("[data-qty-increment]")?.addEventListener("click", () => {
    valueEl.textContent = String(Number(valueEl.textContent) + 1);
    recalcCartSummary();
  });
}

// Naviaže odstránenie jednej položky z košíka
function bindRemoveButton(button) {
  button.addEventListener("click", () => {
    button.closest(".cart-item")?.remove();
    recalcCartSummary();
  });
}

// Tlačidlá "+ Add" v sekcii "Frequently Bought Together"
function initUpsellAdd() {
  document.querySelectorAll("[data-upsell-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const upsellItem = button.closest("[data-upsell]");
      if (!upsellItem || button.disabled) return;

      appendUpsellItemToCart(upsellItem);

      button.disabled = true;
      button.textContent = "Added";
      upsellItem.classList.add("is-added");

      addToCart(1);
      recalcCartSummary();
    });
  });
}

// Vytvorí nový riadok košíka z ponúkanej upsell položky a pridá ho do zoznamu
function appendUpsellItemToCart(upsellItem) {
  const name = upsellItem.dataset.name ?? "";
  const face = upsellItem.dataset.face ?? "0";
  const price = upsellItem.dataset.price ?? "0";
  const logo = upsellItem.querySelector(".cart-item__logo")?.textContent ?? "";

  const li = document.createElement("li");
  li.className = "cart-item";
  li.dataset.face = face;
  li.dataset.price = price;
  li.innerHTML = `
    <div class="cart-item__media"><span class="cart-item__logo">${logo}</span></div>
    <div class="cart-item__body">
      <span class="cart-item__name">${name}</span>
      <span class="cart-item__meta">Instant digital delivery &middot; Full balance</span>
    </div>
    <div class="qty-stepper" data-item-qty data-min="1">
      <button type="button" class="qty-stepper__btn" data-qty-decrement aria-label="Decrease quantity">&minus;</button>
      <span class="qty-stepper__value" data-qty-value>1</span>
      <button type="button" class="qty-stepper__btn" data-qty-increment aria-label="Increase quantity">+</button>
    </div>
    <span class="cart-item__price" data-item-price>${formatCurrency(Number(price))}</span>
    <button type="button" class="cart-item__remove" data-remove-item aria-label="Remove item">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  document.getElementById("cartItemsList")?.appendChild(li);
  bindItemStepper(li.querySelector("[data-item-qty]"));
  bindRemoveButton(li.querySelector("[data-remove-item]"));
}

// Prepočíta Subtotal / Discounts / Total a "You saved" v súhrne objednávky
function recalcCartSummary() {
  const items = document.querySelectorAll("#cartItemsList .cart-item");
  let subtotal = 0;
  let priceTotal = 0;

  items.forEach((item) => {
    const face = parseFloat(item.dataset.face || "0");
    const price = parseFloat(item.dataset.price || "0");
    const qty = Number(item.querySelector("[data-qty-value]")?.textContent || 1);

    subtotal += face * qty;
    priceTotal += price * qty;

    const priceEl = item.querySelector("[data-item-price]");
    if (priceEl) priceEl.textContent = formatCurrency(price * qty);
  });

  const promoForm = document.getElementById("promoForm");
  const promoApplied = promoForm?.dataset.promoApplied === "true";
  const total = promoApplied ? priceTotal * 0.9 : priceTotal;
  const discount = subtotal - total;

  setElementText("summarySubtotal", formatCurrency(subtotal));
  setElementText("summaryDiscount", `−${formatCurrency(discount)}`);
  setElementText("summaryTotal", formatCurrency(total));
  setElementText("summarySaved", `You saved ${formatCurrency(discount)} today!`);

  const isEmpty = items.length === 0;
  const emptyState = document.getElementById("cartEmptyState");
  if (emptyState) emptyState.hidden = !isEmpty;

  const checkoutButton = document.querySelector(".btn--checkout");
  if (checkoutButton) checkoutButton.disabled = isEmpty;
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Jednoduchý demo promo kód (SAVE10), ktorý strhne ďalších 10 % z ceny
function initPromoForm() {
  const form = document.getElementById("promoForm");
  const input = document.getElementById("promoInput");
  const feedback = document.getElementById("promoFeedback");

  if (!form || !input || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = input.value.trim().toUpperCase();
    const isValid = code === "SAVE10";

    form.dataset.promoApplied = String(isValid);
    feedback.textContent = isValid
      ? "Promo code applied — extra 10% off your total."
      : "Invalid promo code.";
    feedback.classList.toggle("is-success", isValid);

    recalcCartSummary();
  });
}

// Odpočítavanie rezervácie košíka (čisto vizuálny prvok naliehavosti)
function initCartTimer() {
  const timerEl = document.getElementById("cartTimer");
  if (!timerEl) return;

  let remainingSeconds = 15 * 60;

  const tick = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerEl.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
    if (remainingSeconds > 0) remainingSeconds -= 1;
  };

  tick();
  setInterval(tick, 1000);
}
