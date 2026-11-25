# happy hormones · website

Deze map is je complete website. Je zet hem gratis online met GitHub Pages.

## Wat zit er in deze map

| Bestand | Wat het is |
|---|---|
| `index.html` | Je website: alle teksten staan hierin |
| `style.css` | Kleuren, lettertypes en opmaak |
| `script.js` | De hormoonscan, het menu en de formulieren. **Bovenaan vul je je links in.** |
| `privacy.html` | Je privacyverklaring (tekst nog invullen) |
| `images/` | Je foto's |
| `favicon.svg` | Het icoontje in het browsertabblad |
| `CNAME` | Vertelt GitHub dat je site op happy-hormones.nl draait |

## 1. Online zetten met GitHub Pages

1. Maak een gratis account op github.com.
2. Klik rechtsboven op **+** › **New repository**. Naam: `happy-hormones`. Kies **Public**. Klik **Create repository**.
3. Klik op **uploading an existing file**. Sleep **alles uit deze map** (ook de map `images`) in het venster. Klik **Commit changes**.
4. Ga naar **Settings** › **Pages**. Kies bij *Branch* `main` en map `/ (root)`. Klik **Save**.
5. Na een minuut staat je site op `https://JOUWNAAM.github.io/happy-hormones/`.

## 2. Je domein happy-hormones.nl koppelen

1. In GitHub: **Settings** › **Pages** › *Custom domain*: vul `happy-hormones.nl` in en klik **Save**.
2. Bij je domeinaanbieder (TransIP, Versio, ...) zet je bij DNS:
   - Vier **A-records** voor `@` naar: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Eén **CNAME-record** voor `www` naar: `JOUWNAAM.github.io`
3. Wacht tot het werkt (een paar minuten tot een dag) en vink daarna in GitHub **Enforce HTTPS** aan.

## 3. Je links invullen

Open `script.js` en vul bovenaan in:

```js
var LINKS = {
  betaal: 'https://...',      // betaallink e-book
  whatsapp: '316........',    // je nummer, zonder + en spaties
  calendly: 'https://...'     // optioneel: je agenda
};
```

Aanpassen in GitHub: klik op het bestand › potloodje › aanpassen › **Commit changes**. Na een minuut staat het live.

## 4. Formulieren koppelen

Zonder koppeling tonen de formulieren alleen het bedankje. Om de e-mailadressen echt te ontvangen:

- **Simpel:** maak bij formspree.io een formulier per onderdeel en plak het adres (`https://formspree.io/f/...`) in `script.js` bij `FORMS`. Je krijgt dan elke aanmelding in je mail.
- **Met automatische mails (aanrader):** gebruik MailerLite. Daar maak je een formulier en een automatisering die het gratis deel van je e-book of de tips van de scan stuurt. De scan stuurt de uitslag mee in het veld `uitslag`, zodat je per uitslag andere tips kunt mailen.

## 5. Nog invullen in index.html

- `KvK [NUMMER]` in de footer
- De tekst van `privacy.html`

## Teksten of foto's aanpassen

- **Tekst:** zoek de zin op in `index.html` en pas hem aan.
- **Foto:** upload een nieuwe foto in de map `images` met precies dezelfde bestandsnaam.
- **Vragen van de scan:** staan in `script.js` bij `var qs`.
