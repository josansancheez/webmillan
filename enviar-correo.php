<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios e Interiorismo S.L.
 * Backend de Formulario de Contacto con Protección Anti-Duplicados e Idempotencia
 * Archivo: enviar-correo.php
 * ============================================================================
 */

declare(strict_types=1);

// Configuración de cabeceras de seguridad y JSON
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Iniciar sesión segura para control de token e idempotencia
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 3600,
        'path'     => '/',
        'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// Configuraciones principales del destinatario y tiempos de bloqueo
const RECIPIENT_EMAIL      = 'millan@millanchiclana.com';
const COMPANY_LEGAL_NAME   = 'Millán Servicios Montajes e Interiorismos S.L.';
const COMPANY_BRAND_NAME   = 'Millán Chiclana';
const COOLDOWN_SECONDS     = 60; // Mínimo 60 segundos entre envíos por sesión/IP

// Inicializar estructuras de sesión si no existen
if (!isset($_SESSION['processed_keys']) || !is_array($_SESSION['processed_keys'])) {
    $_SESSION['processed_keys'] = [];
}
if (!isset($_SESSION['processed_hashes']) || !is_array($_SESSION['processed_hashes'])) {
    $_SESSION['processed_hashes'] = [];
}

/**
 * 1. ENDPOINT GET PARA GENERAR TOKEN ÚNICO DE SESIÓN (?action=token)
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['action'] ?? '') === 'token') {
    if (empty($_SESSION['form_token'])) {
        $_SESSION['form_token'] = bin2hex(random_bytes(32));
    }
    echo json_encode([
        'success'    => true,
        'form_token' => $_SESSION['form_token'],
    ]);
    exit;
}

/**
 * 2. SOLO PERMITIR PETICIONES POST PARA EL ENVÍO DEL FORMULARIO
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Utiliza el formulario de contacto oficial.',
    ]);
    exit;
}

/**
 * 3. FILTRO ANTI-SPAM HONEYPOT
 * Si el campo oculto `website_hp` trae contenido, es un bot automatizado.
 * Devolvemos éxito silencioso sin enviar ningún correo.
 */
$honeypot = trim((string)($_POST['website_hp'] ?? ''));
if ($honeypot !== '') {
    echo json_encode([
        'success' => true,
        'title'   => '¡Mensaje recibido!',
        'message' => 'Gracias por contactar con Millán Chiclana.',
    ]);
    exit;
}

/**
 * 4. RECOGIDA Y SANEAMIENTO DE CAMPOS DEL FORMULARIO
 */
$nombre         = trim(strip_tags((string)($_POST['nombre'] ?? '')));
$email          = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_SANITIZE_EMAIL);
$telefono       = trim(strip_tags((string)($_POST['telefono'] ?? '')));
$asunto         = trim(strip_tags((string)($_POST['asunto'] ?? '')));
$sedeInteres    = trim(strip_tags((string)($_POST['sede_interes'] ?? 'Consulta General')));
$mensaje        = trim(strip_tags((string)($_POST['mensaje'] ?? '')));
$privacidad     = isset($_POST['privacidad']) && ($_POST['privacidad'] === '1' || $_POST['privacidad'] === 'on');
$formToken      = trim((string)($_POST['form_token'] ?? ''));
$idempotencyKey = trim((string)($_POST['idempotency_key'] ?? ''));

// Prevenir inyección de cabeceras de correo en campos de una línea
$cleanSingleLine = static function (string $value): string {
    return str_replace(["\r", "\n", "%0a", "%0d", "Content-Type:", "bcc:", "cc:", "to:"], '', $value);
};

$nombre      = $cleanSingleLine($nombre);
$email       = $cleanSingleLine($email);
$telefono    = $cleanSingleLine($telefono);
$asunto      = $cleanSingleLine($asunto);
$sedeInteres = $cleanSingleLine($sedeInteres);

/**
 * 5. VALIDACIÓN DE CAMPOS OBLIGATORIOS
 */
if (mb_strlen($nombre) < 2) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, introduce tu nombre completo.',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, introduce una dirección de correo electrónico válida.',
    ]);
    exit;
}

