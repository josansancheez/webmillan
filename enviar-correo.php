<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios Montajes e Interiorismos S.L.
 * Backend de Formulario de Contacto - Optimizado para Arsys (PHP 8.4)
 * Archivo: enviar-correo.php
 * ============================================================================
 */

// Evitar que errores o notices rompan la respuesta JSON
@error_reporting(0);
@ini_set('display_errors', '0');

// Cabeceras HTTP limpias
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Configuración de correo para Arsys
// En Arsys, tanto From como el parámetro -f DEBEN ser una cuenta real del dominio
define('DESTINATARIO_EMAIL', 'millan@millanchiclana.com');
define('REMITENTE_WEB',      'millan@millanchiclana.com');
define('NOMBRE_EMPRESA',     'Millán Chiclana');
define('RAZON_SOCIAL',       'Millán Servicios Montajes e Interiorismos S.L.');

@date_default_timezone_set('Europe/Madrid');

// 1. Endpoint GET para generación de token (?action=token)
$requestMethod = isset($_SERVER['REQUEST_METHOD']) ? strtoupper($_SERVER['REQUEST_METHOD']) : 'GET';
if ($requestMethod === 'GET' && isset($_GET['action']) && $_GET['action'] === 'token') {
    $token = bin2hex(random_bytes(16));
    echo json_encode([
        'success'    => true,
        'form_token' => $token,
    ]);
    exit;
}

// 2. Solo permitir peticiones POST
if ($requestMethod !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Utiliza el formulario oficial.',
    ]);
    exit;
}

// 3. Filtro Anti-Spam Honeypot
$honeypot = trim((string)($_POST['website_hp'] ?? ''));
if ($honeypot !== '') {
    // Respuesta silenciosa para bots
    echo json_encode([
        'success' => true,
        'title'   => '¡Mensaje recibido!',
        'message' => 'Gracias por contactar con Millán Chiclana.',
    ]);
    exit;
}

// 4. Recogida y saneamiento de campos
$nombre           = trim(strip_tags((string)($_POST['nombre'] ?? '')));
$email            = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_SANITIZE_EMAIL);
$telefono         = trim(strip_tags((string)($_POST['telefono'] ?? '')));
$asunto           = trim(strip_tags((string)($_POST['asunto'] ?? '')));
$marcaPresupuesto = trim(strip_tags((string)($_POST['marca_presupuesto'] ?? '')));
$sedeInteres      = trim(strip_tags((string)($_POST['sede_interes'] ?? ($marcaPresupuesto !== '' ? $marcaPresupuesto : 'Consulta General'))));
$mensaje          = trim(strip_tags((string)($_POST['mensaje'] ?? '')));
$privacidad       = isset($_POST['privacidad']) && in_array((string)$_POST['privacidad'], ['1', 'on', 'true'], true);

// Limpiar inyección de cabeceras en campos de una sola línea
$cleanSingle = static function (string $val): string {
    return str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D", "Content-Type:", "bcc:", "cc:", "to:"], '', $val);
};

$nombre           = $cleanSingle($nombre);
$email            = $cleanSingle($email);
$telefono         = $cleanSingle($telefono);
$asunto           = $cleanSingle($asunto);
$marcaPresupuesto = $cleanSingle($marcaPresupuesto);
$sedeInteres      = $cleanSingle($sedeInteres);

// 5. Validación de campos obligatorios
if (mb_strlen($nombre) < 2) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, introduce tu nombre completo.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, introduce un correo electrónico válido.']);
    exit;
}

if (!preg_match('/^[0-9+\s().-]{9,20}$/', $telefono)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, introduce un teléfono válido (mínimo 9 dígitos).']);
    exit;
}

if ($asunto === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, introduce el asunto de la consulta.']);
    exit;
}

if (mb_strlen($mensaje) < 2) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, escribe el mensaje de tu consulta.']);
    exit;
}

if (!$privacidad) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Debes aceptar la Política de Privacidad para continuar.']);
    exit;
}

// 6. Construcción del correo electrónico en formato HTML y Texto
$asuntoPrefix = $marcaPresupuesto !== '' ? "[Presupuesto $marcaPresupuesto]" : "[Web Millán Chiclana]";
$subjectEncoded = '=?UTF-8?B?' . base64_encode("$asuntoPrefix $asunto - $nombre") . '?=';
$fechaEnvio = date('d/m/Y H:i:s');

