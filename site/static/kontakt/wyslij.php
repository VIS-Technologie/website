<?php
declare(strict_types=1);

const RECIPIENT = 'biuro@vistechnologie.pl';
const SENDER    = 'formularz@vistechnologie.pl'; // skrzynka/alias w domenie — wymóg SPF (patrz docs/wdrozenie.md)

function cut(string $v, int $max): string {
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

function field(string $k, int $max = 200): string {
    $v = isset($_POST[$k]) && is_string($_POST[$k]) ? trim($_POST[$k]) : '';
    $v = str_replace(["\r", "\n"], ' ', $v); // ochrona przed header injection
    return cut($v, $max);
}

$lang = field('lang') === 'en' ? 'en' : 'pl';
$form = field('form');
if ($form !== 'meeting' && $form !== 'pilot') { $form = 'contact'; }

const FORM_URLS = [
    'contact' => ['pl' => '/kontakt/',            'en' => '/en/contact/'],
    'meeting' => ['pl' => '/umow-spotkanie/',     'en' => '/en/book-a-meeting/'],
    'pilot'   => ['pl' => '/pilotaz-monitoringu/', 'en' => '/en/crane-monitoring-pilot/'],
];
$okUrl  = $lang === 'en' ? '/en/contact/thank-you/' : '/kontakt/dziekujemy/';
$errUrl = FORM_URLS[$form][$lang] . ($lang === 'en' ? '?error=1' : '?blad=1');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { header('Location: ' . $errUrl); exit; }

// Honeypot: bot wypełnił ukryte pole — udawaj sukces, nic nie wysyłaj.
if (field('www') !== '') { header('Location: ' . $okUrl); exit; }

$name    = field('name');
$email   = field('email');
$company = field('company');
$topic   = field('topic');
$message = isset($_POST['message']) && is_string($_POST['message']) ? trim($_POST['message']) : '';
$message = cut($message, 5000);
$rodo    = isset($_POST['rodo']);

// Selecty: wartość spoza białej listy traktujemy jak pustą (błąd, gdy wymagane).
// Etykiety PL — mail idzie zawsze do zespołu, niezależnie od języka formularza.
function pick(string $k, array $allowed): string {
    $v = field($k);
    return array_key_exists($v, $allowed) ? $v : '';
}

$TOPICS  = ['crane' => 'Monitoring suwnic', 'localcontent' => 'Local content',
            'integrations' => 'Integracje IT-OT', 'other' => 'Inny temat'];
$MODES   = ['online' => 'Online', 'phone' => 'Telefon',
            'at-us' => 'U nas (Banino)', 'at-you' => 'U klienta'];
$CRANES  = ['1-2' => '1-2', '3-5' => '3-5', '6-10' => '6-10', '10plus' => 'ponad 10'];
$CTYPES  = ['pomostowe' => 'Pomostowe', 'bramowe' => 'Bramowe',
            'polbramowe' => 'Polbramowe', 'inne' => 'Rozne / inne'];
$HORIZON = ['asap' => 'Jak najszybciej', 'quarter' => 'W tym kwartale',
            'year' => 'W tym roku', 'research' => 'Na razie rozeznanie'];

$mtopic   = pick('topic', $TOPICS);
$mode     = pick('mode', $MODES);
$slots    = field('slots');
$cranes   = pick('cranes', $CRANES);
$ctype    = pick('ctype', $CTYPES);
$location = field('location');
$horizon  = pick('horizon', $HORIZON);

$baseOk = $name !== '' && $rodo && filter_var($email, FILTER_VALIDATE_EMAIL);
if ($form === 'meeting') {
    $valid = $baseOk && $mtopic !== '' && $mode !== '' && $slots !== '';
} elseif ($form === 'pilot') {
    $valid = $baseOk && $company !== '' && $cranes !== '' && $ctype !== ''
           && $location !== '' && $horizon !== '';
} else {
    $valid = $baseOk && $message !== '';
}
if (!$valid) { header('Location: ' . $errUrl); exit; }

$subjects = [
    'contact' => ['pl' => 'Zapytanie ze strony',      'en' => 'Zapytanie ze strony'],
    'meeting' => ['pl' => 'Umówienie spotkania',      'en' => 'Meeting request'],
    'pilot'   => ['pl' => 'Zgłoszenie pilotażu',      'en' => 'Pilot deployment request'],
];
$subject = '[vistechnologie.pl] ' . ($form === 'contact' && $topic !== '' ? $topic : $subjects[$form][$lang]);

$body = "Imię i nazwisko: $name\n"
      . "E-mail: $email\n"
      . "Firma: $company\n"
      . "Język formularza: $lang\n";
if ($form === 'meeting') {
    $body .= "\n--- Spotkanie ---\n"
           . "Temat rozmowy: {$TOPICS[$mtopic]}\n"
           . "Forma: {$MODES[$mode]}\n"
           . "Preferowany termin: $slots\n";
} elseif ($form === 'pilot') {
    $body .= "\n--- Pilotaż monitoringu suwnic ---\n"
           . "Liczba suwnic: {$CRANES[$cranes]}\n"
           . "Typ suwnic: {$CTYPES[$ctype]}\n"
           . "Lokalizacja: $location\n"
           . "Horyzont startu: {$HORIZON[$horizon]}\n";
} else {
    $body .= "Temat: $topic\n";
}
$body .= "\nTreść:\n" . ($message !== '' ? $message : '(bez wiadomości)') . "\n";
$headers = implode("\r\n", [
    'From: Vis Technologie <' . SENDER . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = mail(RECIPIENT, $encSubject, $body, $headers);
header('Location: ' . ($sent ? $okUrl : $errUrl));
exit;
