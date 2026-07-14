// Interaktivita pre homepage CardCenter

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initBrandSearch();
  initShowMoreCategories();
  initCategorySearch();
  initCatalogPreselect();
  initSortTabs();
  initQtySteppers();
  initCustomAmountInput();
  renderCartBadge();
  initAddToCart();
  initModal();
  initAuthModal();
  initCartPage();
  initProfileBadge();
  initPaymentFlow();
  initFaqSearch();
  initProfilePage();
  initOrderDetail();
  initAlerts();
  initSettings();
  initPasswordEye();
  initSearchBy();
  initPaymentDiscount();
  initBulkModal();
  initSellModal();
  initPayAccordion();
});

// Katalóg (buy.html) — zmena platobnej metódy prepočíta „Save up to X%" na kartách.
// Základná hodnota = maximum ("Any"); konkrétne metódy ju upravia.
function initPaymentDiscount() {
  const select = document.getElementById("paymentFilter");
  if (!select) return;
  const badges = document.querySelectorAll(".card--product__badge");
  if (!badges.length) return;

  // Uložíme si pôvodné (základné) percento z každého badge
  badges.forEach((b) => {
    const m = b.textContent.match(/(\d+)/);
    b.dataset.base = m ? m[1] : "0";
  });

  // Posun oproti základu podľa metódy (crypto najlepšie, debit najmenej)
  const offsets = { "": 0, crypto: 0, bank: -1, paypal: -2, credit: -3, debit: -4 };

  function apply() {
    const off = offsets[select.value] ?? 0;
    badges.forEach((b) => {
      const val = Math.max(1, Number(b.dataset.base) + off);
      b.textContent = `Save up to ${val}%`;
    });
  }

  select.addEventListener("change", apply);
}

// Biznis banner (index.html) — modal s kontaktným formulárom pre bulk objednávky
function initBulkModal() {
  const modal = document.getElementById("bulkModal");
  const cta = document.getElementById("bulkCta");
  if (!modal || !cta) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  cta.addEventListener("click", open);
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-bulk-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  const form = document.getElementById("bulkForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("bulkContent").innerHTML =
        '<h2 class="smodal__title">Thanks — we\'ll be in touch</h2>' +
        '<p class="smodal__text">Our sales team will reach out within one business day.</p>' +
        '<div class="smodal__actions"><button type="button" class="pill-btn" data-bulk-close>Close</button></div>';
    });
  }
}

// Accordion platobných metód (checkout.html) — výber metódy rozbalí jej formulár
function initPayAccordion() {
  const acc = document.getElementById("payAccordion");
  if (!acc) return;
  acc.querySelectorAll("[data-pay-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const opt = btn.closest("[data-pay-opt]");
      acc.querySelectorAll("[data-pay-opt]").forEach((o) => {
        o.classList.toggle("is-open", o === opt);
      });
    });
  });
}

// Selling program (sell.html) — modal s kontaktným formulárom
function initSellModal() {
  const modal = document.getElementById("sellModal");
  if (!modal) return;

  const open = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll("[data-sell-open]").forEach((btn) => btn.addEventListener("click", open));
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-sell-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  const form = document.getElementById("sellForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("sellModalContent").innerHTML =
        '<h2 class="smodal__title">Thanks — we\'ll be in touch</h2>' +
        '<p class="smodal__text">Our team will review your request and reach out within one business day.</p>' +
        '<div class="smodal__actions"><button type="button" class="pill-btn" data-sell-close>Close</button></div>';
    });
  }
}

// Sekcia "Search by" (index.html) — prepínanie medzi kategóriami a brandmi
function initSearchBy() {
  const tabs = document.querySelectorAll("[data-search-tab]");
  if (!tabs.length) return;
  const panels = document.querySelectorAll("[data-search-panel]");

  function show(key) {
    tabs.forEach((t) => {
      const on = t.dataset.searchTab === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    panels.forEach((p) => {
      p.hidden = p.dataset.searchPanel !== key;
    });
  }

  tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.searchTab)));

  // Kliknutie na brand tag v hero prepne rovno na panel Brand
  document.querySelectorAll('a.tag[href="#brands"]').forEach((a) => {
    a.addEventListener("click", () => show("brand"));
  });
}

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

// Predvýber v katalógu (buy.html) podľa ?category= / ?brand= z homepage.
// Kategóriu zaškrtne vo filtri, značku vyplní do vyhľadávania a odfiltruje karty.
function initCatalogPreselect() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const brand = params.get("brand");
  if (!category && !brand) return;

  // Kategória → zaškrtne zodpovedajúci checkbox (aj skrytú „extra" odhalí)
  if (category) {
    const list = document.getElementById("categoryList");
    if (list) {
      const wanted = category.trim().toLowerCase();
      list.querySelectorAll(".checklist__item").forEach((item) => {
        const label = item.textContent.trim().toLowerCase();
        if (label.startsWith(wanted)) {
          const cb = item.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = true;
          item.classList.add("is-visible");
        }
      });
    }
  }

  // Značka → vyplní hlavné vyhľadávanie a spustí filtrovanie kariet
  if (brand) {
    const input = document.querySelector(".search__input");
    const form = document.querySelector(".search");
    if (input && form) {
      input.value = brand;
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }
}

// Živé vyhľadávanie v zozname kategórií (buy.html)
function initCategorySearch() {
  const input = document.getElementById("categorySearch");
  const list = document.getElementById("categoryList");
  const toggle = document.getElementById("showMoreCategories");
  if (!input || !list) return;

  const items = Array.from(list.querySelectorAll(".checklist__item"));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();

    // Prázdne pole — obnovíme predvolený (zbalený) stav
    if (q === "") {
      items.forEach((it) => {
        it.style.display = "";
        it.classList.remove("is-visible");
      });
      if (toggle) {
        toggle.hidden = false;
        toggle.textContent = "Show more";
        toggle.setAttribute("aria-expanded", "false");
      }
      return;
    }

    // Filtrovanie — zobrazíme aj zhodné skryté (extra) kategórie
    items.forEach((it) => {
      const matches = it.textContent.trim().toLowerCase().includes(q);
      if (matches) {
        it.style.display = "";
        if (it.classList.contains("checklist__item--extra")) it.classList.add("is-visible");
      } else {
        it.style.display = "none";
      }
    });
    if (toggle) toggle.hidden = true;
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

// Vyprázdnenie košíka — po úspešnom nákupe vynulujeme počet položiek
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  renderCartBadge();
}