$marcaFilaHtml = '';
if ($marcaPresupuesto !== '') {
    $marcaFilaHtml = '
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Marca / Producto:</td>
            <td style="padding:10px 8px;"><strong style="color:#111111;background:#EDEDEF;padding:4px 8px;border-radius:6px;display:inline-block;">' . htmlspecialchars($marcaPresupuesto, ENT_QUOTES, 'UTF-8') . '</strong></td>
          </tr>';
}

$cuerpoHtml = '<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva consulta web - Millán Chiclana</title>
</head>
<body style="margin:0;padding:24px;background-color:#F9FAFB;font-family:Arial,sans-serif;color:#18181B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="background-color:#111111;padding:20px 24px;color:#FFFFFF;">
        <h2 style="margin:0;font-size:20px;font-weight:bold;">' . htmlspecialchars(NOMBRE_EMPRESA, ENT_QUOTES, 'UTF-8') . ' · Nueva Consulta Web</h2>
        <p style="margin:4px 0 0;font-size:13px;color:#D4D4D8;">' . htmlspecialchars(RAZON_SOCIAL, ENT_QUOTES, 'UTF-8') . ' | Pol. Ind. Pelagatos, Chiclana</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td width="35%" style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Nombre Completo:</td>
            <td style="padding:10px 8px;">' . htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') . '</td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Teléfono:</td>
            <td style="padding:10px 8px;"><a href="tel:' . htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') . '" style="color:#111111;font-weight:bold;text-decoration:none;">' . htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8') . '</a></td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Correo Electrónico:</td>
            <td style="padding:10px 8px;"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" style="color:#111111;text-decoration:underline;">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></td>
          </tr>
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Asunto:</td>
            <td style="padding:10px 8px;"><strong>' . htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8') . '</strong></td>
          </tr>' . $marcaFilaHtml . '
          <tr style="border-bottom:1px solid #F3F4F6;">
            <td style="font-weight:bold;color:#3F3F46;padding:10px 8px;">Sede / Departamento:</td>
            <td style="padding:10px 8px;">' . htmlspecialchars($sedeInteres, ENT_QUOTES, 'UTF-8') . '</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:16px;">
              <div style="font-weight:bold;color:#111111;margin-bottom:8px;">Mensaje del cliente:</div>
              <div style="background:#F9FAFB;padding:16px;border-radius:8px;border:1px solid #E5E7EB;white-space:pre-line;line-height:1.6;font-size:14px;color:#18181B;">' . nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8')) . '</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#F3F4F6;padding:14px 24px;font-size:12px;color:#71717A;">
        Enviado el ' . $fechaEnvio . ' desde el formulario web · RGPD Aceptado · Para responder pulsa directamente en "Responder" (Reply-To).
      </td>
    </tr>
  </table>
</body>
</html>';

// 7. Cabeceras preparadas para servidor Apache/Linux en Arsys
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Web Millan Chiclana <" . REMITENTE_WEB . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 8. Envío a través de mail() con parámetro de envelope (-f) requerido por Arsys
@ini_set('sendmail_from', REMITENTE_WEB);

$enviado = @mail(DESTINATARIO_EMAIL, $subjectEncoded, $cuerpoHtml, $headers, '-f' . REMITENTE_WEB);

// Fallback sin -f si el entorno no permite parámetros extra
if (!$enviado) {
    $enviado = @mail(DESTINATARIO_EMAIL, $subjectEncoded, $cuerpoHtml, $headers);
}

if ($enviado) {
    echo json_encode([
        'success'    => true,
        'mail_sent'  => true,
        'title'      => '¡Consulta enviada correctamente!',
        'message'    => 'Gracias por contactar con Millán Chiclana. Hemos recibido tu mensaje y nuestro equipo de ' . $sedeInteres . ' te responderá lo antes posible.',
        'next_token' => bin2hex(random_bytes(16)),
    ]);
} else {
    // Si mail() falla en el servidor, devolvemos error controlado para que JavaScript active el fallback
    http_response_code(500);
    echo json_encode([
        'success'   => false,
        'mail_sent' => false,
        'message'   => 'El servidor de correo no pudo procesar el envío automáticamente.',
    ]);
}
exit;
