import { query } from "../utils/dbUtils.js";

const anyQuery = `
SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') AT TIME ZONE 'UTC-5' AS current_timestamp;
`;

const runQuery = async () => {
  try {
    console.log("Ejecutando query...");

    // Capture the query result
    const result = await query(anyQuery);

    // Log the raw result for inspection
    console.log("Registros encontrados:", result.rows);

    console.log("Query ejecutada correctamente.");
    return result.rows; // Return the results
  } catch (error) {
    console.error("Error ejecutando la query:", error);
    throw error; // Re-throw the error if needed
  }
};

// Execute and handle results
runQuery()
  .then(results => console.log("Datos obtenidos:", results))
  .catch(error => console.error("Error en la ejecución:", error));