BEGIN;

INSERT INTO guayaba.Mantenimiento (
    id_espacio,
    id_encargado,
    id_evento,
    tipo_contrato,
    tipo,
    estado,
    necesidad,
    prioridad,
    detalle,
    fecha_asignacion,
    plazo_ideal,
    terminado,
    observacion
) VALUES
    (1, NULL, 7, 'Interno', 'Preventivo', 'Pendiente', 'Limpieza de cubiertas', 'Media', 'Limpieza programada de la cubierta del aula.', '2025-05-01 08:00:00', 7, FALSE, 'Programado para semana de receso'),
    (1, NULL, NULL, 'Externo', 'Correctivo', 'En proceso', 'Arreglo eléctrico', 'Alta', 'Reparación de luminarias dañadas.', '2025-05-10 09:00:00', 3, FALSE, 'Se detectó corto circuito en lámparas.'),
    (1, NULL, NULL, 'Mixto', 'Predictivo', 'Pendiente', 'Mantenimiento de sillas', 'Baja', 'Revisión y ajuste de sillas del aula.', '2025-05-15 10:00:00', 14, FALSE, NULL),
    (1, NULL, NULL, 'Interno', 'Correctivo', 'Completado', 'Pintura', 'Media', 'Pintura de paredes internas.', '2025-04-10 14:00:00', 5, TRUE, 'Trabajo realizado en abril.'),
    (1, NULL, 5, 'Otro', 'Otro', 'Pendiente', 'Aseo', 'N/A', 'Aseo profundo previo a evento especial.', '2025-05-20 07:00:00', 2, FALSE, 'Solicitado por coordinación.');

COMMIT;