<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios Montajes e Interiorismos S.L.
 * Backend de Formulario de Contacto Corporativo - Compatible PHP 7.4 a 8.4 (Arsys)
 * ============================================================================
 */

// Silenciar warnings en salida directa para garantizar formato JSON limpio
@error_reporting(0);
@ini_set('display_errors', '0');

@date_default_timezone_set('Europe/Madrid');

// Cabeceras HTTP estándar JSON
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';

// 1. Endpoint GET: responde siempre con token y estado 200 para verificación
if ($method === 'GET') {
    $token = function_exists('random_bytes') ? bin2hex(random_bytes(16)) : md5(uniqid((string)mt_rand(), true));
    echo json_encode(array(
        'success'    => true,
        'status'     => 'ready',
        'form_token' => $token
    ));
    exit;
}

// 2. Solo procesar método POST
if ($method !== 'POST') {
    echo json_encode(array(
        'success' => false,
        'message' => 'Método no permitido. Utiliza el formulario oficial de la web.'
    ));
    exit;
}

// 3. Filtro Anti-Spam Honeypot (campo oculto invisible a usuarios)
$honeypot = isset($_POST['website_hp']) ? trim((string)$_POST['website_hp']) : '';
if ($honeypot !== '') {
    echo json_encode(array(
        'success' => true,
        'title'   => '¡Consulta enviada!',
        'message' => 'Gracias por contactar con Millán Chiclana.'
    ));
    exit;
}

// 4. Limpieza y validación de campos recibidos
$cleanHeader = function ($val) {
    return str_replace(array("\r", "\n", "%0a", "%0d", "%0A", "%0D", "Content-Type:", "bcc:", "cc:", "to:"), '', trim(strip_tags((string)$val)));
};

$nombre   = $cleanHeader(isset($_POST['nombre']) ? $_POST['nombre'] : '');
$email    = $cleanHeader(isset($_POST['email']) ? $_POST['email'] : '');
$telefono = $cleanHeader(isset($_POST['telefono']) ? $_POST['telefono'] : '');
$asunto   = $cleanHeader(isset($_POST['asunto']) ? $_POST['asunto'] : 'Consulta Web');
$sede     = $cleanHeader(isset($_POST['sede_interes']) ? $_POST['sede_interes'] : 'Sede Exposición');
$mensaje  = trim(strip_tags(isset($_POST['mensaje']) ? (string)$_POST['mensaje'] : ''));

if ($nombre === '' || strlen($nombre) < 2) {
    echo json_encode(array('success' => false, 'message' => 'Por favor, introduce tu nombre completo.'));
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('success' => false, 'message' => 'Por favor, introduce un correo electrónico válido.'));
    exit;
}

$telDigits = preg_replace('/\D/', '', $telefono);
if (strlen($telDigits) < 9 || strlen($telDigits) > 16) {
    echo json_encode(array('success' => false, 'message' => 'Por favor, introduce un número de teléfono válido con al menos 9 dígitos (solo números).'));
    exit;
}

if ($mensaje === '' || strlen($mensaje) < 2) {
    echo json_encode(array('success' => false, 'message' => 'Por favor, escribe el contenido de tu consulta.'));
    exit;
}

// 5. Envío mediante función nativa de correo con identidad corporativa
$to = 'millan@millanchiclana.com';
$fromEmail = 'millan@millanchiclana.com';
$fromName  = 'Web Millan Chiclana';

$subjectText = "[Web Millán Chiclana] $asunto - $nombre";
$subjectEncoded = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$cuerpo = "Has recibido una nueva consulta desde el formulario web de Millán Chiclana:\n\n"
        . "==================================================\n"
        . "Nombre Completo:      " . $nombre . "\n"
        . "Teléfono de Contacto: " . $telefono . "\n"
        . "Correo Electrónico:   " . $email . "\n"
        . "Sede / Departamento:  " . $sede . "\n"
        . "Asunto de Consulta:   " . $asunto . "\n"
        . "==================================================\n\n"
        . "Mensaje del cliente:\n"
        . $mensaje . "\n\n"
        . "==================================================\n"
        . "Enviado desde https://millanchiclana.com el " . date('d/m/Y H:i:s') . "\n";

$headers  = "From: " . $fromName . " <" . $fromEmail . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@ini_set('sendmail_from', $fromEmail);
$mailSent = @mail($to, $subjectEncoded, $cuerpo, $headers, '-f' . $fromEmail);
if (!$mailSent) {
    $mailSent = @mail($to, $subjectEncoded, $cuerpo, $headers);
}

// 6. Registro de seguridad local de la consulta (backup en servidor)
$logEntry = date('Y-m-d H:i:s') . " | " . $nombre . " | " . $telefono . " | " . $email . " | " . $asunto . " | " . ($mailSent ? "ENVIADO" : "MAIL_FALLO") . "\n";
@file_put_contents(dirname(__FILE__) . '/consultas_recientes.log', $logEntry, FILE_APPEND | LOCK_EX);

echo json_encode(array(
    'success'    => true,
    'mail_sent'  => $mailSent,
    'title'      => '¡Consulta enviada correctamente!',
    'message'    => 'Gracias por contactar con Millán Chiclana. Hemos recibido tu consulta y nuestro equipo te responderá a la mayor brevedad.'
));
exit;
