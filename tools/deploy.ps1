# Wdrożenie vistechnologie.pl na hosting Kylos przez FTP (WinSCP).
# Użycie:  powershell -ExecutionPolicy Bypass -File tools/deploy.ps1 [-Mirror] [-DryRun]
#   -Mirror : usuwa z serwera pliki, których nie ma w dist/ (pełna synchronizacja).
#             Użyj świadomie — skasuje pozostałości starej strony.
#   -DryRun : tylko pokazuje, co zostałoby wgrane (bez zmian na serwerze).
# Wymaga: WinSCP (winget install WinSCP), Python w PATH, tools/.env.deploy z danymi FTP.

param(
    [switch]$Mirror,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot

# --- 1. Wczytaj konfigurację ---
$envFile = Join-Path $PSScriptRoot '.env.deploy'
if (-not (Test-Path $envFile)) {
    Write-Error "Brak $envFile. Skopiuj tools/.env.deploy.example jako tools/.env.deploy i uzupełnij dane FTP z panelu Kylos."
}
$cfg = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z_]+)\s*=\s*(.*?)\s*$' -and $_ -notmatch '^\s*#') { $cfg[$Matches[1]] = $Matches[2] }
}
foreach ($k in 'FTP_HOST','FTP_USER','FTP_PASS','FTP_REMOTE_DIR') {
    if (-not $cfg[$k]) { Write-Error "Brak wartości $k w .env.deploy" }
}
$protocol = if ($cfg['FTP_PROTOCOL']) { $cfg['FTP_PROTOCOL'] } else { 'ftpes' }

# --- 2. Zbuduj stronę ---
Write-Host "==> Build: py site/build.py" -ForegroundColor Cyan
Push-Location $repo
try {
    py site/build.py
    if ($LASTEXITCODE -ne 0) { Write-Error "Build nie przeszedł — wdrożenie przerwane." }
} finally { Pop-Location }

# --- 3. Znajdź WinSCP ---
$winscp = @(
    "$env:ProgramFiles\WinSCP\WinSCP.com",
    "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
    "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $winscp) {
    Write-Error "Nie znaleziono WinSCP. Zainstaluj:  winget install WinSCP  — i uruchom ponownie."
}

# --- 4. Skrypt WinSCP ---
# Hasło idzie przez /parameter i placeholder %1% — nie wpisujemy go do pliku skryptu.
$dist = Join-Path $repo 'dist'
$remote = $cfg['FTP_REMOTE_DIR']

$sync = 'synchronize remote -transfer=automatic'
if ($Mirror) { $sync += ' -delete' }
if ($DryRun) { $sync += ' -preview' }

# SFTP: pojedyncze polaczenie (port 22), omija problem kanalu danych pasywnego FTP.
# FTP/FTPES: tryb pasywny. -hostkey="*" akceptuje klucz hosta (mozna przypiac konkretny).
$openExtra = if ($protocol -eq 'sftp') { '-hostkey="*"' } else { '-passive=on' }

$lines = @(
    'option batch abort',
    'option confirm off',
    "open $protocol`://$($cfg['FTP_USER'])@$($cfg['FTP_HOST'])/ $openExtra -password=`"%1%`"",
    "$sync `"$dist`" `"$remote`"",
    'close',
    'exit'
)
$tmp = New-TemporaryFile
Set-Content -Path $tmp -Value ($lines -join "`r`n") -Encoding UTF8

Write-Host "==> Wgrywam dist/ -> $($cfg['FTP_HOST'])$remote ($protocol)$(if($DryRun){' [DRY RUN]'})$(if($Mirror){' [MIRROR: usuwa nadmiarowe pliki]'})" -ForegroundColor Cyan
try {
    & $winscp /ini=nul /script="$tmp" /parameter // $cfg['FTP_PASS'] 2>&1 | ForEach-Object {
        if ($_ -notmatch [regex]::Escape($cfg['FTP_PASS'])) { $_ }   # nie echuj hasła
    }
    $code = $LASTEXITCODE
} finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
}

if ($code -ne 0) {
    Write-Error "WinSCP zakończył się kodem $code — sprawdź dane w .env.deploy i czy hosting akceptuje $protocol (spróbuj FTP_PROTOCOL=ftp)."
}

Write-Host "==> Gotowe. Przejdź checklistę po wdrożeniu z docs/wdrozenie.md" -ForegroundColor Green
Write-Host "    (m.in. https://vistechnologie.pl/ , /en/ , test formularza PL i EN, strona 404, brak połączeń zewnętrznych)"
