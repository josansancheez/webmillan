<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios Montajes e Interiorismos S.L.
 * Backend de Formulario de Contacto con Protección Anti-Duplicados e Idempotencia
 * Compatible universalmente con PHP 5.3 - PHP 8.4+ (Hostalia / Apache / FPM)
 * Archivo: enviar-correo.php
 * ============================================================================
 */

@ob_start();
@error_reporting(0);
@ini_set('display_errors', '0');

// Configuraciones principales del destinatario y remitente corporativo real
// IMPORTANTE (Hostalia / serviciodecorreo.es): El remitente From y Return-Path
// debe ser el buzón real existente en el dominio (millan@millanchiclana.com)
// para superar la validación SPF/autenticación del servidor de correo.
define('RECIPIENT_EMAIL', 'millan@millanchiclana.com');
define('SENDER_WEB_EMAIL', 'millan@millanchiclana.com');
define('COMPANY_LEGAL_NAME', 'Millán Servicios Montajes e Interiorismos S.L.');
define('COMPANY_BRAND_NAME', 'Millán Chiclana');
define('COOLDOWN_SECONDS', 60);   // Mínimo 60 segundos entre envíos por sesión/IP
define('DEDUP_TTL_SECONDS', 600); // 10 minutos de bloqueo global para el mismo mensaje exacto

@date_default_timezone_set('Europe/Madrid');

$GLOBALS['MILLAN_RESPONSE_SENT'] = false;

/**
 * Envía siempre una respuesta JSON limpia vaciando cualquier buffer previo
 */
function millan_send_json($payload, $statusCode)
{
    $GLOBALS['MILLAN_RESPONSE_SENT'] = true;
    while (@ob_get_level() > 0) {
        @ob_end_clean();
    }
    if (!headers_sent()) {
        if ($statusCode !== 200) {
            if (function_exists('http_response_code')) {
                @http_response_code($statusCode);
            } else {
                @header('HTTP/1.1 ' . (int)$statusCode . ' Error');
            }
        }
        @header('Content-Type: application/json; charset=UTF-8');
        @header('X-Content-Type-Options: nosniff');
        @header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        @header('Pragma: no-cache');
    }
    echo json_encode($payload);
    exit;
}

/**
 * Captura de seguridad ante cualquier error fatal inesperado del servidor PHP
 */
