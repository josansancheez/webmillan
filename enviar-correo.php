<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios Montajes e Interiorismos S.L.
 * Backend de Formulario de Contacto - Compatible PHP 5.4 - 8.4 (Arsys)
 * Archivo: enviar-correo.php
 * ============================================================================
 */

@ini_set('display_errors', '1');
@ini_set('display_startup_errors', '1');
@error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

define('DESTINATARIO_EMAIL', 'millan@millanchiclana.com');
define('REMITENTE_WEB',      'millan@millanchiclana.com');
define('NOMBRE_EMPRESA',     'Millán Chiclana');
define('RAZON_SOCIAL',       'Millán Servicios Montajes e Interiorismos S.L.');

@date_default_timezone_set('Europe/Madrid');

function millan_generar_token() {
    return md5(uniqid((string)mt_rand(), true) . microtime(true));
}

function millan_enviar_smtp_local($to, $from, $replyTo, $subject, $htmlBody) {
    $fp = @fsockopen('127.0.0.1', 25, $errno, $errstr, 2);
    if (!$fp) {
        return false;
    }
    @stream_set_timeout($fp, 3);
    $banner = @fgets($fp, 512);
    if (!is_string($banner) || substr($banner, 0, 3) !== '220') {
        @fclose($fp);
        return false;
    }
    @fwrite($fp, "HELO millanchiclana.com\r\n");
    @fgets($fp, 512);
    @fwrite($fp, "MAIL FROM:<" . $from . ">\r\n");
    @fgets($fp, 512);
    @fwrite($fp, "RCPT TO:<" . $to . ">\r\n");
    $rcpt = @fgets($fp, 512);
    if (!is_string($rcpt) || substr($rcpt, 0, 3) !== '250') {
        @fclose($fp);
        return false;
    }
    @fwrite($fp, "DATA\r\n");
    $dataResp = @fgets($fp, 512);
    if (!is_string($dataResp) || substr($dataResp, 0, 3) !== '354') {
        @fclose($fp);
        return false;
    }
    $headers  = "Date: " . date('r') . "\r\n";
    $headers .= "From: Web Millan Chiclana <" . $from . ">\r\n";
    $headers .= "Reply-To: <" . $replyTo . ">\r\n";
    $headers .= "To: <" . $to . ">\r\n";
    $headers .= "Subject: " . $subject . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    @fwrite($fp, $headers . $htmlBody . "\r\n.\r\n");
    $sendResp = @fgets($fp, 512);
    @fwrite($fp, "QUIT\r\n");
    @fclose($fp);
    return (is_string($sendResp) && substr($sendResp, 0, 3) === '250');
}

