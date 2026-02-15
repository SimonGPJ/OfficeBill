<?php

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $titulo = $_POST['titulo'];
    $descripcion = $_POST['descripcion'];
    $tipo = $_POST['tipo'];
    $fecha = $_POST['fecha'];

    $destinatario = "tucorreo@gmail.com"; // CAMBIA ESTO
    $asunto = "Nueva solicitud de soporte - Sistema";

    $mensaje = "
    Nueva solicitud recibida:

    Título: $titulo
    Tipo: $tipo
    Fecha: $fecha

    Descripción:
    $descripcion
    ";

    $headers = "From: sistema@tudominio.com";

    if(mail($destinatario, $asunto, $mensaje, $headers)){
        echo "<script>
                alert('Solicitud enviada correctamente');
                window.location='../views/support.html';
              </script>";
    } else {
        echo "Error al enviar el correo.";
    }

}
?>
