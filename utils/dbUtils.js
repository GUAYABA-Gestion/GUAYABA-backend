import { pool } from "../db.js";

/**
 * Ejecuta una consulta SQL genérica.
 * @param {string} query - La consulta SQL a ejecutar.
 * @returns {Promise<object>} - El resultado de la consulta.
 */
export const query = async (query) => {
  try {
    const result = await pool.query(query);
    return result; // Retornar el resultado de la consulta
  } catch (err) {
    throw err; // Re-lanzar el error para manejarlo donde se llame
  }
};