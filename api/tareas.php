<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

$db = conexion();

switch ($_SERVER['REQUEST_METHOD']) {
    // Listar tareas
    case 'GET':
        $tareas = $db->query('SELECT id, descripcion, completada FROM tareas ORDER BY orden, id')->fetchAll();
        foreach ($tareas as &$t) {
            $t['id'] = (int) $t['id'];
            $t['completada'] = (bool) $t['completada'];
        }
        responder(200, $tareas);

    // Marcar / desmarcar una tarea: {"id": 1, "completada": true}
    case 'POST':
        $datos = leerJson();
        $id = filter_var($datos['id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id || !isset($datos['completada'])) {
            responder(400, ['error' => 'Se requieren "id" y "completada"']);
        }
        $sql = $db->prepare('UPDATE tareas SET completada = :c WHERE id = :id');
        $sql->execute([':c' => $datos['completada'] ? 1 : 0, ':id' => $id]);
        responder(200, ['ok' => true]);

    default:
        header('Allow: GET, POST');
        responder(405, ['error' => 'Método no permitido']);
}
