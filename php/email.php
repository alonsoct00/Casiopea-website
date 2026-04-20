<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Sanitizar inputs
    $name    = htmlspecialchars(trim($_POST['name']));
    $email   = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone   = htmlspecialchars(trim($_POST['phone']));
    $message = htmlspecialchars(trim($_POST['message']));
    $subject = isset($_POST['subject']) && $_POST['subject'] !== ''
        ? htmlspecialchars(trim($_POST['subject']))
        : 'Nuevo mensaje desde sitio web';

    $to = 'somoscasiopea@gmail.com';

    // Headers importantes
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8\r\n";
    $headers .= "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Cuerpo del correo
    $body = "
        <h2>Nuevo mensaje desde el sitio</h2>
        <p><strong>Nombre:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Teléfono:</strong> $phone</p>
        <p><strong>Asunto:</strong> $subject</p>
        <p><strong>Mensaje:</strong><br>$message</p>
    ";

    if (mail($to, $subject, $body, $headers)) {
        echo 'sent';
    } else {
        echo 'failed';
    }
}
?>