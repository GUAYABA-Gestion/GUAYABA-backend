import { query } from "../utils/dbUtils.js"; // Importar la función query

const anyQuery = `
BEGIN;

SELECT * FROM guayaba.Sede;
COMMIT;

`;

const runQuery = async () => {
  try {
    console.log("Ejecutando query...");
    await query(anyQuery);
    console.log("Query ejecutada correctamente.");
  } catch (error) {
    console.error("Error ejecutando la query:", error);
  }
};

runQuery();
