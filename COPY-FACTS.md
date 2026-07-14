# COPY FACTS — jediný zdroj pravdy pre čísla a sľuby

Každé číslo/sľub v copy musí sedieť s touto tabuľkou. Ak sa hodnota zmení (napr. klient potvrdí iné podmienky záruky), zmeň ju TU a potom všade vo výskytoch.

| Fakt | Kanonická hodnota | Anglická formulácia v copy |
|------|-------------------|----------------------------|
| Mena | USD | `$100`, `$88` (nikdy €) |
| Trh | US | — |
| Doručenie karty | do 5 minút | "under 5 minutes" / "within 5 minutes" |
| Záruka — názov programu | CardCenter Shield | "CardCenter Shield" (vždy celý názov) |
| Záruka — krytie | 100 % zostatku | "100% balance guarantee" |
| Záruka — okno | 100 dní | "for 100 days" / "100-day CardCenter Shield guarantee" |
| Rozsah zliav | 5–20 % | "typically 5–20% off face value" |
| Spracovanie refundu | do 24 hodín | "refunded in less than 24 hours" |
| Odozva podpory | do 5 minút | "<5min response" |
| Dostupnosť podpory | 24/7, ľudia | "24/7 human customer support" |

## Kde fakty žijú (výskyty)

- **Mena** — index.html (bestsellers), product.html, cart.html, checkout.html, review.html, orders.html, script.js (orders dáta)
- **Doručenie** — index.html (hero stat `<5min`), product.html (feature list), cart.html + script.js (meta položky), checkout.html (Apple Pay note), review.html (Delivery), orders.html (confirmation), faq.html
- **Záruka** — product.html (badge "Protected by CardCenter Shield" + feature list), review.html (Delivery sub), faq.html (sekcia Guarantee), script.js (order detail: report box + expired stav)
- **Zľavy** — faq.html ("How much can I really save?" 2×)
- **Refund <24h** — index.html ("Refund in less than 24h"), faq.html ("How do I make a claim?")

## Poznámky

- Neschválené klientom: 100-dňové okno záruky aj názov "CardCenter Shield" sú zatiaľ návrh (v hlavnom projekte vedené ako placeholder). Pred odovzdaním klientovi over.
- Nemiešať kvalifikátory: žiadne "instant delivery" / "<2min" — všade jednotne "under 5 minutes".