// Zistí počet kusov na pridanie z aktívneho počítadla, prípadne z vlastnej sumy (product.html)
function getSelectedQuantity() {
  let total = 0;

  const customInput = document.getElementById("customAmount");
  const customAmount = parseFloat(customInput?.value || "0");

  if (customInput && customAmount > 0) {
    const customStepper = customInput.closest(".price-box__custom")?.querySelector("[data-qty-stepper]");
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
// Autentifikačný modál (cart.html) — plynulé prepínanie Login / Sign Up
// ==========================================================================

// Markup prihlasovacieho modálu (login / sign up) — vkladá sa na stránky,
// ktoré ho ešte nemajú, aby „Login" v menu fungoval všade rovnako
const AUTH_MODAL_HTML = `
  <div class="modal modal--auth" id="authModal" data-auth-mode="login" aria-hidden="true">
    <div class="modal__overlay" data-modal-close></div>
    <div class="modal__box auth" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <button type="button" class="modal__close" data-modal-close aria-label="Close">&times;</button>

      <div class="auth__header">
        <span class="auth__lock" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="#fff" stroke-width="1.7"/>
            <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </span>
        <h2 id="authTitle" class="auth__title">Log in or create an account</h2>
        <p class="auth__text">Sign in to track your orders, manage alerts and unlock exclusive rewards. New here? Create an account in seconds.</p>
      </div>

      <div class="auth__toggle" role="tablist" aria-label="Authentication mode">
        <button type="button" class="auth__toggle-btn is-active" data-auth-switch="login" role="tab" aria-selected="true">Login</button>
        <button type="button" class="auth__toggle-btn" data-auth-switch="signup" role="tab" aria-selected="false">Sign Up</button>
      </div>

      <form class="auth-form" id="authForm" novalidate>
        <label class="field auth-field auth-signup-field">
          <span>Name</span>
          <input type="text" name="name" placeholder="Your full name" autocomplete="name">
        </label>

        <label class="field auth-field">
          <span>Email</span>
          <input type="email" name="email" placeholder="you@email.com" autocomplete="email">
        </label>

        <label class="field auth-field auth-signup-field">
          <span>Phone Number</span>
          <input type="tel" name="phone" placeholder="+1 (555) 000-0000" autocomplete="tel">
          <span class="field__hint">We'll use this number to help keep your account secure by sending verification texts or calls when needed.</span>
        </label>

        <label class="field auth-field">
          <span>Password</span>
          <div class="pwd-field">
            <input type="password" name="password" placeholder="••••••••" autocomplete="current-password">
            <button type="button" class="pwd-toggle" data-pwd-toggle aria-label="Show password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>
            </button>
          </div>
        </label>

        <a href="#" class="auth__forgot auth-login-field">Forgot password?</a>

        <label class="field auth-field auth-signup-field">
          <span>Confirm Password</span>
          <div class="pwd-field">
            <input type="password" name="confirmPassword" placeholder="••••••••" autocomplete="new-password">
            <button type="button" class="pwd-toggle" data-pwd-toggle aria-label="Show password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>
            </button>
          </div>
        </label>

        <label class="auth-check auth-signup-field">
          <input type="checkbox" name="notifications">
          <span class="auth-check__box" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5L9.5 17L19 7.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="auth-check__label">Send me email alerts when new deals are posted</span>
        </label>

        <label class="field auth-field auth-signup-field">
          <span>Referred by</span>
          <input type="text" name="referredBy" placeholder="Friend, social media, search…">
          <span class="field__hint">Please tell us how you heard about CardCenter.</span>
        </label>

        <button type="submit" class="auth__submit" id="authSubmit">Log In &amp; Continue</button>
      </form>

      <p class="auth__legal">By continuing you agree to our Terms of Service and Privacy Policy.</p>

      <div class="auth-verify" aria-hidden="true">
        <span class="auth__lock" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-3Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <h2 class="auth__title">Account Verification</h2>
        <p class="auth__text">To ensure maximum security and protect your digital assets, we require a quick verification setup. This adds an extra layer of protection to your account and prevents unauthorized access.</p>

        <div class="auth-qr" aria-hidden="true">
          <div class="auth-qr__grid">
            <span class="auth-qr__eye auth-qr__eye--tl"></span>
            <span class="auth-qr__eye auth-qr__eye--tr"></span>
            <span class="auth-qr__eye auth-qr__eye--bl"></span>
          </div>
        </div>

        <button type="button" class="auth__submit" id="authVerifyBtn">Continue</button>
      </div>
    </div>
  </div>`;

// Ak stránka nemá prihlasovací modál, vložíme ho do DOM
function ensureAuthModal() {
  if (document.getElementById("authModal")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = AUTH_MODAL_HTML.trim();
  document.body.appendChild(wrap.firstElementChild);
}

function initAuthModal() {
  ensureAuthModal();
  const modal = document.getElementById("authModal");
  if (!modal) return;

  // Kontext otvorenia: "nav" (z menu) alebo "checkout" (z tlačidla v košíku)
  let openContext = "nav";

  const box = modal.querySelector(".modal__box");
  const submitBtn = modal.querySelector("#authSubmit");
  // Polia, ktoré patria iba do registrácie — v režime prihlásenia ich vypneme,
  // aby neboli fokusovateľné ani validované, keď sú zbalené
  const signupInputs = modal.querySelectorAll(".auth-signup-field input");

  function switchAuthMode(mode) {
    modal.setAttribute("data-auth-mode", mode);
    // Vynulovanie prípadnej inline priehľadnosti z prechodu na verifikáciu
    box.style.opacity = "";

    modal.querySelectorAll("[data-auth-switch]").forEach((btn) => {
      const isActive = btn.dataset.authSwitch === mode;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    // Vypnutie/zapnutie polí registrácie podľa režimu
    signupInputs.forEach((input) => {
      input.disabled = mode === "login";
    });

    submitBtn.textContent =
      mode === "signup" ? "Continue to Verification" : "Log In & Continue";
  }

  // Plynulý prechod na verifikačnú obrazovku (prelínanie priehľadnosti boxu)
  function goToVerification() {
    box.style.opacity = "0";
    window.setTimeout(() => {
      modal.setAttribute("data-auth-mode", "verify");
      box.scrollTop = 0;
      box.style.opacity = "1";
    }, 220);
  }

  // Otvorenie modálu — z odkazu „Login" v navigácii aj z tlačidla checkoutu
  document.querySelectorAll(".nav__login").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openContext = "nav";
      switchAuthMode("login");
      openModal(modal);
    });
  });

  const checkoutBtn = document.querySelector(".btn--checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Ak je používateľ už prihlásený, preskočíme modál a ideme rovno na platby
      if (isLoggedIn()) {
        window.location.href = "checkout.html";
        return;
      }
      // Inak checkout vyžaduje účet — modál resetujeme a otvoríme ako prvé
      // v režime prihlásenia (aj po predchádzajúcom Sign Up / verifikácii)
      openContext = "checkout";
      switchAuthMode("login");
      openModal(modal);
    });
  }

  // Prepínanie medzi režimami vo vnútri modálu
  modal.querySelectorAll("[data-auth-switch]").forEach((btn) => {
    btn.addEventListener("click", () => switchAuthMode(btn.dataset.authSwitch));
  });

  // Zatvorenie cez prekrytie, krížik alebo klávesu Escape
  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modal));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal(modal);
    }
  });

  // Uloženie údajov z formulára do stavu prihlásenia (iniciálky pre profil)
  function saveAuthFromForm() {
    const name = (form.querySelector('[name="name"]')?.value || "").trim();
    const email = (form.querySelector('[name="email"]')?.value || "").trim();
    setLoggedIn(name, email);
  }

  // Dokončenie prihlásenia/registrácie — z checkoutu ideme na platby,
  // z menu len obnovíme stránku, aby sa zobrazil profilový odznak
  function completeAuth() {
    saveAuthFromForm();
    if (openContext === "checkout") {
      window.location.href = "checkout.html";
    } else {
      window.location.reload();
    }
  }

  // Odoslanie formulára — v registrácii pokračuje na verifikáciu,
  // pri úspešnom prihlásení dokončí prihlásenie
  const form = modal.querySelector("#authForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (modal.getAttribute("data-auth-mode") === "signup") {
        goToVerification();
      } else {
        completeAuth();
      }
    });
  }

  // Záverečné tlačidlo vo verifikácii — dokončí registráciu
  const verifyBtn = modal.querySelector("#authVerifyBtn");
  if (verifyBtn) {
    verifyBtn.addEventListener("click", completeAuth);
  }

  // Predvolený štart v režime prihlásenia (vypne polia registrácie)
  switchAuthMode("login");
}

