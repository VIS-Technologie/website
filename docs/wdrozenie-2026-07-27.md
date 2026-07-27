# Log wdrożenia + zmiany w projekcie — 2026-07-27

Wdrożenie produkcyjnej strony „KINETYKA" na hosting Kylos oraz naprawa dostępu przez HTTPS.
Ten dokument opisuje **co**, **jak** i **co jeszcze zostało** do zrobienia. Instrukcja ogólna: `docs/wdrozenie.md`.

## 1. Podsumowanie

- Nowa strona (`dist/`) wgrana do `/public_html` na serwerze **s19.kylos.pl** (domena `vistechnologie.pl`).
- Dostęp przez **HTTPS działa**, przekierowanie `http → 301 → https` potwierdzone.
- Dodano **automatyczny wybór języka** (PL dla polskich przeglądarek, EN dla pozostałych) — na życzenie klienta.
- Zrobiono **backup** poprzedniej strony przed nadpisaniem.
- Otwarte punkty po stronie klienta: `www` (DNS + certyfikat), test formularza/skrzynki pocztowe, SPF/DKIM.

## 2. Metoda wdrożenia

- **Protokół: SFTP** (port 22), NIE FTP/FTPES.
  - Powód: na tym łączu pasywny kanał danych FTP jest blokowany („Operation not permitted"). SFTP używa jednego połączenia i ten problem omija.
- **Skrypt:** `tools/deploy.ps1` (build → `WinSCP synchronize`), dane z `tools/.env.deploy`.
- **Komenda podglądu / wdrożenia:**
  ```
  powershell -ExecutionPolicy Bypass -File tools/deploy.ps1 -DryRun   # podgląd
  powershell -ExecutionPolicy Bypass -File tools/deploy.ps1           # wdrożenie (bez usuwania)
  powershell -ExecutionPolicy Bypass -File tools/deploy.ps1 -Mirror   # wdrożenie + usunięcie nadmiarowych plików
  ```
- **Katalog docelowy:** `/public_html` (potwierdzony listingiem).

### ⚠️ Pułapki (ważne przy kolejnych wdrożeniach)
- **fail2ban / limit połączeń Kylos:** serwer blokuje IP po serii szybkich połączeń (SFTP **oraz** HTTP — dotyczy też rapidowych POST-ów formularza). **Łącz się oszczędnie**, z odstępami (kilka minut). Objaw: „Connection timed out" / „Could not connect".
- **Norton przechwytuje HTTPS:** na maszynie deweloperskiej Norton Antivirus robi skanowanie SSL/TLS i podstawia własny certyfikat („Norton Web/Mail Shield"). Dlatego **z tej maszyny nie widać prawdziwego certyfikatu serwera**, a `curl` zgłasza `CRYPT_E_NO_REVOCATION_CHECK` (obejście: `--ssl-no-revoke`). Prawdziwy cert sprawdzać zewnętrznie (SSL Labs) lub z urządzenia bez Nortona.
- **`python` vs `py`:** na tej maszynie działa launcher `py` (Python 3.12); `python` jest przechwytywany przez zaślepkę Microsoft Store. Build i deploy używają `py`.

## 3. Zmiany w projekcie (plik po pliku)

| Plik | Zmiana | Powód |
|---|---|---|
| `tools/.env.deploy` | **Utworzony** (poza gitem). `FTP_HOST=s19.kylos.pl`, `FTP_USER=claude@vistechnologie.pl`, `FTP_REMOTE_DIR=/public_html`, `FTP_PROTOCOL=sftp`, hasło uzupełnione ręcznie przez klienta | Dane dostępowe do wdrożenia. Hasła nie zapisuje asystent. |
| `tools/deploy.ps1` | `python` → `py`; zapis w **UTF-8 z BOM**; obsługa **SFTP** (`-hostkey`, pominięcie `-passive` dla sftp) | `python` nie działał; brak BOM psuł parsowanie polskich znaków w PS 5.1; przejście na SFTP z powodu blokady kanału danych FTP. |
| `site/static/.htaccess` | Dodano **wyjątek dla `/.well-known/acme-challenge/`** w regule http→https; dodano **reguły auto-języka** (strona główna → `/en/` dla nie-polskich przeglądarek, wybór zapamiętany w cookie `vt_lang`) | Żeby walidacja Let's Encrypt działała po http; automatyczny dobór języka (życzenie klienta). |
| `site/static/assets/site.js` | Dodano zapis cookie `vt_lang` po kliknięciu przełącznika **PL/EN** | Zapamiętanie wyboru języka (żeby auto-redirect nie odsyłał w kółko). |
| `site/static/assets/styles.css` | (Zmiana wcześniejsza) `font-synthesis: none` + `paint-order: stroke fill` na tekstach konturowych | Naprawa artefaktów w literach konturowych (fonty tylko do wagi 700, sztuczny bold psuł `-webkit-text-stroke`). |

Treść i style strony (poza powyższą naprawą konturów) **nie były zmieniane** — reszta to wyłącznie warstwa wdrożeniowa.

## 4. Backup poprzedniej strony

- Pobrany przez SFTP **przed** nadpisaniem: `D:\VisTechnologie\_backup-live-20260727-163709\public_html` (77 plików — poprzednia strona, m.in. `pace.min.js`).
- Deploy był **bez `-Mirror`**, więc stare pliki poprzedniej strony **nadal są na serwerze** (nie kolidują — nowy `index.html`/`.htaccess` je nadpisały, reszta leży nieużywana). Do pełnego sprzątnięcia: `deploy.ps1 -Mirror`.

## 5. Weryfikacja po wdrożeniu (co przeszło)

Sprawdzone przez `curl` (z `--ssl-no-revoke` z powodu Nortona):

| Test | Wynik |
|---|---|
| `http://vistechnologie.pl/` | **301 → https** ✅ |
| `https://vistechnologie.pl/` (Accept-Language: pl) | **200**, treść = nowy design (`dx-nav`) ✅ |
| `https://vistechnologie.pl/` (Accept-Language: en) | **302 → /en/** (auto-język) ✅ |
| `https://vistechnologie.pl/en/` | **200** ✅ |
| `/uslugi/`, `/realizacje/`, `/kontakt/`, `/polityka-prywatnosci/`, `/en/services/` | **200** ✅ |
| `https://vistechnologie.pl/nie-ma-takiej-strony/` | **404** (nasza strona błędu) ✅ |
| `.htaccess` na serwerze | Obecny (1075 B), treść potwierdzona pobraniem ✅ |
| SSL serwera | Działa (https odpowiada); prawdziwy cert do potwierdzenia zewnętrznie ⚠️ |
| `www.vistechnologie.pl` | **000 — nie odpowiada** ❌ (patrz punkt 6) |

## 6. Do zrobienia po stronie klienta

1. **`www.vistechnologie.pl`** nie działa (nie łączy się). W panelu Kylos: dodać **rekord DNS `www`** (A/CNAME) i objąć `www` **certyfikatem** Let's Encrypt. Reguła `www → bez-www` w `.htaccess` już jest.
2. **Certyfikat SSL** — zweryfikować zewnętrznie: `https://www.ssllabs.com/ssltest/analyze.html?d=vistechnologie.pl` (z tej maszyny zasłania go Norton).
3. **Formularz kontaktowy + skrzynki pocztowe:**
   - Odbiorca: **`biuro@vistechnologie.pl`** (musi odbierać).
   - Nadawca (From): **`formularz@vistechnologie.pl`** (skrzynka lub **alias** — wymóg wiarygodności/SPF). Alternatywa: zmienić nadawcę na `biuro@` w `wyslij.php`, wtedy potrzebna tylko jedna skrzynka.
   - Przetestować z przeglądarki (patrz punkt 7).
4. **SPF / DKIM** domeny — żeby mail nie wpadał do spamu (Gmail/Outlook).
5. Wizualnie: belka cookies, polskie znaki, DevTools→Network = brak połączeń zewnętrznych.

## 7. Jak przetestować formularz (z przeglądarki)

Automatyczny test z zewnątrz zablokował się (fail2ban po POST-ach), a dostarczenie maila i tak trzeba potwierdzić w skrzynce. Procedura:

1. Otwórz `https://vistechnologie.pl/kontakt/`.
2. **Poprawny:** wypełnij wszystkie pola + zaznacz zgodę → wyślij → powinno przekierować na `/kontakt/dziekujemy/`, a mail dotrzeć na **`biuro@vistechnologie.pl`** (sprawdź też SPAM). Reply-To = adres wpisany w formularzu.
3. **Błędny:** wyślij bez zgody/e-maila → przekierowanie na `/kontakt/?blad=1` + czerwony komunikat.
4. **EN:** to samo z `/en/contact/` → `/en/contact/thank-you/`.

Logika skryptu (`site/static/kontakt/wyslij.php`): wymagane `name`, poprawny `email`, `message`, zgoda `rodo`; honeypot `www` (bot → udawany sukces, nic nie wysyła). Sukces = `mail()` przyjęty przez serwer — **dostarczenie** do skrzynki potwierdza się tylko w skrzynce.