if (!preg_match('/^[0-9+\s()-]{9,20}$/', $telefono)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, indica un número de teléfono válido (mínimo 9 dígitos).',
    ]);
    exit;
}

if ($asunto === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, selecciona o escribe el asunto de tu consulta.',
    ]);
    exit;
}

if (mb_strlen($mensaje) < 10) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, detalla un poco más tu mensaje (mínimo 10 caracteres).',
    ]);
    exit;
}

if (!$privacidad) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Debes aceptar la Política de Privacidad para poder enviar tu consulta.',
    ]);
    exit;
}

/**
 * 6. CONTROL DE IDEMPOTENCIA Y ANTI-DUPLICADOS (CONEXIONES MÓVILES LENTAS)
 * Si el usuario en el móvil pulsa varias veces o el navegador reintenta la petición:
 *  - Comprobamos el hash del contenido enviado.
 *  - Comprobamos la clave de idempotencia (`idempotency_key`).
 *  - Comprobamos el token único de sesión (`$_SESSION['form_token']`).
 *  - Comprobamos la ventana de 60 segundos por Sesión y por IP.
 * Si se detecta reintento duplicado, NO se vuelve a enviar el correo, pero se
 * devuelve confirmación amigable al usuario.
 */
$now = time();
$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$ipHash = hash('sha256', 'millan_ip_salt_' . $clientIp);
$payloadHash = hash('sha256', mb_strtolower($email . '|' . $telefono . '|' . $asunto . '|' . $mensaje));

// 6.1. ¿Se ha procesado ya exactamente este mismo mensaje o clave de idempotencia?
if (
    ($idempotencyKey !== '' && in_array($idempotencyKey, $_SESSION['processed_keys'], true)) ||
    in_array($payloadHash, $_SESSION['processed_hashes'], true)
) {
    echo json_encode([
        'success'             => true,
        'duplicate_prevented' => true,
        'title'               => '¡Tu consulta ya ha sido enviada!',
        'message'             => 'Hemos recibido tu mensaje correctamente. Nuestro equipo te responderá muy pronto.',
        'next_token'          => $_SESSION['form_token'] ?? bin2hex(random_bytes(32)),
    ]);
    exit;
}

// 6.2. Control de ventana de 60 segundos en la misma sesión PHP
$lastSessionSubmit = (int)($_SESSION['last_submit_time'] ?? 0);
if (($now - $lastSessionSubmit) < COOLDOWN_SECONDS) {
    echo json_encode([
        'success'             => true,
        'duplicate_prevented' => true,
        'title'               => 'Mensaje enviado correctamente',
        'message'             => 'Tu solicitud ya ha sido recibida por nuestro equipo. Te responderemos lo antes posible.',
        'next_token'          => $_SESSION['form_token'] ?? bin2hex(random_bytes(32)),
    ]);
    exit;
}