try {
    $requestMethod = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';

    // 1. Endpoint GET: responde siempre con token y estado 200
    if ($requestMethod === 'GET') {
        echo json_encode(array(
            'success'    => true,
            'form_token' => millan_generar_token(),
            'php_version'=> phpversion()
        ));
        exit;
    }

    // 2. Comprobar método POST
    if ($requestMethod !== 'POST') {
        echo json_encode(array(
            'success' => false,
            'message' => 'Método no permitido. Utiliza el formulario oficial.',
        ));
        exit;
    }

    // 3. Filtro Anti-Spam Honeypot silencioso
    $honeypot = isset($_POST['website_hp']) ? trim((string)$_POST['website_hp']) : '';
    if ($honeypot !== '') {
        echo json_encode(array(
            'success' => true,
            'title'   => '¡Mensaje recibido!',
            'message' => 'Gracias por contactar con Millán Chiclana.',
        ));
        exit;
    }

    // 4. Limpieza y validación de campos obligatorios
    $cleanSingle = function ($val) {
        return str_replace(array("\r", "\n", "%0a", "%0d", "%0A", "%0D", "Content-Type:", "bcc:", "cc:", "to:"), '', (string)$val);
    };

    $nombre           = $cleanSingle(trim(strip_tags(isset($_POST['nombre']) ? (string)$_POST['nombre'] : '')));
    $email            = $cleanSingle(trim(strip_tags(isset($_POST['email']) ? (string)$_POST['email'] : '')));
    $telefono         = $cleanSingle(trim(strip_tags(isset($_POST['telefono']) ? (string)$_POST['telefono'] : '')));
    $asunto           = $cleanSingle(trim(strip_tags(isset($_POST['asunto']) ? (string)$_POST['asunto'] : '')));
    $marcaPresupuesto = $cleanSingle(trim(strip_tags(isset($_POST['marca_presupuesto']) ? (string)$_POST['marca_presupuesto'] : '')));
    $sedeInteres      = $cleanSingle(trim(strip_tags(isset($_POST['sede_interes']) ? (string)$_POST['sede_interes'] : ($marcaPresupuesto !== '' ? $marcaPresupuesto : 'Consulta General'))));
    $mensaje          = trim(strip_tags(isset($_POST['mensaje']) ? (string)$_POST['mensaje'] : ''));
    $privacidad       = isset($_POST['privacidad']) && in_array((string)$_POST['privacidad'], array('1', 'on', 'true'), true);

    if (strlen($nombre) < 2) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, introduce tu nombre completo.'));
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, introduce un correo electrónico válido.'));
        exit;
    }

    // Validación estricta de teléfono: solo números, mínimo 9 dígitos, opcional prefijo + o paréntesis. No permite letras.
    $phoneDigits = preg_replace('/\D/', '', $telefono);
    if (preg_match('/[a-zA-Z]/', $telefono) || strlen($phoneDigits) < 9 || strlen($phoneDigits) > 16) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Por favor, introduce un número de teléfono válido (solo números, mínimo 9 dígitos, opcional prefijo + o paréntesis). No se permiten letras.'
        ));
        exit;
    }

    if ($asunto === '') {
        echo json_encode(array('success' => false, 'message' => 'Por favor, introduce el asunto de la consulta.'));
        exit;
    }

    if (strlen($mensaje) < 2) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, escribe el mensaje de tu consulta.'));
        exit;
    }

    if (!$privacidad) {
        echo json_encode(array('success' => false, 'message' => 'Debes aceptar la Política de Privacidad para continuar.'));
        exit;
    }

    // 5. Construcción del correo electrónico en formato HTML
    $asuntoPrefix = $marcaPresupuesto !== '' ? "[Presupuesto $marcaPresupuesto]" : "[Web Millán Chiclana]";
    $asuntoCompleto = "$asuntoPrefix $asunto - $nombre";
    $subjectEncoded = '=?UTF-8?B?' . base64_encode($asuntoCompleto) . '?=';
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

    // 6. Cabeceras preparadas estrictamente para el MTA de Arsys (PHP 8.4)
    $headers  = "From: " . REMITENTE_WEB . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    @ini_set('sendmail_from', REMITENTE_WEB);

    $enviado = false;

    // Intento A: mail() nativo con parámetro envelope -f requerido por Arsys
    if (function_exists('mail')) {
        $enviado = @mail(DESTINATARIO_EMAIL, $subjectEncoded, $cuerpoHtml, $headers, '-f' . REMITENTE_WEB);
        // Intento B: mail() sin parámetro extra si suPHP/Arsys tiene restringido el quinto parámetro
        if (!$enviado) {
            $enviado = @mail(DESTINATARIO_EMAIL, $subjectEncoded, $cuerpoHtml, $headers);
        }
    }

    // Intento C: SMTP directo al Postfix/Sendmail local de Arsys (127.0.0.1:25)
    if (!$enviado) {
        $enviado = millan_enviar_smtp_local(DESTINATARIO_EMAIL, REMITENTE_WEB, $email, $subjectEncoded, $cuerpoHtml);
    }

    // Guardar copia local de respaldo de la consulta para garantizar que ningún lead se pierda jamás
    $leadBackup = array(
        'fecha'     => $fechaEnvio,
        'nombre'    => $nombre,
        'email'     => $email,
        'telefono'  => $telefono,
        'asunto'    => $asunto,
        'sede'      => $sedeInteres,
        'mensaje'   => $mensaje,
        'mail_sent' => $enviado
    );
    @file_put_contents(dirname(__FILE__) . '/consultas_recientes.log', json_encode($leadBackup) . "\n", FILE_APPEND | LOCK_EX);

    // RESPUESTA SIEMPRE HTTP 200 EN JSON: Garantiza que el cliente reciba el mensaje
    echo json_encode(array(
        'success'    => true,
        'mail_sent'  => $enviado,
        'title'      => '¡Consulta enviada correctamente!',
        'message'    => 'Gracias por contactar con Millán Chiclana. Hemos recibido tu mensaje y nuestro equipo de ' . $sedeInteres . ' te responderá lo antes posible.',
        'next_token' => millan_generar_token(),
    ));

} catch (Exception $e) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ));
}
exit;
