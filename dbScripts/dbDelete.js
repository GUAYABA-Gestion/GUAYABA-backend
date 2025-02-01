import { query } from "../utils/dbUtils.js"; // Importar la función query

const deleteQuery = `
DROP SCHEMA guayaba CASCADE;
`;

const deleteDB = async () => {
  try {
    console.log("Eliminando la base de datos...");
    await query(deleteQuery);
    console.log("Base de datos eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la base de datos:", error);
  }
};

deleteDB();