// ==========================================================================
// Stav prihlásenia + profilový odznak v navigácii
// Po prihlásení/registrácii sa CTA "Login" zmení na okrúhly sivý rámik
// s iniciálkami (neskôr povedie na podstránku profilu)
// ==========================================================================
const AUTH_STORE_KEY = "cc_profile_initials";

// Odvodenie iniciálok — z celého mena (dve slová), inak z e-mailu, fallback "AS"
function deriveInitials(name, email) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  const local = (email || "").split("@")[0];
  if (local.length >= 2) {
    return local.slice(0, 2).toUpperCase();
  }
  return "AS";
}

// Zistenie, či je používateľ prihlásený (má uložené iniciálky profilu)
function isLoggedIn() {
  try {
    return Boolean(localStorage.getItem(AUTH_STORE_KEY));
  } catch (e) {
    return false;
  }
}

// Uloženie stavu prihlásenia do localStorage (prežije presmerovanie medzi stránkami)
function setLoggedIn(name, email) {
  try {
    localStorage.setItem(AUTH_STORE_KEY, deriveInitials(name, email));
  } catch (e) {
    /* localStorage nemusí byť dostupné — pokojne ignorujeme */
  }
}

// ==========================================================================
// Vyhľadávanie na stránke FAQ (faq.html) — živé filtrovanie otázok/odpovedí
// ==========================================================================
function initFaqSearch() {
  const input = document.getElementById("faqSearch");
  if (!input) return;

  const items = Array.from(document.querySelectorAll(".faq-item"));
  const groups = Array.from(document.querySelectorAll(".faq-group"));
  const empty = document.getElementById("faqEmpty");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let anyVisible = false;

    // Zobrazíme položku, ak sa hľadaný text nachádza v otázke alebo odpovedi
    items.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(query);
      item.hidden = !match;
      if (match) anyVisible = true;
    });

    // Skupinu skryjeme, ak v nej neostala žiadna viditeľná otázka
    groups.forEach((group) => {
      const hasVisible = group.querySelector(".faq-item:not([hidden])");
      group.hidden = !hasVisible;
    });

    if (empty) empty.hidden = anyVisible;
  });
}

// ==========================================================================
// Platobný tok (review.html) — provizórny loading modal simulujúci platbu,
// po "úspešnom" spracovaní presmeruje na stránku "Vaše objednávky"
// ==========================================================================
function initPaymentFlow() {
  const payBtn = document.getElementById("payBtn");
  const loading = document.getElementById("payLoading");
  if (!payBtn || !loading) return;

  payBtn.addEventListener("click", () => {
    // Zobrazenie loading modalu a zablokovanie opakovaného kliknutia
    payBtn.disabled = true;
    loading.classList.add("is-open");
    loading.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Simulácia spracovania platby — po krátkej prodleve prechod na objednávky
    window.setTimeout(() => {
      // Nákup prebehol úspešne — vyprázdnime košík
      clearCart();
      window.location.href = "orders.html";
    }, 2600);
  });
}

// Ak je používateľ prihlásený, nahradí CTA "Login" okrúhlym profilovým odznakom
// Odhlásenie — zmažeme uložený profil a vrátime sa na domovskú stránku
function logout() {
  try {
    localStorage.removeItem(AUTH_STORE_KEY);
  } catch (e) {
    /* localStorage nemusí byť dostupné — pokojne ignorujeme */
  }
  window.location.href = "index.html";
}

