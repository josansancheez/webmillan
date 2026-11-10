<?php
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

@date_default_timezone_set('Europe/Madrid');

$nombre   = isset($_POST['nombre']) ? trim(strip_tags((string)$_POST['nombre'])) : '';
$email    = isset($_POST['email']) ? trim(strip_tags((string)$_POST['email'])) : '';
$telefono = isset($_POST['telefono']) ? trim(strip_tags((string)$_POST['telefono'])) : '';
$asunto   = isset($_POST['asunto']) ? trim(strip_tags((string)$_POST['asunto'])) : 'Consulta Web';
$sede     = isset($_POST['sede_interes']) ? trim(strip_tags((string)$_POST['sede_interes'])) : 'Sede Exposición';
$mensaje  = isset($_POST['mensaje']) ? trim(strip_tags((string)$_POST['mensaje'])) : '';

$isPost = (isset($_SERVER['REQUEST_METHOD']) && strtoupper((string)$_SERVER['REQUEST_METHOD']) === 'POST');

$mailSent = false;
if ($isPost && $nombre !== '' && $email !== '') {
    $to = 'millan@millanchiclana.com';
    $from = 'millan@millanchiclana.com';
    $subjectEncoded = '=?UTF-8?B?' . base64_encode("[Web Millán Chiclana] $asunto - $nombre") . '?=';
    
    $cuerpo = "Has recibido una nueva consulta desde el formulario web de Millán Chiclana:\n\n"
            . "Nombre Completo: " . $nombre . "\n"
            . "Teléfono: " . $telefono . "\n"
            . "Correo Electrónico: " . $email . "\n"
            . "Sede de Interés: " . $sede . "\n"
            . "Asunto: " . $asunto . "\n\n"
            . "Mensaje:\n" . $mensaje . "\n\n"
            . "--\nEnviado desde https://millanchiclana.com el " . date('d/m/Y H:i:s');

    $headers  = "From: " . $from . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @ini_set('sendmail_from', $from);
    $mailSent = @mail($to, $subjectEncoded, $cuerpo, $headers, '-f' . $from);
    if (!$mailSent) {
        $mailSent = @mail($to, $subjectEncoded, $cuerpo, $headers);
    }
}

echo json_encode(array(
    'success'    => true,
    'mail_sent'  => $mailSent,
    'title'      => '¡Consulta enviada correctamente!',
    'message'    => 'Gracias por contactar con Millán Chiclana. Hemos recibido tu mensaje y nuestro equipo te responderá a la mayor brevedad.',
    'form_token' => md5(uniqid((string)mt_rand(), true))
));
exit;
