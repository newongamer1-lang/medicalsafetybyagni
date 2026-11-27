# Rider SOS – NFC Emergency Profile

A one-page emergency profile for bikers. Stick an NFC tag on the helmet or bike, and anyone who taps it with a phone sees:

- An **emergency popup** with one-tap **Call Ambulance**, **Call Police** and **Alert Family (SMS)**
- Name, **blood group**, date of birth, age (calculated automatically), bike number
- Personal phone and emergency contacts with call and SMS buttons
- Medical info (allergies, conditions, medications)
- A prefilled SMS to emergency contacts that **includes the accident location** (Google Maps link) if the person helping allows location access
- First-aid tips for bystanders

No app or login is needed. It works on any phone browser.

## 1. Add your details
Open `config.js` and replace the sample details. Use international phone format (`+977…`).
The emergency numbers default to Nepal (Ambulance 102, Police 100, Traffic 103, Fire 101).

## 2. Host it (free)
The browser only shares location on **HTTPS**, so host it on one of these:

**GitHub Pages**
```bash
git add . && git commit -m "Rider SOS"
git remote add origin https://github.com/<you>/rider-sos.git
git push -u origin main
```
Then go to the repo's Settings → Pages → Deploy from branch `main` / root.
Your URL will be `https://<you>.github.io/rider-sos/`

**Netlify:** drag the folder onto https://app.netlify.com/drop

## 3. Write the NFC tag
1. Buy an NTAG213/215/216 sticker. For a metal surface, get an "anti-metal" tag.
2. Install **NFC Tools** (Android/iOS).
3. Choose Write → Add record → **URL/URI** → paste your HTTPS link → Write → tap the tag.
4. Optional: lock the tag (NFC Tools → Other → Lock tag) so nobody can overwrite it. **Locking is permanent.**
5. Test it with an iPhone and an Android phone. Both open the URL with no app.

Tip: put a sticker next to the tag saying **"🚨 EMERGENCY – TAP PHONE HERE"** so people know to scan it. Add a QR code of the same URL as a backup for phones without NFC.

## Privacy note
Anyone who taps the tag can see this page, and so can anyone who has the link. Only add info you're comfortable sharing. The page is set to `noindex` so search engines won't list it.

## Files
| File | Purpose |
|------|---------|
| `config.js` | **Your details** (the only file you need to edit) |
| `index.html` | Page layout |
| `style.css` | Styling |
| `app.js` | Popup, call/SMS logic, age calculation, location |