// 6.3. Control de ventana de 60 segundos por IP en archivo temporal con bloqueo exclusivo (flock)
$rateLimitFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'millan_rl_' . substr($ipHash, 0, 24) . '.lock';
$fp = @fopen($rateLimitFile, 'c+');
if ($fp !== false) {
    if (flock($fp, LOCK_EX)) {
        $content = stream_get_contents($fp);
        $data = $content ? json_decode($content, true) : null;
        if (is_array($data)) {
            $lastIpTime = (int)($data['timestamp'] ?? 0);
            $lastIpPayload = (string)($data['payload_hash'] ?? '');
            if (($now - $lastIpTime) < COOLDOWN_SECONDS || $lastIpPayload === $payloadHash) {
                flock($fp, LOCK_UN);
                fclose($fp);
                echo json_encode([
                    'success'             => true,
                    'duplicate_prevented' => true,
                    'title'               => '¡Solicitud recibida!',
                    'message'             => 'Tu consulta ya ha sido registrada en Millán Chiclana. Te responderemos a la mayor brevedad.',
                    'next_token'          => $_SESSION['form_token'] ?? bin2hex(random_bytes(32)),
                ]);
                exit;
            }
        }
        // Registrar el envío actual en el archivo de bloqueo antes de disparar mail()
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode([
            'timestamp'    => $now,
            'payload_hash' => $payloadHash,
        ]));
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

// 6.4. Validar token de sesión si estaba presente en la sesión activa
if (!empty($_SESSION['form_token']) && $formToken !== '' && !hash_equals($_SESSION['form_token'], $formToken)) {
    // Si el token ya rotó por un primer clic en curso, significa que ya se procesó el primer envío
    echo json_encode([
        'success'             => true,
        'duplicate_prevented' => true,
        'title'               => '¡Consulta registrada correctamente!',
        'message'             => 'Tu mensaje ya se había enviado en el primer intento. Nuestro equipo de Millán Chiclana te responderá a la mayor brevedad.',
        'next_token'          => $_SESSION['form_token'],
    ]);
    exit;
}

/**
 * 7. CONSTRUCCIÓN Y ENVÍO DEL CORREO ELECTRÓNICO ÚNICO
 */
$emailSubject = '=?UTF-8?B?' . base64_encode("[Web Millán Chiclana] $asunto - $nombre") . '?=';
$fechaHora = date('d/m/Y H:i:s');

$htmlBody = '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva consulta web - Millán Chiclana</title>
</head>
<body style="margin:0;padding:24px;background-color:#F9FAFB;font-family:Arial,sans-serif;color:#18181B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background-color:#111111;padding:20px 24px;color:#FFFFFF;">
        <h2 style="margin:0;font-size:20px;">' . htmlspecialchars(COMPANY_BRAND_NAME, ENT_QUOTES, 'UTF-8') . ' · Nueva Consulta Web</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#F4F4F5;">' . htmlspecialchars(COMPANY_LEGAL_NAME, ENT_QUOTES, 'UTF-8') . ' | Pol. Ind. Pelagatos, Chiclana</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td width="35%" style="font-weight:bold;color:#3F3F46;">Nombre Completo:</td>
            <td>' . htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') . '</td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;">Teléfono directo:</td>
            <td><a href="tel:' . htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') . '" style="color:#111111;font-weight:bold;">' . htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') . '</a></td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;">Correo Electrónico:</td>
            <td><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" style="color:#111111;">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;">Asunto:</td>
            <td><strong>' . htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8') . '</strong></td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;">Sede / Departamento:</td>
            <td>' . htmlspecialchars($sedeInteres, ENT_QUOTES, 'UTF-8') . '</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:16px;">
              <div style="font-weight:bold;color:#111111;margin-bottom:8px;">Mensaje del cliente:</div>
              <div style="background:#F9FAFB;padding:16px;border-radius:8px;border:1px solid #E5E7EB;white-space:pre-line;line-height:1.6;">' . nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8')) . '</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#F3F4F6;padding:14px 24px;font-size:12px;color:#52525B;">
        Enviado el ' . $fechaHora . ' · Protección Anti-Duplicados Activa (ID: ' . htmlspecialchars(substr($payloadHash, 0, 10), ENT_QUOTES, 'UTF-8') . ') · RGPD Aceptado
      </td>
    </tr>
  </table>
</body>
</html>';

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Web Millan Chiclana <no-responder@millanchiclana.com>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: MillanChiclana-AntiDupMailer/1.0',
];

// Envío del correo
$mailSent = @mail(RECIPIENT_EMAIL, $emailSubject, $htmlBody, implode("\r\n", $headers));

// Actualizar estado de sesión e invalidar/rotar token para impedir duplicados posteriores
$_SESSION['last_submit_time'] = $now;
$_SESSION['form_token'] = bin2hex(random_bytes(32));
if ($idempotencyKey !== '') {
    $_SESSION['processed_keys'][] = $idempotencyKey;
}
$_SESSION['processed_hashes'][] = $payloadHash;

echo json_encode([
    'success'    => true,
    'mail_sent'  => $mailSent,
    'title'      => '¡Consulta enviada correctamente!',
    'message'    => 'Gracias por contactar con Millán Chiclana. Hemos registrado tu mensaje y nuestro equipo de ' . $sedeInteres . ' te responderá lo antes posible.',
    'next_token' => $_SESSION['form_token'],
]);
exit;
