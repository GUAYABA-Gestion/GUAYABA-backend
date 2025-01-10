// CORRER ESTO SOLO UNA VEZ, CON "node dbData.js" 

import { config } from 'dotenv';
import * as api from './api.js';
import fs from 'fs';

config();
api.initializeDB();

async function cargarDatos(nombreTabla, rutaQuery) {
    try {
        // Verificar si la tabla ya tiene datos
        const checkTabla = await api.query(`SELECT COUNT(*) AS count FROM ${nombreTabla};`);
        const tablaCount = parseInt(checkTabla.rows[0].count, 10);

        if (tablaCount > 0) {
            console.log(`La tabla ${nombreTabla} ya está poblada, no es necesario cargar los datos.`);
            return;
        }

        // Leer y ejecutar la query desde el archivo
        const query = fs.readFileSync(rutaQuery, 'utf-8');
        await api.query(query);

        console.log(`Datos cargados correctamente para la tabla ${nombreTabla}.`);
    } catch (error) {
        console.error(`Error al inicializar la tabla ${nombreTabla}:`, error);
    }
}

(async () => {
    //sacado y ajustado de https://github.com/jor3l/departamentos-municipios-colombia/blob/master/README.md
    await cargarDatos('guayaba.Municipio', 'queryDepartMunicip.txt');

    await cargarDatos('guayaba.Persona', 'queryPersona.txt');
    await cargarDatos('guayaba.Sede', 'querySede.txt');
})();
