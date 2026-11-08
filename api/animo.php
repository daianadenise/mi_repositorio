<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

const ESTADOS = ['feliz', 'triste', 'ansioso', 'motivado'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    responder(405, ['error' => 'Método no permitido']);
}

// Registrar estado de ánimo: {"estado": "feliz"}
$estado = leerJson()['estado'] ?? '';
if (!in_array($estado, ESTADOS, true)) {
    responder(400, ['error' => 'Estado de ánimo no válido']);
}

$sql = conexion()->prepare('INSERT INTO estados_animo (estado) VALUES (:e)');
$sql->execute([':e' => $estado]);
responder(201, ['ok' => true]);
