import { query } from "../utils/dbUtils.js"; // Importar la función query
import fs from "fs";
import path from "path";

/**
 * Carga datos en una tabla específica desde un archivo SQL.
 * @param {string} nombreTabla - Nombre de la tabla a poblar.
 * @param {string} rutaQuery - Ruta del archivo SQL con la query.
 */
async function cargarDatos(nombreTabla, rutaQuery) {
  try {
    // Verificar si la tabla ya tiene datos
    const checkTabla = await query(`SELECT COUNT(*) AS count FROM ${nombreTabla};`);
    const tablaCount = parseInt(checkTabla.rows[0].count, 10);

    if (tablaCount > 0) {
      console.log(`La tabla ${nombreTabla} ya está poblada, no es necesario cargar los datos.`);
      return;
    }

    // Leer y ejecutar la query desde el archivo
    const queryPath = path.resolve(rutaQuery); // Resolver la ruta absoluta
    const sqlQuery = fs.readFileSync(queryPath, "utf-8");
    await query(sqlQuery);

    console.log(`Datos cargados correctamente para la tabla ${nombreTabla}.`);
  } catch (error) {
    console.error(`Error al inicializar la tabla ${nombreTabla}:`, error);
  }
}

/**
 * Función principal para cargar todos los datos.
 */
(async () => {
  try {
    // Cargar datos para cada tabla
    await cargarDatos("guayaba.Municipio", "./dataQueries/queryDepartMunicip.txt");
    await cargarDatos("guayaba.Persona", "./dataQueries/queryPersona.txt");
    await cargarDatos("guayaba.Sede", "./dataQueries/querySede.txt");
    await cargarDatos("guayaba.Edificio", "./dataQueries/queryEdificio.txt")
    await cargarDatos("guayaba.Espacio", "./dataQueries/queryEspacio.txt");
    await cargarDatos("guayaba.Mantenimiento", "./dataQueries/queryMantenimiento.txt");


    console.log("Todos los datos han sido cargados correctamente.");
  } catch (error) {
    console.error("Error general al cargar los datos:", error);
  }
})();