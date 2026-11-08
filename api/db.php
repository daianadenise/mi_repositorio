<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function conexion(): PDO
{
    $archivo = __DIR__ . '/config.php';
    if (!is_file($archivo)) {
        responder(500, ['error' => 'Falta api/config.php con los datos de la base de datos']);
    }
    $config = require $archivo;

    try {
        return new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['database']),
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    } catch (PDOException $e) {
        error_log('Error de conexión MySQL: ' . $e->getMessage());
        responder(500, ['error' => 'No se pudo conectar a la base de datos']);
    }
}

function leerJson(): array
{
    $datos = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($datos) ? $datos : [];
}
