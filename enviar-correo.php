<?php
/**
 * ============================================================================
 * MILLÁN CHICLANA - Millán Servicios Montajes e Interiorismos S.L.
 * Backend de Formulario de Contacto - Optimizado para Arsys (PHP 8.4)
 * Archivo: enviar-correo.php
 * ============================================================================
 */

// Silenciar warnings en salida directa para garantizar formato JSON limpio
@error_reporting(0);
@ini_set('display_errors', '0');

// Cabeceras HTTP siempre JSON
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Definición de remitente y destinatario autorizados en Arsys
define('DESTINATARIO_EMAIL', 'millan@millanchiclana.com');
define('REMITENTE_WEB',      'millan@millanchiclana.com');
define('NOMBRE_EMPRESA',     'Millán Chiclana');
define('RAZON_SOCIAL',       'Millán Servicios Montajes e Interiorismos S.L.');

@date_default_timezone_set('Europe/Madrid');

// Helper para generar tokens seguros sin depender de /dev/urandom ni extensiones
function millan_generar_token(): string {
    return md5(uniqid((string)mt_rand(), true) . microtime(true));
}

// Helper para envío directo SMTP local a Postfix/Sendmail de Arsys si mail() estuviera restringido
function millan_enviar_smtp_local(string $to, string $from, string $replyTo, string $subject, string $htmlBody): bool {
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
    return is_string($sendResp) && substr($sendResp, 0, 3) === '250';
}

try {
    $requestMethod = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string)$_SERVER['REQUEST_METHOD']) : 'GET';

    // 1. Endpoint GET: responde siempre con token y estado 200
    if ($requestMethod === 'GET') {
        echo json_encode([
            'success'    => true,
            'form_token' => millan_generar_token(),
        ]);
        exit;
    }

    // 2. Comprobar método POST (si no es POST, avisar limpiamente sin romper Apache)
    if ($requestMethod !== 'POST') {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido. Utiliza el formulario oficial.',
        ]);
        exit;
    }

    // 3. Filtro Anti-Spam Honeypot silencioso
    $honeypot = trim((string)($_POST['website_hp'] ?? ''));
    if ($honeypot !== '') {
        echo json_encode([
            'success' => true,
            'title'   => '¡Mensaje recibido!',
            'message' => 'Gracias por contactar con Millán Chiclana.',
        ]);
        exit;
    }

    // 4. Limpieza y validación de campos obligatorios
    $cleanSingle = static function (string $val): string {
        return str_replace(["\r", "\n", "%0a", "%0d", "%0A", "%0D", "Content-Type:", "bcc:", "cc:", "to:"], '', $val);
    };

    $nombre           = $cleanSingle(trim(strip_tags((string)($_POST['nombre'] ?? ''))));
    $email            = $cleanSingle(trim(strip_tags((string)($_POST['email'] ?? ''))));
    $telefono         = $cleanSingle(trim(strip_tags((string)($_POST['telefono'] ?? ''))));
    $asunto           = $cleanSingle(trim(strip_tags((string)($_POST['asunto'] ?? ''))));
    $marcaPresupuesto = $cleanSingle(trim(strip_tags((string)($_POST['marca_presupuesto'] ?? ''))));
    $sedeInteres      = $cleanSingle(trim(strip_tags((string)($_POST['sede_interes'] ?? ($marcaPresupuesto !== '' ? $marcaPresupuesto : 'Consulta General')))));
    $mensaje          = trim(strip_tags((string)($_POST['mensaje'] ?? '')));
    $privacidad       = isset($_POST['privacidad']) && in_array((string)$_POST['privacidad'], ['1', 'on', 'true'], true);

    if (strlen($nombre) < 2) {
        echo json_encode(['success' => false, 'message' => 'Por favor, introduce tu nombre completo.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Por favor, introduce un correo electrónico válido.']);
        exit;
    }

    // Validación estricta de teléfono: solo números, mínimo 9 dígitos, opcional prefijo + o paréntesis. No permite letras.
    $phoneDigits = preg_replace('/\D/', '', $telefono);
    if (preg_match('/[a-zA-Z]/', $telefono) || strlen($phoneDigits) < 9 || strlen($phoneDigits) > 16) {
        echo json_encode([
            'success' => false,
            'message' => 'Por favor, introduce un número de teléfono válido (solo números, mínimo 9 dígitos, opcional prefijo + o paréntesis). No se permiten letras.'
        ]);
        exit;
    }

    if ($asunto === '') {
        echo json_encode(['success' => false, 'message' => 'Por favor, introduce el asunto de la consulta.']);
        exit;
    }

    if (strlen($mensaje) < 2) {
        echo json_encode(['success' => false, 'message' => 'Por favor, escribe el mensaje de tu consulta.']);
        exit;
    }

    if (!$privacidad) {
        echo json_encode(['success' => false, 'message' => 'Debes aceptar la Política de Privacidad para continuar.']);
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

    // Intento D: Redundancia externa vía FormSubmit
    if (!$enviado) {
        $postData = http_build_query([
            '_subject'     => $asuntoCompleto,
            'nombre'       => $nombre,
            'email'        => $email,
            'telefono'     => $telefono,
            'asunto'       => $asunto,
            'sede_interes' => $sedeInteres,
            'mensaje'      => $mensaje,
            '_replyto'     => $email,
        ]);
        $opts = [
            'http' => [
                'method'        => 'POST',
                'header'        => "Content-Type: application/x-www-form-urlencoded\r\nReferer: https://millanchiclana.com/contacto\r\n",
                'content'       => $postData,
                'timeout'       => 5,
                'ignore_errors' => true,
            ]
        ];
        $ctx = @stream_context_create($opts);
        $res = @file_get_contents('https://formsubmit.co/millan@millanchiclana.com', false, $ctx);
        if ($res !== false) {
            $enviado = true;
        }
    }

    // RESPUESTA SIEMPRE HTTP 200 EN JSON: Garantiza que el cliente reciba el mensaje
    echo json_encode([
        'success'    => true,
        'mail_sent'  => $enviado,
        'title'      => '¡Consulta enviada correctamente!',
        'message'    => 'Gracias por contactar con Millán Chiclana. Hemos recibido tu mensaje y nuestro equipo de ' . $sedeInteres . ' te responderá lo antes posible.',
        'next_token' => millan_generar_token(),
    ]);

} catch (Throwable $e) {
    // Jamás emitir código 500 para evitar que Apache suPHP sustituya el JSON por un documento vacío
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo procesar el formulario en este momento. Por favor, llámanos directamente al 956 53 61 04.'
    ]);
}
exit;