// Minimalistické ikonky do dropdownu účtu (čiernobiely štýl, stroke = currentColor)
const ACCOUNT_ICONS = {
  profile:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  alerts:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 10a6 6 0 1 1 12 0c0 3.5 1.5 5 1.5 5H4.5S6 13.5 6 10Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  settings:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><line x1="4" y1="8" x2="20" y2="8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="15" cy="8" r="2.6" stroke="currentColor" stroke-width="1.7"/><line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="9" cy="16" r="2.6" stroke="currentColor" stroke-width="1.7"/></svg>',
  logout:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 5V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// Ak je používateľ prihlásený, nahradí CTA "Login" odznakom s iniciálkami,
// ktorý po kliknutí otvorí elegantný dropdown účtu (Profile / Alerts / Settings / Log Out)
function initProfileBadge() {
  let initials = null;
  try {
    initials = localStorage.getItem(AUTH_STORE_KEY);
  } catch (e) {
    initials = null;
  }
  if (!initials) return;

  document.querySelectorAll(".nav__login").forEach((login) => {
    const account = document.createElement("div");
    account.className = "nav__account";
    account.innerHTML = `
      <button type="button" class="nav__profile" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">${initials}</button>
      <div class="nav__dropdown" role="menu">
        <a class="nav__dropdown-item" role="menuitem" href="profile.html">${ACCOUNT_ICONS.profile}<span>Profile</span></a>
        <a class="nav__dropdown-item" role="menuitem" href="alerts.html">${ACCOUNT_ICONS.alerts}<span>Alerts</span></a>
        <a class="nav__dropdown-item" role="menuitem" href="settings.html">${ACCOUNT_ICONS.settings}<span>Account Settings</span></a>
        <div class="nav__dropdown-sep" role="separator"></div>
        <button type="button" class="nav__dropdown-item nav__dropdown-logout" role="menuitem">${ACCOUNT_ICONS.logout}<span>Log Out</span></button>
      </div>`;
    login.replaceWith(account);

    const toggle = account.querySelector(".nav__profile");
    const closeMenu = () => {
      account.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    // Otvorenie/zatvorenie dropdownu
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = account.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Odhlásenie z dropdownu
    account.querySelector(".nav__dropdown-logout").addEventListener("click", logout);

    // Zatvorenie po kliknutí mimo dropdownu alebo klávesou Escape
    document.addEventListener("click", (event) => {
      if (!account.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  });
}

// ==========================================================================
// Objednávky používateľa — jednotný zdroj dát pre zoznam (profile.html)
// aj pre detail (order.html). "guarantee" určuje, či je ešte v záručnej lehote.
// ==========================================================================
const PROFILE_ORDERS = [
  {
    id: "CC-2026-04812",
    date: "Jul 12, 2026",
    status: "Processing",
    guarantee: true,
    subtotal: "$60.00",
    discount: "−$4.80",
    total: "$55.20",
    payment: "Apple Pay",
    delivery: "aneta@outloud.co",
    items: [
      { name: "1-800-Baskets", face: "$10.00", qty: 1, price: "$9.20" },
      { name: "Starbucks", face: "$25.00", qty: 2, price: "$46.00" },
    ],
  },
  {
    id: "CC-2026-03127",
    date: "Jun 2, 2026",
    status: "Done",
    guarantee: true,
    subtotal: "$50.00",
    discount: "−$4.00",
    total: "$46.00",
    payment: "Visa •••• 4242",
    delivery: "aneta@outloud.co",
    items: [{ name: "Amazon", face: "$50.00", qty: 1, price: "$46.00" }],
  },
  {
    id: "CC-2026-00841",
    date: "Jan 15, 2026",
    status: "Refunded",
    guarantee: false,
    refundedDate: "Jan 28, 2026",
    subtotal: "$65.00",
    discount: "−$6.50",
    total: "$58.50",
    payment: "Visa •••• 4242",
    delivery: "aneta@outloud.co",
    items: [
      { name: "Target", face: "$25.00", qty: 1, price: "$22.50" },
      { name: "Nike", face: "$40.00", qty: 1, price: "$36.00" },
    ],
  },
  {
    id: "CC-2025-09920",
    date: "Nov 3, 2025",
    status: "Done",
    guarantee: false,
    subtotal: "$120.00",
    discount: "−$9.60",
    total: "$110.40",
    payment: "Visa •••• 4242",
    delivery: "aneta@outloud.co",
    items: [
      { name: "Walmart", face: "$50.00", qty: 2, price: "$92.00" },
      { name: "DoorDash", face: "$20.00", qty: 1, price: "$18.40" },
    ],
  },
];

// Ikona sponky pre "Add attachment"
const ATTACH_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.6 1.6 0 0 1-2.3-2.3l7.4-7.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Ikona (kruhové šípky) pre "Repeat order"
const REPEAT_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Celkový počet kusov v objednávke
function orderItemCount(order) {
  return order.items.reduce((sum, item) => sum + item.qty, 0);
}

// CSS trieda stavového badge podľa stavu objednávky
function orderBadgeClass(status) {
  if (status === "Processing") return "order-badge--processing";
  if (status === "Refunded") return "order-badge--refunded";
  return "order-badge--done";
}

// Reklamovať možno iba doručenú objednávku v záruke — nie ešte spracúvanú
function canReport(order) {
  return order.guarantee && order.status !== "Processing";
}

// Zopakovanie objednávky — položky pridá do košíka a prejde naň
function repeatOrder(id) {
  const order = PROFILE_ORDERS.find((o) => o.id === id);
  if (!order) return;
  addToCart(orderItemCount(order));
  window.location.href = "cart.html";
}

// Napojenie tlačidiel "Repeat order" v rámci daného kontajnera
function wireRepeatButtons(container) {
  container.querySelectorAll("[data-repeat]").forEach((btn) => {
    btn.addEventListener("click", () => repeatOrder(btn.dataset.repeat));
  });
}

// Stránka profilu (profile.html) — avatar + vykreslenie zoznamu objednávok
function initProfilePage() {
  const avatar = document.getElementById("profileAvatar");
  const list = document.getElementById("orderHistory");
  if (!avatar && !list) return;

  // Iniciálky prihláseného účtu vo veľkom avatare
  if (avatar) {
    let initials = null;
    try {
      initials = localStorage.getItem(AUTH_STORE_KEY);
    } catch (e) {
      initials = null;
    }
    if (initials) avatar.textContent = initials;
  }

  // Zoznam objednávok: primárne číslo + dátum, stav, počet items, suma, CTA-čka
  if (list) {
    list.innerHTML = PROFILE_ORDERS.map((order) => {
      const count = orderItemCount(order);
      // "Report an issue" iba pri doručenej objednávke v záruke (nie Processing)
      const claim = canReport(order)
        ? `<a class="order-claim" href="order.html?id=${order.id}#report">Report an issue</a>`
        : "";

      return `
        <li class="order-row">
          <div class="order-row__id-col">
            <span class="order-row__id">#${order.id}</span>
            <span class="order-row__date">${order.date}</span>
          </div>
          <div class="order-row__col">
            <span class="order-row__col-label">Status</span>
            <span class="order-badge ${orderBadgeClass(order.status)}">${order.status}</span>
          </div>
          <div class="order-row__col">
            <span class="order-row__col-label">Items</span>
            <span class="order-row__col-value">${count}</span>
          </div>
          <div class="order-row__col">
            <span class="order-row__col-label">Total</span>
            <span class="order-row__col-value">${order.total}</span>
          </div>
          <div class="order-row__actions">
            <a class="order-detail-btn" href="order.html?id=${order.id}">Detail</a>
            <button type="button" class="order-claim order-claim--icon" data-repeat="${order.id}" aria-label="Repeat order" title="Repeat order">${REPEAT_ICON}</button>
            ${claim}
          </div>
        </li>`;
    }).join("");

    wireRepeatButtons(list);
  }
}

// Detail objednávky (order.html) — vykreslí všetky údaje podľa ?id= z URL
function initOrderDetail() {
  const mount = document.getElementById("orderDetail");
  if (!mount) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const order = PROFILE_ORDERS.find((o) => o.id === id);

  if (!order) {
    mount.innerHTML =
      '<p class="order-detail__missing">Order not found. <a href="profile.html">Back to your orders</a>.</p>';
    return;
  }

  const count = orderItemCount(order);

  // Riadky s položkami objednávky
  const itemRows = order.items
    .map(
      (item) => `
      <li class="cart-line">
        <span class="cart-line__thumb" aria-hidden="true"></span>
        <div class="cart-line__info">
          <span class="cart-line__name">${item.name}</span>
          <span class="cart-line__price">${item.face} · Qty ${item.qty}</span>
        </div>
        <span class="cart-line__total">${item.price}</span>
      </li>`
    )
    .join("");

  // Spodný blok: refundovaná / spracúvaná / v záruke (reklamácia) / po záruke
  let bottomBlock;
  if (order.status === "Refunded") {
    bottomBlock = `
      <div class="order-guarantee order-guarantee--refunded">
        <div>
          <p class="order-guarantee__title">This order was refunded</p>
          <p class="order-guarantee__text">A full refund of ${order.total} was issued on ${order.refundedDate} to ${order.payment}.</p>
        </div>
      </div>`;
  } else if (order.status === "Processing") {
    bottomBlock = `
      <div class="order-guarantee order-guarantee--processing">
        <div>
          <p class="order-guarantee__title">Order still processing</p>
          <p class="order-guarantee__text">Your cards haven't been delivered yet. You'll be able to report an issue once the order is complete.</p>
        </div>
      </div>`;
  } else if (order.guarantee) {
    bottomBlock = `
      <div class="report-box" id="report">
        <h2 class="report-box__title">Report an issue</h2>
        <p class="report-box__text">Something wrong with your card? Describe what happened and we'll make it right within your 100-day guarantee.</p>
        <textarea class="report-box__input" id="reportMessage" rows="4" placeholder="Tell us what's wrong with your card…"></textarea>
        <div class="report-box__foot">
          <label class="report-box__attach">${ATTACH_ICON}<span>Add attachment</span><input type="file" hidden></label>
          <button type="button" class="pill-btn report-box__send" id="reportSend">Send</button>
        </div>
      </div>`;
  } else {
    bottomBlock = `
      <div class="order-guarantee order-guarantee--expired">
        <div>
          <p class="order-guarantee__title">Guarantee expired</p>
          <p class="order-guarantee__text">The 100-day guarantee window for this order has passed.</p>
        </div>
      </div>`;
  }

  mount.innerHTML = `
    <div class="order-detail__head">
      <div>
        <h1 class="order-detail__id">Order #${order.id}</h1>
        <p class="order-detail__date">${order.date}</p>
      </div>
      <span class="order-badge ${orderBadgeClass(order.status)}">${order.status}</span>
    </div>

    <div class="order-detail__actions">
      <button type="button" class="order-claim order-claim--icon" data-repeat="${order.id}" aria-label="Repeat order" title="Repeat order">${REPEAT_ICON}</button>
    </div>

    <section class="order-detail__card">
      <h2 class="order-detail__section-title">Items (${count})</h2>
      <ul class="cart-lines">${itemRows}</ul>
      <div class="cart-summary">
        <div class="cart-summary__row"><span>Subtotal</span><span>${order.subtotal}</span></div>
        <div class="cart-summary__row"><span>Discount</span><span>${order.discount}</span></div>
        <div class="cart-summary__row cart-summary__row--total"><span>Order total</span><span>${order.total}</span></div>
      </div>
    </section>

    <section class="order-detail__card">
      <h2 class="order-detail__section-title">Payment &amp; delivery</h2>
      <ul class="profile-rows">
        <li><span>Payment method</span><span>${order.payment}</span></li>
        <li><span>Delivered to</span><span>${order.delivery}</span></li>
        <li><span>Status</span><span>${order.status}</span></li>
      </ul>
    </section>

    ${bottomBlock}
  `;

  // Napojenie akcií po vykreslení
  wireRepeatButtons(mount);

  // Odoslanie reklamácie — nahradí formulár potvrdením
  const send = document.getElementById("reportSend");
  if (send) {
    send.addEventListener("click", () => {
      const box = document.getElementById("report");
      box.classList.add("report-box--sent");
      box.innerHTML = `
        <h2 class="report-box__title">Thanks — we've received your report</h2>
        <p class="report-box__text">Our team will review it and get back to you at ${order.delivery} shortly.</p>`;
    });
  }
}

// ==========================================================================
// Stránka alertov (alerts.html) — alerty na značku podľa hodnoty karty
// (rozsah od–do) a/alebo minimálnej % zľavy. Edit a delete iba ikonami.
// ==========================================================================

// Predvolené aktívne alerty — niektoré iba value, niektoré iba %, niektoré aj-aj
const ALERTS = [
  { brand: "Nike", valueMin: 50, valueMax: 200, discount: 12 }, // value + %
  { brand: "Amazon", valueMin: 25, valueMax: 100, discount: null }, // iba value
  { brand: "Starbucks", valueMin: null, valueMax: null, discount: 10 }, // iba %
  { brand: "Apple", valueMin: 100, valueMax: 500, discount: 6 }, // value + %
];

// Ikony pre edit (ceruzka) a delete (kôš)
const EDIT_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m13.5 6.5 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const DELETE_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

function initAlerts() {
  const list = document.getElementById("alertList");
  if (!list) return;

  const alerts = ALERTS.slice();

  const brandSel = document.getElementById("alertBrand");
  const minIn = document.getElementById("alertMin");
  const maxIn = document.getElementById("alertMax");
  const discIn = document.getElementById("alertDiscount");
  const createBox = document.getElementById("alertCreate");
  const newBtn = document.getElementById("alertNew");
  const addBtn = document.getElementById("alertAdd");
  const cancelBtn = document.getElementById("alertCancel");

  const chip = (label, value) =>
    `<span class="alert-chip"><span class="alert-chip__label">${label}</span>${value}</span>`;

  // Vykreslenie zoznamu alertov (value chip a/alebo discount chip)
  function render() {
    if (!alerts.length) {
      list.innerHTML =
        '<li class="alert-empty">No active alerts yet. Create one to get notified.</li>';
      return;
    }
    list.innerHTML = alerts
      .map((a, i) => {
        const hasValue = a.valueMin != null && a.valueMax != null;
        const chips =
          (hasValue ? chip("Value", `$${a.valueMin} – $${a.valueMax}`) : "") +
          (a.discount != null ? chip("Discount", `≥ ${a.discount}%`) : "");
        return `
          <li class="alert-row">
            <div class="alert-row__brand">
              <span class="alert-row__logo">${a.brand}</span>
              <span class="alert-row__name">${a.brand} Gift Card</span>
            </div>
            <div class="alert-row__conds">${chips}</div>
            <div class="alert-row__actions">
              <button type="button" class="icon-btn" data-edit="${i}" aria-label="Edit alert" title="Edit">${EDIT_ICON}</button>
              <button type="button" class="icon-btn" data-delete="${i}" aria-label="Delete alert" title="Delete">${DELETE_ICON}</button>
            </div>
          </li>`;
      })
      .join("");
  }
  render();

  // Otvorenie/zatvorenie formulára
  function openForm() {
    if (createBox) createBox.hidden = false;
  }
  function closeForm() {
    if (createBox) createBox.hidden = true;
  }
  function resetForm() {
    if (brandSel) brandSel.value = "";
    if (minIn) minIn.value = "";
    if (maxIn) maxIn.value = "";
    if (discIn) discIn.value = "";
  }

  if (newBtn) newBtn.addEventListener("click", openForm);
  if (cancelBtn)
    cancelBtn.addEventListener("click", () => {
      resetForm();
      closeForm();
    });

  // Pridanie alertu z formulára
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const brand = brandSel ? brandSel.value : "";
      const min = minIn && minIn.value !== "" ? Number(minIn.value) : null;
      const max = maxIn && maxIn.value !== "" ? Number(maxIn.value) : null;
      const disc = discIn && discIn.value !== "" ? Number(discIn.value) : null;

      const hasValue = min != null && max != null;
      // Vyžadujeme značku a aspoň jednu podmienku (value rozsah alebo %)
      if (!brand || (!hasValue && disc == null)) return;

      alerts.unshift({
        brand,
        valueMin: hasValue ? min : null,
        valueMax: hasValue ? max : null,
        discount: disc,
      });
      render();
      resetForm();
      closeForm();
    });
  }

  // Delegované akcie edit / delete
  list.addEventListener("click", (event) => {
    const del = event.target.closest("[data-delete]");
    if (del) {
      alerts.splice(Number(del.dataset.delete), 1);
      render();
      return;
    }
    const edit = event.target.closest("[data-edit]");
    if (edit) {
      // Edit: predvyplníme formulár pôvodnými hodnotami a alert odoberieme,
      // takže po uložení sa pridá upravená verzia
      const a = alerts[Number(edit.dataset.edit)];
      if (brandSel) brandSel.value = a.brand;
      if (minIn) minIn.value = a.valueMin != null ? a.valueMin : "";
      if (maxIn) maxIn.value = a.valueMax != null ? a.valueMax : "";
      if (discIn) discIn.value = a.discount != null ? a.discount : "";
      alerts.splice(Number(edit.dataset.edit), 1);
      render();
      openForm();
    }
  });
}

// ==========================================================================
// Stránka nastavení účtu (settings.html) — Color Mode, platobné metódy
// a modálové akcie (Edit profilu, Change password, Authenticator, karty)
// ==========================================================================

// 6-miestne pole na kód — HTML a napojenie (auto-posun medzi políčkami)
function codeInputsHTML() {
  return `<div class="code-inputs">${Array.from({ length: 6 })
    .map(
      () =>
        '<input type="text" class="code-input" inputmode="numeric" maxlength="1" aria-label="Digit">'
    )
    .join("")}</div>`;
}

function wireCodeInputs(container) {
  const inputs = Array.from(container.querySelectorAll(".code-input"));
  inputs.forEach((inp, i) => {
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
      if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
    });
    inp.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !inp.value && inputs[i - 1]) {
        inputs[i - 1].focus();
      }
    });
  });
  if (inputs[0]) inputs[0].focus();
}

