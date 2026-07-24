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

$lang   = field('lang') === 'en' ? 'en' : 'pl';
$okUrl  = $lang === 'en' ? '/en/contact/thank-you/' : '/kontakt/dziekujemy/';
$errUrl = $lang === 'en' ? '/en/contact/?error=1'   : '/kontakt/?blad=1';

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

if ($name === '' || $message === '' || !$rodo || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $errUrl);
    exit;
}

$subject = $topic !== '' ? '[vistechnologie.pl] ' . $topic : '[vistechnologie.pl] Zapytanie ze strony';
$body = "Imię i nazwisko: $name\n"
      . "E-mail: $email\n"
      . "Firma: $company\n"
      . "Temat: $topic\n"
      . "Język formularza: $lang\n\n"
      . "Treść:\n$message\n";
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
