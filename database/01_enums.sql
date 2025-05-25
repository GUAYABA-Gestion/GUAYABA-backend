-- Enums para Departamento/Municipio/Sede
-- (No enums necesarios)

-- Enums para Persona
CREATE TYPE guayaba.rol_persona AS ENUM (
    'admin',
    'coordinador',
    'mantenimiento',
    'usuario'
);

-- Enums para Edificio
CREATE TYPE guayaba.categoria_edificio AS ENUM (
    'Cat',
    'Principal',
    'Sede',
    'Sede y cat',
    'Otro'
);

CREATE TYPE guayaba.propiedad_edificio AS ENUM (
    'Propio',
    'Arrendado',
    'No operacional'
);

-- Enums para Espacio
CREATE TYPE guayaba.estado_espacio AS ENUM (
    'En funcionamiento',
    'Funcionamiento parcial',
    'En mantenimiento',
    'No funciona',
    'Deshabilitado'
);

CREATE TYPE guayaba.clasificacion_espacio AS ENUM (
    'Edificio/bloque',
    'Parqueadero',
    'Planta de tratamiento de agua',
    'Portería',
    'Unidad de almacenamiento de residuos',
    'Zona deportiva',
    'Campus',
    'Pozo séptico'
);

CREATE TYPE guayaba.uso_espacio AS ENUM (
    'Académico',
    'Académico-administrativo',
    'Administrativo',
    'Área común',
    'Bienestar universitario',
    'Docencia',
    'Extensión',
    'Investigación'
);

CREATE TYPE guayaba.tipo_espacio AS ENUM (
    'Anfiteatro animales',
    'Anfiteatro humanos',
    'Auditorio',
    'Aula/salón',
    'Baño hombres',
    'Baño mixto',
    'Baño mujeres',
    'Baño PMV',
    'Biblioteca',
    'Bodega',
    'Cafetería',
    'Camerino',
    'Cancha de juegos',
    'Consultorio',
    'Laboratorio',
    'Laboratorio simulación',
    'Local',
    'Oficina',
    'Otro (describa en observación)',
    'Sala de cómputo',
    'Sala de tutores',
    'Salón de juegos',
    'Z otro'
);

CREATE TYPE guayaba.piso_espacio AS ENUM (
    'Primer piso',
    'Segundo piso',
    'Tercer piso',
    'Cuarto piso',
    'Quinto piso',
    'Sexto piso',
    'Séptimo piso',
    'Octavo piso',
    'Noveno piso',
    'Décimo piso',
    'Campus',
    'Sótano',
    'Terraza',
    'Cubierta',
    'Z general'
);

-- Enums para Facultad
-- (No enums necesarios)
-- Enums para Programa
CREATE TYPE guayaba.nivel_programa AS ENUM (
    'Pregrado',
    'Posgrado'
);

-- Enums para Evento
CREATE TYPE guayaba.tipo_evento AS ENUM (
    'Clase',
    'Reunión',
    'Mantenimiento',
    'Evento',
    'Otro'
);

-- Enums para Mantenimiento
CREATE TYPE guayaba.tipo_contrato_mantenimiento AS ENUM (
    'Interno',
    'Externo',
    'Mixto',
    'Otro'
);

CREATE TYPE guayaba.tipo_mantenimiento AS ENUM (
    'Preventivo',
    'Correctivo',
    'Predictivo',
    'Otro'
);

CREATE TYPE guayaba.estado_mantenimiento AS ENUM (
    'Completado',
    'En proceso',
    'Pendiente',
    'Cancelado'
);

CREATE TYPE guayaba.necesidad_mantenimiento AS ENUM (
    'Adecuación puesto de trabajo',
    'Arreglo eléctrico',
    'Arreglo de piso',
    'Aseo',
    'Carpintería',
    'Cerrajería',
    'Ejecución de obra',
    'Fachada',
    'Fontanería',
    'Limpieza de cubiertas',
    'Luminarias',
    'Mantenimiento de sillas',
    'Pintura',
    'Plomería',
    'Tanque de aguas',
    'Traslados',
    'Ventanería',
    'Otro'
);

CREATE TYPE guayaba.prioridad_mantenimiento AS ENUM (
    'Alta',
    'Media',
    'Baja',
    'N/A'
);