// Pseudo-QR kód ako sebestačné SVG (finder patterny + deterministické moduly)
function qrSVG() {
  const N = 25;
  const cell = 8;
  const size = N * cell;
  let seed = 987654321;
  const bit = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed >> 16) & 1;
  };
  const finder = (r, c, or, oc) => {
    const rr = r - or;
    const cc = c - oc;
    if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true;
    return rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
  };
  let rects = "";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let fill;
      if (r < 7 && c < 7) fill = finder(r, c, 0, 0);
      else if (r < 7 && c >= N - 7) fill = finder(r, c, 0, N - 7);
      else if (r >= N - 7 && c < 7) fill = finder(r, c, N - 7, 0);
      else fill = bit() === 1;
      if (fill) rects += `<rect x="${c * cell}" y="${r * cell}" width="${cell}" height="${cell}"/>`;
    }
  }
  return `<svg class="qr" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="#212529" aria-hidden="true"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`;
}

// Zostavenie HTML riadku platobnej metódy (type: "card" alebo "bank")
function pmRowHTML(name, meta, logo, type) {
  return `<div class="pm-row" data-pm-type="${type || "card"}">
      <div class="pm-row__brand">
        <span class="pm-row__logo">${logo}</span>
        <div class="pm-row__info">
          <span class="pm-row__name">${name}</span>
          <span class="pm-row__meta">${meta}</span>
        </div>
      </div>
      <button type="button" class="pm-default-btn">Set default</button>
      <div class="pm-row__actions">
        <button type="button" class="icon-btn" data-pm-edit aria-label="Edit payment method" title="Edit">${EDIT_ICON}</button>
        <button type="button" class="icon-btn" data-pm-delete aria-label="Delete payment method" title="Delete">${DELETE_ICON}</button>
      </div>
    </div>`;
}

