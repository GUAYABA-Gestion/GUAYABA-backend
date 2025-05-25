BEGIN;

INSERT INTO guayaba.Evento (
    id_espacio,
    tipo,
    nombre,
    descripcion,
    id_programa,
    fecha_inicio,
    fecha_fin,
    hora_inicio,
    hora_fin,
    dias
) VALUES
    (1, 'Clase', 'Clase Anatomía I', 'Clase regular de Anatomía para primer semestre', 5, '2025-02-10', '2025-06-10', '08:00', '10:00', 'LMXJV'),
    (1, 'Clase', 'Clase Bioquímica', 'Clase de Bioquímica para segundo semestre', 5, '2025-02-10', '2025-06-10', '10:00', '12:00', 'LMXJV'),
    (1, 'Clase', 'Clase Fisiología', 'Clase de Fisiología animal', 5, '2025-02-10', '2025-06-10', '14:00', '16:00', 'LMXJV'),
    (1, 'Reunión', 'Reunión Docentes', 'Reunión semanal de docentes de veterinaria', 5, '2025-02-12', '2025-06-04', '16:00', '17:00', 'X'),
    (1, 'Evento', 'Charla Invitado', 'Charla sobre fauna silvestre con invitado externo', 2, '2025-03-15', '2025-03-15', '09:00', '11:00', 'S'),
    (1, 'Clase', 'Clase Producción Animal', 'Clase de Producción Animal', 4, '2025-02-10', '2025-06-10', '12:00', '14:00', 'LMXJV'),
    (1, 'Mantenimiento', 'Mantenimiento Proyector', 'Revisión y mantenimiento del proyector del aula', 5, '2025-04-01', '2025-04-01', '07:00', '08:00', 'X'),
    (1, 'Clase', 'Clase Ética Profesional', 'Clase de Ética para estudiantes de veterinaria', 5, '2025-02-10', '2025-06-10', '07:00', '08:00', 'LMXJV'),
    (1, 'Evento', 'Simulacro de Evacuación', 'Simulacro institucional de evacuación', 5, '2025-05-20', '2025-05-20', '11:00', '12:00', 'X'),
    (1, 'Clase', 'Clase Electiva Libre', 'Electiva libre para estudiantes de pregrado', 5, '2025-02-10', '2025-06-10', '16:00', '18:00', 'V');

COMMIT;