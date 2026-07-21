# Wdrożenie vistechnologie.pl na hosting Kylos

## Przed wdrożeniem (jednorazowo, panel Kylos)

1. **PHP**: ustaw wersję PHP ≥ 8.0 dla domeny (panel → ustawienia PHP). Funkcja `mail()` musi być włączona (na Kylos jest domyślnie).
   - Upewnij się, że rozszerzenie `mbstring` jest włączone, a `mbstring.internal_encoding` pozostaje domyślne (UTF-8) — mailer używa `mb_substr()` bez jawnego kodowania.
2. **Skrzynka nadawcza**: utwórz skrzynkę lub alias `formularz@vistechnologie.pl` (panel → poczta). Z tego adresu wychodzą maile z formularza (wymóg SPF — mail z adresu w domenie nie wpada do spamu). Odbiorcą zgłoszeń jest `biuro@vistechnologie.pl`.
3. **SSL**: włącz certyfikat Let's Encrypt dla `vistechnologie.pl` i `www.vistechnologie.pl`.
4. **Prawnik**: polityka prywatności i cookies powinna zostać przejrzana przez prawnika przed publikacją (dokument przygotowany na bazie szablonu — nie stanowi porady prawnej).

## Build i upload

1. Lokalnie: `python site/build.py` — musi zakończyć się `OK` (checker czysty).
2. Połącz się z FTP Kylos (dane w panelu Kylos; host ftp, port 21, TLS jeśli dostępny).
3. Wgraj **zawartość** katalogu `dist/` do katalogu domeny (zwykle `public_html/` lub katalog wskazany w panelu):
   - tryb binarny (fonty .woff2, favicon.ico, apple-touch-icon.png),
   - plik `.htaccess` też musi trafić na serwer (bywa ukryty w kliencie FTP — włącz pokazywanie plików ukrytych).
4. W polityce prywatności zastąp „[data publikacji strony]" faktyczną datą publikacji:
   w `site/content.json` klucze `legal.updated` (PL i EN) → przebuduj (`python site/build.py`) → wgraj ponownie zmienione pliki.

## Checklist po wdrożeniu

- [ ] `https://vistechnologie.pl/` otwiera stronę główną PL; `https://vistechnologie.pl/en/` — EN.
- [ ] `http://` przekierowuje na `https://`; `www.` przekierowuje na wersję bez www.
- [ ] Wszystkie podstrony działają: `/uslugi/`, `/realizacje/`, `/kontakt/`, `/polityka-prywatnosci/` + `/en/services/`, `/en/case-studies/`, `/en/contact/`, `/en/privacy-policy/`.
- [ ] Polskie znaki wyświetlają się poprawnie (font Inter, subset latin-ext).
- [ ] Błędny adres (np. `/nie-ma-takiej-strony/`) pokazuje stronę 404.
- [ ] **Formularz — test poprawny**: wypełnij wszystkie pola + zgoda → redirect na `/kontakt/dziekujemy/`, mail dociera na `biuro@vistechnologie.pl` (sprawdź też spam), Reply-To wskazuje adres nadawcy.
- [ ] **Formularz — test błędny**: wyślij bez zgody/e-maila (np. z wyłączonym JS albo przez `curl -X POST`) → redirect na `/kontakt/?blad=1` i czerwony komunikat.
- [ ] **Formularz — EN**: test z `/en/contact/` → redirect na `/en/contact/thank-you/`.
- [ ] Mail NIE wpada do spamu u popularnych dostawców (Gmail/Outlook). Jeśli wpada: sprawdź w panelu Kylos rekord SPF domeny (powinien obejmować serwery pocztowe Kylos) i rozważ DKIM.
- [ ] Belka cookies pojawia się przy pierwszej wizycie i nie wraca po kliknięciu „Rozumiem".
- [ ] DevTools → Network: strona nie łączy się z żadną domeną zewnętrzną.

## Po stronie klienta (materiały — do podmiany, gdy będą)

- Zdjęcia założycieli, zrzuty ekranu systemów (case studies), logotypy partnerów (APT, Chordata, Fudo Security).
- Pisemna zgoda PCC Intermodal na użycie nazwy (do czasu zgody: nazwa w tekście — już uzgodnione) i ewentualnie logo.
- Finalne tłumaczenia EN (obecne są robocze) — podmiana w `site/content.json` → rebuild.
- Profil LinkedIn firmy (po założeniu dodać link w stopce — edycja `site/build.py`, funkcja `footer`).