// Ikony oka pre zobrazenie/skrytie hesla
const EYE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>';
const EYE_OFF_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.3 3.9M6.4 8.5A17 17 0 0 0 2 12s3.5 6 10 6a10 10 0 0 0 3.7-.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" stroke="currentColor" stroke-width="1.7"/></svg>';

// Pole na heslo s tlačidlom oka (na zobrazenie/skrytie znakov)
function pwdFieldHTML(label, id, placeholder, full) {
  return `<label class="field${full ? " field--full" : ""}"><span>${label}</span>
      <div class="pwd-field">
        <input type="password" class="control" id="${id}" placeholder="${placeholder}" autocomplete="off">
        <button type="button" class="pwd-toggle" data-pwd-toggle aria-label="Show password">${EYE_ICON}</button>
      </div>
    </label>`;
}

// Univerzálne prepínanie viditeľnosti hesla (delegované — funguje aj v modáli)
function initPasswordEye() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-pwd-toggle]");
    if (!btn) return;
    const input = btn.closest(".pwd-field")?.querySelector("input");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.innerHTML = show ? EYE_OFF_ICON : EYE_ICON;
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
}

// Odvodenie značky karty z prvej číslice
function cardBrand(number) {
  const d = number.replace(/\D/g, "")[0];
  if (d === "4") return { name: "Visa", logo: "VISA" };
  if (d === "5") return { name: "Mastercard", logo: "MC" };
  if (d === "3") return { name: "Amex", logo: "AMEX" };
  return { name: "Card", logo: "CARD" };
}

