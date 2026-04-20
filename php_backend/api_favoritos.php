<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Para simplicidad en servidores sin url rewrite modificado, recibimos el id como parametro $_GET['id'] 
// para PUT y DELETE.
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        // Obtener favoritos de un usuario (ej. ?usuario_id=1)
        $usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : null;
        if (!$usuario_id) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'El parametro usuario_id es requerido']);
            break;
        }

        try {
            $stmt = $pdo->prepare('SELECT f.*, c.nombre as categoria_nombre FROM favoritos f JOIN categorias_favoritos c ON f.categoria_id = c.id WHERE f.usuario_id = ?');
            $stmt->execute([$usuario_id]);
            $favoritos = $stmt->fetchAll();
            http_response_code(200);
            echo json_encode(['data' => $favoritos]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al obtener favoritos']);
        }
        break;

    case 'POST':
        // Crear un favorito
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->usuario_id) || !isset($data->categoria_id) || !isset($data->termino_busqueda)) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos obligatorios (usuario_id, categoria_id, termino_busqueda)']);
            break;
        }

        try {
            $stmt = $pdo->prepare('INSERT INTO favoritos (usuario_id, categoria_id, termino_busqueda, notas_usuario) VALUES (?, ?, ?, ?)');
            $notas = isset($data->notas_usuario) ? $data->notas_usuario : null;
            $stmt->execute([$data->usuario_id, $data->categoria_id, $data->termino_busqueda, $notas]);
            
            http_response_code(201); // 201 Created requerimiento del anexo
            echo json_encode(['message' => 'Favorito creado exitosamente', 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error interno al crear el favorito']);
        }
        break;

    case 'PUT':
        // Modificar un favorito
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el id del favorito a modificar e.g. ?id=1']);
            break;
        }
        $data = json_decode(file_get_contents("php://input"));
        
        try {
            // Verificar si existe (Retornar 404 requerimiento anexo)
            $check = $pdo->prepare('SELECT id FROM favoritos WHERE id = ?');
            $check->execute([$id]);
            if ($check->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Favorito no encontrado']);
                break;
            }

            // Para simplificar, actualizamos notas_usuario y/o termino_busqueda
            if (isset($data->termino_busqueda) && isset($data->notas_usuario)) {
                $stmt = $pdo->prepare('UPDATE favoritos SET termino_busqueda = ?, notas_usuario = ? WHERE id = ?');
                $stmt->execute([$data->termino_busqueda, $data->notas_usuario, $id]);
            } else if (isset($data->notas_usuario)) {
                $stmt = $pdo->prepare('UPDATE favoritos SET notas_usuario = ? WHERE id = ?');
                $stmt->execute([$data->notas_usuario, $id]);
            } else if (isset($data->termino_busqueda)) {
                $stmt = $pdo->prepare('UPDATE favoritos SET termino_busqueda = ? WHERE id = ?');
                $stmt->execute([$data->termino_busqueda, $id]);
            }

            http_response_code(200);
            echo json_encode(['message' => 'Favorito modificado exitosamente']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al modificar el favorito']);
        }
        break;

    case 'DELETE':
        // Eliminar un favorito
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el id del favorito a eliminar e.g. ?id=1']);
            break;
        }

        try {
            // Verificar si existe para retornar 404
            $check = $pdo->prepare('SELECT id FROM favoritos WHERE id = ?');
            $check->execute([$id]);
            if ($check->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Favorito no encontrado']);
                break;
            }

            $stmt = $pdo->prepare('DELETE FROM favoritos WHERE id = ?');
            $stmt->execute([$id]);
            
            http_response_code(200);
            echo json_encode(['message' => 'Favorito eliminado']);
        } catch (Exception $e) {
            http_response_code(500); // 500 error en el servidor
            echo json_encode(['error' => 'Error al eliminar el favorito']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
