-- Esquema de la base de datos para Coaching Motivacional.
-- Importar desde hPanel → Bases de datos → phpMyAdmin → (tu base) → Importar.
-- No crea la base de datos: en Hostinger se crea desde hPanel (nombre tipo u123456789_coaching).

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS tareas (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(255) NOT NULL,
    completada  TINYINT(1)   NOT NULL DEFAULT 0,
    orden       INT          NOT NULL DEFAULT 0,
    creada_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS estados_animo (
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    estado    ENUM('feliz', 'triste', 'ansioso', 'motivado') NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_creado_en (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tareas iniciales (solo si la tabla está vacía)
INSERT INTO tareas (descripcion, orden)
SELECT * FROM (
    SELECT 'Escribir tus metas personales' AS descripcion, 1 AS orden
    UNION ALL SELECT 'Practicar meditación durante 10 minutos', 2
    UNION ALL SELECT 'Hacer ejercicio físico', 3
    UNION ALL SELECT 'Escribir 3 cosas por las que agradeces', 4
) AS iniciales
WHERE NOT EXISTS (SELECT 1 FROM tareas);