function initSettings() {
  const page = document.querySelector(".settings-page");
  if (!page) return;

  // --- Segmentovaný prepínač Color Mode ---
  const group = document.getElementById("colorMode");
  if (group) {
    const buttons = group.querySelectorAll(".segmented__btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  }

  // --- Modálový framework ---
  const modal = document.getElementById("settingsModal");
  const content = document.getElementById("smodalContent");

  function openM(html) {
    content.innerHTML = html;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    return content;
  }
  function closeM() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
  if (modal) {
    modal.querySelectorAll("[data-smodal-close]").forEach((el) => {
      el.addEventListener("click", closeM);
    });
    // Delegované zatvorenie pre tlačidlá Cancel vykreslené do obsahu
    content.addEventListener("click", (event) => {
      if (event.target.closest("[data-smodal-close]")) closeM();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeM();
    });
  }

  const actionsHTML = (primaryId, primaryLabel) => `
    <div class="smodal__actions">
      <button type="button" class="pill-btn pill-btn--ghost" data-smodal-close>Cancel</button>
      <button type="button" class="pill-btn" id="${primaryId}">${primaryLabel}</button>
    </div>`;

  // --- Profil: overenie (výber metódy → kód → úprava údajov) ---
  const profileEdit = document.getElementById("profileEdit");
  if (profileEdit) {
    profileEdit.addEventListener("click", verifyStep);

    function verifyStep() {
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">Verify it's you</h2>
        <p class="smodal__text">To edit your profile, choose how to receive a 6-digit verification code.</p>
        <div class="choice-list">
          <label class="choice"><input type="radio" name="vmethod" value="sms" checked>
            <span class="choice__main"><span class="choice__title">Text me a code</span><span class="choice__sub">SMS to phone ending 3722</span></span></label>
          <label class="choice"><input type="radio" name="vmethod" value="call">
            <span class="choice__main"><span class="choice__title">Call me with a code</span><span class="choice__sub">Automated call to phone ending 3722</span></span></label>
        </div>
        ${actionsHTML("vNext", "Send code")}`);
      c.querySelector("#vNext").addEventListener("click", () => {
        const method = c.querySelector('input[name="vmethod"]:checked').value;
        codeStep(method);
      });
    }

    function codeStep(method) {
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">Enter the 6-digit code</h2>
        <p class="smodal__text">We ${method === "call" ? "called" : "texted"} your phone ending in 3722. Enter the code below.</p>
        ${codeInputsHTML()}
        <button type="button" class="smodal__link" id="vResend">Resend code</button>
        <div class="smodal__actions">
          <button type="button" class="pill-btn pill-btn--ghost" id="vBack">Back</button>
          <button type="button" class="pill-btn" id="vVerify">Verify</button>
        </div>`);
      wireCodeInputs(c);
      c.querySelector("#vBack").addEventListener("click", verifyStep);
      c.querySelector("#vVerify").addEventListener("click", editStep);
    }

    function editStep() {
      const email = document.getElementById("pfEmail").textContent.trim();
      const phone = document.getElementById("pfPhone").textContent.trim();
      const notif = document.getElementById("pfNotif").textContent.trim();
      const on = notif.toLowerCase().includes("on");
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">Edit profile</h2>
        <div class="smodal__form">
          <label class="field field--full"><span>Email</span><input type="email" class="control" id="edEmail" value="${email}"></label>
          <label class="field field--full"><span>Phone</span><input type="tel" class="control" id="edPhone" value="${phone}"></label>
          <label class="field field--full"><span>Notifications</span>
            <select class="control" id="edNotif">
              <option value="on" ${on ? "selected" : ""}>Email alerts on</option>
              <option value="off" ${on ? "" : "selected"}>Email alerts off</option>
            </select>
          </label>
        </div>
        ${actionsHTML("edSave", "Save changes")}`);
      c.querySelector("#edSave").addEventListener("click", () => {
        document.getElementById("pfEmail").textContent = c.querySelector("#edEmail").value.trim();
        document.getElementById("pfPhone").textContent = c.querySelector("#edPhone").value.trim();
        document.getElementById("pfNotif").textContent =
          c.querySelector("#edNotif").value === "on" ? "Email alerts on" : "Email alerts off";
        closeM();
      });
    }
  }

  // --- Zmena hesla (staré + 2× nové) ---
  const passwordChange = document.getElementById("passwordChange");
  if (passwordChange) {
    passwordChange.addEventListener("click", () => {
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">Change password</h2>
        <div class="smodal__form">
          ${pwdFieldHTML("Current password", "pwOld", "••••••••", true)}
          ${pwdFieldHTML("New password", "pwNew", "••••••••", true)}
          ${pwdFieldHTML("Confirm new password", "pwNew2", "••••••••", true)}
          <p class="smodal__error" id="pwError" hidden></p>
        </div>
        ${actionsHTML("pwSave", "Update password")}`);
      c.querySelector("#pwSave").addEventListener("click", () => {
        const old = c.querySelector("#pwOld").value;
        const n1 = c.querySelector("#pwNew").value;
        const n2 = c.querySelector("#pwNew2").value;
        const err = c.querySelector("#pwError");
        if (!old || !n1) {
          err.textContent = "Please fill in all fields.";
          err.hidden = false;
          return;
        }
        if (n1 !== n2) {
          err.textContent = "New passwords don't match.";
          err.hidden = false;
          return;
        }
        closeM();
      });
    });
  }

  // --- Authenticator App (QR na naskenovanie + potvrdenie kódom) ---
  const authConnect = document.getElementById("authConnect");
  if (authConnect) {
    authConnect.addEventListener("click", () => {
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">Set up authenticator app</h2>
        <p class="smodal__text">Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password…), then enter the 6-digit code it shows.</p>
        <div class="qr-wrap">${qrSVG()}</div>
        <p class="qr-key">Can't scan? Enter this key manually:<br><code>JBSW Y3DP EHPK 3PXP QER7</code></p>
        ${codeInputsHTML()}
        ${actionsHTML("authEnable", "Verify & enable")}`);
      wireCodeInputs(c);
      c.querySelector("#authEnable").addEventListener("click", () => {
        const status = document.getElementById("authStatus");
        status.textContent = "Enabled";
        status.classList.remove("settings-row__value--muted");
        authConnect.textContent = "Manage";
        closeM();
      });
    });
  }

  // --- Platobné metódy: pridanie / úprava cez modál ---
  const pmList = document.getElementById("paymentMethods");
  const pmAdd = document.getElementById("pmAdd");

  // Formulár karty
  function cardFormHTML(row, editing) {
    const meta = editing ? row.querySelector(".pm-row__meta").textContent.trim() : "";
    const exp = editing ? (meta.match(/\d{2}\/\d{2}/) || [""])[0] : "";
    const last4 = editing
      ? (row.querySelector(".pm-row__name").textContent.match(/\d{4}$/) || [""])[0]
      : "";
    return `
      <div class="smodal__form">
        <label class="field field--full"><span>Card number</span><input type="text" class="control" id="cardNum" inputmode="numeric" placeholder="1234 5678 9012 3456" ${editing ? `value="•••• •••• •••• ${last4}" disabled` : ""}></label>
        <div class="smodal__grid">
          <label class="field"><span>MM/YY</span><input type="text" class="control" id="cardExp" inputmode="numeric" placeholder="08/28" value="${exp}"></label>
          <label class="field"><span>CVV</span><input type="text" class="control" id="cardCvv" inputmode="numeric" placeholder="123"></label>
        </div>
        <label class="field field--full"><span>Name on card</span><input type="text" class="control" id="cardName" placeholder="Aneta Surová"></label>
        <p class="smodal__error" id="pmError" hidden></p>
      </div>`;
  }

  // Formulár bankového účtu (ACH bank transfer)
  function bankFormHTML(row, editing) {
    const meta = editing ? row.querySelector(".pm-row__meta").textContent : "";
    const types = ["Business Checking", "Personal Checking", "Savings"];
    const options = types
      .map((t) => `<option ${meta.includes(t) ? "selected" : ""}>${t}</option>`)
      .join("");
    const last4 = editing
      ? (row.querySelector(".pm-row__name").textContent.match(/\d{4}$/) || [""])[0]
      : "";
    return `
      <p class="pm-note">Slower delivery — bank payments take up to 3–4 business days to clear before your order ships. Adds a <strong>+3% discount</strong>.</p>
      <div class="smodal__form">
        <label class="field field--full"><span>Name on account</span><input type="text" class="control" id="bankName" placeholder="Aneta Surová"></label>
        <label class="field field--full"><span>Routing number</span><input type="text" class="control" id="bankRouting" inputmode="numeric" placeholder="021000021"></label>
        <label class="field field--full"><span>Account number</span><input type="text" class="control" id="bankAccount" inputmode="numeric" placeholder="000123456789" ${editing ? `value="•••• •••• ${last4}" disabled` : ""}></label>
        <label class="field field--full"><span>Account type</span><select class="control" id="bankType">${options}</select></label>
        <p class="smodal__error" id="pmError" hidden></p>
      </div>`;
  }

  function paymentModal(row) {
    const editing = Boolean(row);
    const startType = editing ? row.dataset.pmType || "card" : "card";

    renderForm(startType);

    function renderForm(type) {
      const title = editing
        ? `Edit ${type === "bank" ? "bank account" : "card"}`
        : "Add payment method";
      // Prepínač Card / Bank iba pri pridávaní novej metódy
      const tabs = editing
        ? ""
        : `<div class="segmented pm-type-tabs">
             <button type="button" class="segmented__btn ${type === "card" ? "is-active" : ""}" data-pm-tab="card">Card</button>
             <button type="button" class="segmented__btn ${type === "bank" ? "is-active" : ""}" data-pm-tab="bank">Bank account</button>
           </div>`;
      const body = type === "bank" ? bankFormHTML(row, editing) : cardFormHTML(row, editing);
      const c = openM(`
        <h2 class="smodal__title" id="smodalTitle">${title}</h2>
        ${tabs}
        ${body}
        ${actionsHTML("pmSave", editing ? "Save changes" : type === "bank" ? "Add bank account" : "Add card")}`);

      c.querySelectorAll("[data-pm-tab]").forEach((tab) => {
        tab.addEventListener("click", () => renderForm(tab.dataset.pmTab));
      });
      c.querySelector("#pmSave").addEventListener("click", () => save(type, c));
    }

    function save(type, c) {
      const err = c.querySelector("#pmError");
      const fail = (msg) => {
        err.textContent = msg;
        err.hidden = false;
      };

      if (type === "bank") {
        const acctType = c.querySelector("#bankType").value;
        if (editing) {
          row.querySelector(".pm-row__meta").textContent = `ACH bank transfer · ${acctType} · +3% discount`;
          closeM();
          return;
        }
        const name = c.querySelector("#bankName").value.trim();
        const account = c.querySelector("#bankAccount").value.replace(/\D/g, "");
        if (!name || account.length < 4) {
          fail("Please enter the name on account and a valid account number.");
          return;
        }
        pmList.insertAdjacentHTML(
          "beforeend",
          pmRowHTML(
            `${acctType} •••• ${account.slice(-4)}`,
            `ACH bank transfer · ${acctType} · +3% discount`,
            "BANK",
            "bank"
          )
        );
        closeM();
        return;
      }

      // Karta
      const expVal = c.querySelector("#cardExp").value.trim();
      if (editing) {
        if (!expVal) {
          fail("Please enter the expiry date.");
          return;
        }
        row.querySelector(".pm-row__meta").textContent = `Expires ${expVal}`;
        closeM();
        return;
      }
      const num = c.querySelector("#cardNum").value.replace(/\D/g, "");
      if (num.length < 4 || !expVal) {
        fail("Please enter a valid card number and expiry.");
        return;
      }
      const brand = cardBrand(num);
      pmList.insertAdjacentHTML(
        "beforeend",
        pmRowHTML(`${brand.name} •••• ${num.slice(-4)}`, `Expires ${expVal}`, brand.logo, "card")
      );
      closeM();
    }
  }

  if (pmAdd) pmAdd.addEventListener("click", () => paymentModal(null));

  if (pmList) {
    pmList.addEventListener("click", (event) => {
      // Odstránenie metódy
      const del = event.target.closest("[data-pm-delete]");
      if (del) {
        del.closest(".pm-row").remove();
        return;
      }
      // Úprava metódy
      const edit = event.target.closest("[data-pm-edit]");
      if (edit) {
        paymentModal(edit.closest(".pm-row"));
        return;
      }
      // Nastavenie predvolenej metódy — presunie odznak „Default"
      const setDef = event.target.closest(".pm-default-btn");
      if (setDef) {
        const row = setDef.closest(".pm-row");
        pmList.querySelectorAll(".pm-row").forEach((r) => {
          const mid = r.querySelector(".pm-badge, .pm-default-btn");
          if (!mid) return;
          if (r === row) {
            const badge = document.createElement("span");
            badge.className = "pm-badge";
            badge.textContent = "Default";
            mid.replaceWith(badge);
          } else if (mid.classList.contains("pm-badge")) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "pm-default-btn";
            btn.textContent = "Set default";
            mid.replaceWith(btn);
          }
        });
      }
    });
  }
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