function millan_shutdown_handler()
{
    if (!empty($GLOBALS['MILLAN_RESPONSE_SENT'])) {
        return;
    }
    $err = @error_get_last();
    if ($err && isset($err['type']) && in_array((int)$err['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR), true)) {
        millan_send_json(array(
            'success' => false,
            'message' => 'Error interno en el servidor al procesar la solicitud.',
        ), 500);
    }
}
@register_shutdown_function('millan_shutdown_handler');

/**
 * Funciones auxiliares compatibles con cualquier versión de PHP (5.3 a 8.4+)
 * y sin depender de extensiones opcionales como mbstring.
 */
function millan_generate_token()
{
    if (function_exists('random_bytes')) {
        try {
            return bin2hex(random_bytes(32));
        } catch (Exception $e) {
            // Fallback si CSPRNG falla
        }
    }
    if (function_exists('openssl_random_pseudo_bytes')) {
        $bytes = @openssl_random_pseudo_bytes(32);
        if ($bytes !== false) {
            return bin2hex($bytes);
        }
    }
    return hash('sha256', uniqid((string)mt_rand(), true) . microtime(true));
}

function millan_hash_equals($known, $user)
{
    $known = (string)$known;
    $user  = (string)$user;
    if (function_exists('hash_equals')) {
        return hash_equals($known, $user);
    }
    if (strlen($known) !== strlen($user)) {
        return false;
    }
    $res = 0;
    $len = strlen($known);
    for ($i = 0; $i < $len; $i++) {
        $res |= ord($known[$i]) ^ ord($user[$i]);
    }
    return $res === 0;
}

function millan_strlen($str)
{
    $str = (string)$str;
    if (function_exists('mb_strlen')) {
        return (int)@mb_strlen($str, 'UTF-8');
    }
    $decoded = @preg_replace('/[\x80-\xBF]/', '', $str);
    return strlen($decoded !== null ? $decoded : $str);
}

function millan_strtolower($str)
{
    $str = (string)$str;
    if (function_exists('mb_strtolower')) {
        return (string)@mb_strtolower($str, 'UTF-8');
    }
    return strtolower($str);
}

function millan_clean_single_line($value)
{
    $value = (string)$value;
    return str_replace(
        array("\r", "\n", "%0a", "%0d", "%0A", "%0D", "Content-Type:", "content-type:", "bcc:", "cc:", "to:"),
        '',
        $value
    );
}

function millan_smtp_read($fp)
{
    $data = '';
    while ($str = @fgets($fp, 515)) {
        $data .= $str;
        if (substr($str, 3, 1) === ' ') {
            break;
        }
    }
    return $data;
}

/**
 * Envío SMTP directo (127.0.0.1:25 o mx.serviciodecorreo.es:25)
 * por si mail() está deshabilitado o restringido en php.ini
 */
function millan_send_smtp_socket($smtpHost, $smtpPort, $to, $from, $replyTo, $subject, $htmlBody)
{
    $fp = @fsockopen($smtpHost, (int)$smtpPort, $errno, $errstr, 5);
    if (!$fp) {
        return false;
    }
    @stream_set_timeout($fp, 5);

    $greeting = millan_smtp_read($fp);
    if (strpos($greeting, '220') !== 0) {
        @fclose($fp);
        return false;
    }

    $heloHost = isset($_SERVER['HTTP_HOST']) ? preg_replace('/[^a-zA-Z0-9.-]/', '', (string)$_SERVER['HTTP_HOST']) : 'millanchiclana.com';
    if ($heloHost === '') {
        $heloHost = 'millanchiclana.com';
    }

    @fwrite($fp, 'EHLO ' . $heloHost . "\r\n");
    $ehlo = millan_smtp_read($fp);
    if (strpos($ehlo, '250') !== 0) {
        @fwrite($fp, 'HELO ' . $heloHost . "\r\n");
        if (strpos(millan_smtp_read($fp), '250') !== 0) {
            @fclose($fp);
            return false;
        }
    }

    @fwrite($fp, 'MAIL FROM:<' . $from . ">\r\n");
    if (strpos(millan_smtp_read($fp), '250') !== 0) {
        @fclose($fp);
        return false;
    }

    @fwrite($fp, 'RCPT TO:<' . $to . ">\r\n");
    $rcpt = millan_smtp_read($fp);
    if (strpos($rcpt, '250') !== 0 && strpos($rcpt, '251') !== 0) {
        @fclose($fp);
        return false;
    }

    @fwrite($fp, "DATA\r\n");
    if (strpos(millan_smtp_read($fp), '354') !== 0) {
        @fclose($fp);
        return false;
    }

    $msg  = 'Date: ' . date('r') . "\r\n";
    $msg .= 'To: <' . $to . ">\r\n";
    $msg .= 'From: Millan Chiclana Web <' . $from . ">\r\n";
    $msg .= 'Reply-To: <' . $replyTo . ">\r\n";
    $msg .= 'Subject: ' . $subject . "\r\n";
    $msg .= 'Message-ID: <' . md5(uniqid((string)mt_rand(), true)) . '@millanchiclana.com>' . "\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "X-Mailer: MillanChiclana-Mailer/3.0\r\n\r\n";
    $msg .= chunk_split(base64_encode($htmlBody)) . "\r\n.\r\n";

    @fwrite($fp, $msg);
    $dataResp = millan_smtp_read($fp);
    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);

    return (strpos($dataResp, '250') === 0);
}

// Iniciar sesión segura compatible con PHP 5.3, 5.6, 7.0, 7.2, 7.4 y 8.x
$isSecure = (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off')
    || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string)$_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https');

$sessionNotStarted = function_exists('session_status')
    ? (session_status() === PHP_SESSION_NONE)
    : (session_id() === '');

if ($sessionNotStarted) {
    if (defined('PHP_VERSION_ID') && PHP_VERSION_ID >= 70300) {
        @session_set_cookie_params(array(
            'lifetime' => 3600,
            'path'     => '/',
            'secure'   => $isSecure,
            'httponly' => true,
            'samesite' => 'Lax',
        ));
    } else {
        @session_set_cookie_params(3600, '/', '', $isSecure, true);
    }
    @session_start();
}

// Inicializar estructuras de sesión si no existen
if (!isset($_SESSION['processed_keys']) || !is_array($_SESSION['processed_keys'])) {
    $_SESSION['processed_keys'] = array();
}
if (!isset($_SESSION['processed_hashes']) || !is_array($_SESSION['processed_hashes'])) {
    $_SESSION['processed_hashes'] = array();
}

$requestMethod = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';
$actionParam   = isset($_GET['action']) ? (string)$_GET['action'] : '';

/**
 * 1. ENDPOINT GET PARA GENERAR TOKEN ÚNICO DE SESIÓN (?action=token)
 */
if ($requestMethod === 'GET' && $actionParam === 'token') {
    if (empty($_SESSION['form_token'])) {
        $_SESSION['form_token'] = millan_generate_token();
    }
    millan_send_json(array(
        'success'    => true,
        'form_token' => $_SESSION['form_token'],
    ), 200);
}

/**
 * 2. SOLO PERMITIR PETICIONES POST PARA EL ENVÍO DEL FORMULARIO
 */
if ($requestMethod !== 'POST') {
    millan_send_json(array(
        'success' => false,
        'message' => 'Método no permitido. Utiliza el formulario de contacto oficial.',
    ), 405);
}

/**
 * 3. FILTRO ANTI-SPAM HONEYPOT
 */
$honeypot = isset($_POST['website_hp']) ? trim((string)$_POST['website_hp']) : '';
if ($honeypot !== '') {
    millan_send_json(array(
        'success' => true,
        'title'   => '¡Mensaje recibido!',
        'message' => 'Gracias por contactar con Millán Chiclana.',
    ), 200);
}

/**
 * 4. RECOGIDA Y SANEAMIENTO DE CAMPOS DEL FORMULARIO
 */
$rawNombre        = isset($_POST['nombre']) ? (string)$_POST['nombre'] : '';
$rawEmail         = isset($_POST['email']) ? (string)$_POST['email'] : '';
$rawTelefono      = isset($_POST['telefono']) ? (string)$_POST['telefono'] : '';
$rawAsunto        = isset($_POST['asunto']) ? (string)$_POST['asunto'] : '';
$rawMarca         = isset($_POST['marca_presupuesto']) ? (string)$_POST['marca_presupuesto'] : '';
$rawSede          = isset($_POST['sede_interes']) ? (string)$_POST['sede_interes'] : '';
$rawMensaje       = isset($_POST['mensaje']) ? (string)$_POST['mensaje'] : '';
$rawPrivacidad    = isset($_POST['privacidad']) ? (string)$_POST['privacidad'] : '';
$formToken        = isset($_POST['form_token']) ? trim((string)$_POST['form_token']) : '';
$idempotencyKey   = isset($_POST['idempotency_key']) ? trim((string)$_POST['idempotency_key']) : '';

$nombre           = millan_clean_single_line(trim(strip_tags($rawNombre)));
$email            = millan_clean_single_line(filter_var(trim($rawEmail), FILTER_SANITIZE_EMAIL));
$telefono         = millan_clean_single_line(trim(strip_tags($rawTelefono)));
$asunto           = millan_clean_single_line(trim(strip_tags($rawAsunto)));
$marcaPresupuesto = millan_clean_single_line(trim(strip_tags($rawMarca)));
$sedeDefault      = ($marcaPresupuesto !== '') ? $marcaPresupuesto : 'Consulta General';
$sedeInteres      = millan_clean_single_line(trim(strip_tags($rawSede !== '' ? $rawSede : $sedeDefault)));
$mensaje          = trim(strip_tags($rawMensaje));
$privacidad       = ($rawPrivacidad === '1' || $rawPrivacidad === 'on' || $rawPrivacidad === 'true');

/**
 * 5. VALIDACIÓN DE CAMPOS OBLIGATORIOS
 */
if (millan_strlen($nombre) < 2) {
    millan_send_json(array(
        'success' => false,
        'message' => 'Por favor, introduce tu nombre completo.',
    ), 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    millan_send_json(array(
        'success' => false,
        'message' => 'Por favor, introduce una dirección de correo electrónico válida.',
    ), 422);
}

if (!preg_match('/^[0-9+\s().-]{9,20}$/', $telefono)) {
    millan_send_json(array(
        'success' => false,
        'message' => 'Por favor, indica un número de teléfono válido (mínimo 9 dígitos).',
    ), 422);
}

if ($asunto === '') {
    millan_send_json(array(
        'success' => false,
        'message' => 'Por favor, selecciona o escribe el asunto de tu consulta.',
    ), 422);
}

if (millan_strlen($mensaje) < 2) {
    millan_send_json(array(
        'success' => false,
        'message' => 'Por favor, escribe el mensaje de tu consulta.',
    ), 422);
}

if (!$privacidad) {
    millan_send_json(array(
        'success' => false,
        'message' => 'Debes aceptar la Política de Privacidad para poder enviar tu consulta.',
    ), 422);
}

/**
 * 6. CONTROL DE IDEMPOTENCIA Y ANTI-DUPLICADOS (CONEXIONES MÓVILES LENTAS)
 */
$now = time();
$clientIp = isset($_SERVER['REMOTE_ADDR']) ? (string)$_SERVER['REMOTE_ADDR'] : '0.0.0.0';
$ipHash = hash('sha256', 'millan_ip_salt_' . $clientIp);
$payloadHash = hash(
    'sha256',
    millan_strtolower($email . '|' . $telefono . '|' . $asunto . '|' . $marcaPresupuesto . '|' . $mensaje)
);
$currentNextToken = !empty($_SESSION['form_token']) ? $_SESSION['form_token'] : millan_generate_token();

// 6.1. ¿Se ha procesado ya exactamente este mismo mensaje o clave de idempotencia en la sesión?
if (
    ($idempotencyKey !== '' && in_array($idempotencyKey, $_SESSION['processed_keys'], true)) ||
    in_array($payloadHash, $_SESSION['processed_hashes'], true)
) {
    millan_send_json(array(
        'success'             => true,
        'duplicate_prevented' => true,
        'title'               => '¡Tu consulta ya ha sido enviada!',
        'message'             => 'Hemos recibido tu mensaje correctamente. Nuestro equipo te responderá muy pronto.',
        'next_token'          => $currentNextToken,
    ), 200);
}

// 6.2. Control de ventana de 60 segundos en la misma sesión PHP
$lastSessionSubmit = isset($_SESSION['last_submit_time']) ? (int)$_SESSION['last_submit_time'] : 0;
if (($now - $lastSessionSubmit) < COOLDOWN_SECONDS) {
    millan_send_json(array(
        'success'             => true,
        'duplicate_prevented' => true,
        'title'               => 'Mensaje enviado correctamente',
        'message'             => 'Tu solicitud ya ha sido recibida por nuestro equipo. Te responderemos lo antes posible.',
        'next_token'          => $currentNextToken,
    ), 200);
}

// 6.3. Comprobación en archivo global de deduplicación
$tempDir = @sys_get_temp_dir();
$globalDedupFile = ($tempDir ? rtrim($tempDir, '/\\') : '/tmp') . DIRECTORY_SEPARATOR . 'millan_global_dedup.lock';
$gfp = @fopen($globalDedupFile, 'c+');
if ($gfp !== false) {
    if (@flock($gfp, LOCK_EX)) {
        $rawGlobal = @stream_get_contents($gfp);
        $globalRecords = $rawGlobal ? @json_decode($rawGlobal, true) : array();
        if (!is_array($globalRecords)) {
            $globalRecords = array();
        }
        foreach ($globalRecords as $k => $ts) {
            if (($now - (int)$ts) > DEDUP_TTL_SECONDS) {
                unset($globalRecords[$k]);
            }
        }
        $keyFingerprints = array('hash_' . $payloadHash);
        if ($idempotencyKey !== '') {
            $keyFingerprints[] = 'idem_' . hash('sha256', $idempotencyKey);
        }
        foreach ($keyFingerprints as $fpKey) {
            if (isset($globalRecords[$fpKey])) {
                @flock($gfp, LOCK_UN);
                @fclose($gfp);
                millan_send_json(array(
                    'success'             => true,
                    'duplicate_prevented' => true,
                    'title'               => '¡Tu consulta ya ha sido enviada!',
                    'message'             => 'Hemos recibido tu mensaje correctamente en el primer envío. Nuestro equipo te responderá muy pronto.',
                    'next_token'          => $currentNextToken,
                ), 200);
            }
        }
        @flock($gfp, LOCK_UN);
    }
    @fclose($gfp);
}

/**
 * 7. CONSTRUCCIÓN Y ENVÍO DEL CORREO ELECTRÓNICO A millan@millanchiclana.com
 */
$subjectPrefix = ($marcaPresupuesto !== '') ? "[Presupuesto $marcaPresupuesto]" : "[Web Millán Chiclana]";
$emailSubject  = '=?UTF-8?B?' . base64_encode($subjectPrefix . ' ' . $asunto . ' - ' . $nombre) . '?=';
$fechaHora     = date('d/m/Y H:i:s');

$marcaRowHtml = '';
if ($marcaPresupuesto !== '') {
    $marcaRowHtml = '
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;">Marca y Destino:</td>
            <td><strong style="color:#111111;background:#EDEDEF;padding:4px 8px;border-radius:6px;display:inline-block;">' . htmlspecialchars($marcaPresupuesto, ENT_QUOTES, 'UTF-8') . '</strong></td>
          </tr>';
}

$htmlBody = '<!DOCTYPE html>
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
          </tr>' . $marcaRowHtml . '
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
        Enviado el ' . $fechaHora . ' · ID: ' . htmlspecialchars(substr($payloadHash, 0, 10), ENT_QUOTES, 'UTF-8') . ' · RGPD Aceptado
      </td>
    </tr>
  </table>
</body>
</html>';

// Configurar sendmail_from con el buzón corporativo real del dominio
@ini_set('sendmail_from', SENDER_WEB_EMAIL);

$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Millan Chiclana Web <' . SENDER_WEB_EMAIL . '>',
    'Reply-To: ' . $email,
    'Return-Path: ' . SENDER_WEB_EMAIL,
    'X-Mailer: PHP/' . phpversion(),
);

$mailSent = false;

if (function_exists('mail')) {
    // Intento 1: con parámetro -f para forzar Return-Path (requerido por muchos servidores Hostalia/Apache)
    $mailSent = @mail(RECIPIENT_EMAIL, $emailSubject, $htmlBody, implode("\r\n", $headers), '-f' . SENDER_WEB_EMAIL);

    // Intento 2: sin quinto parámetro (por si safe_mode o restricciones de hosting rechazan -f)
    if (!$mailSent) {
        $mailSent = @mail(RECIPIENT_EMAIL, $emailSubject, $htmlBody, implode("\r\n", $headers));
    }

    // Intento 3: con saltos de línea LF (\n) para agentes MTA Linux (Postfix/Sendmail antiguos)
    if (!$mailSent) {
        $simpleHeaders = "MIME-Version: 1.0\n"
            . "Content-Type: text/html; charset=UTF-8\n"
            . "From: " . SENDER_WEB_EMAIL . "\n"
            . "Reply-To: " . $email;
        $mailSent = @mail(RECIPIENT_EMAIL, $emailSubject, $htmlBody, $simpleHeaders);
    }
}

// Intento 4: SMTP local directo (127.0.0.1:25) si mail() está desactivado o devolvió false
if (!$mailSent) {
    $mailSent = millan_send_smtp_socket('127.0.0.1', 25, RECIPIENT_EMAIL, SENDER_WEB_EMAIL, $email, $emailSubject, $htmlBody);
}

// Intento 5: Servidor MX directo del dominio (mx.serviciodecorreo.es:25 - Hostalia autoriza la IP del hosting por SPF)
if (!$mailSent) {
    $mailSent = millan_send_smtp_socket('mx.serviciodecorreo.es', 25, RECIPIENT_EMAIL, SENDER_WEB_EMAIL, $email, $emailSubject, $htmlBody);
}

if (!$mailSent) {
    millan_send_json(array(
        'success'   => false,
        'mail_sent' => false,
        'message'   => 'El servidor de correo no pudo procesar el envío en este momento.',
    ), 500);
}

// Registrar en bloqueo global y sesión SOLO tras envío exitoso
$gfpWrite = @fopen($globalDedupFile, 'c+');
if ($gfpWrite !== false) {
    if (@flock($gfpWrite, LOCK_EX)) {
        $rawGlobal = @stream_get_contents($gfpWrite);
        $globalRecords = $rawGlobal ? @json_decode($rawGlobal, true) : array();
        if (!is_array($globalRecords)) {
            $globalRecords = array();
        }
        $globalRecords['hash_' . $payloadHash] = $now;
        if ($idempotencyKey !== '') {
            $globalRecords['idem_' . hash('sha256', $idempotencyKey)] = $now;
        }
        @ftruncate($gfpWrite, 0);
        @rewind($gfpWrite);
        @fwrite($gfpWrite, json_encode($globalRecords));
        @fflush($gfpWrite);
        @flock($gfpWrite, LOCK_UN);
    }
    @fclose($gfpWrite);
}

$_SESSION['last_submit_time'] = $now;
$_SESSION['form_token'] = millan_generate_token();
if ($idempotencyKey !== '') {
    $_SESSION['processed_keys'][] = $idempotencyKey;
}
$_SESSION['processed_hashes'][] = $payloadHash;

millan_send_json(array(
    'success'    => true,
    'mail_sent'  => true,
    'title'      => '¡Consulta enviada correctamente!',
    'message'    => 'Gracias por contactar con Millán Chiclana. Hemos registrado tu mensaje y nuestro equipo de ' . $sedeInteres . ' te responderá lo antes posible.',
    'next_token' => $_SESSION['form_token'],
), 200);
