import { pool } from "../db.js";
import jwt from "jsonwebtoken"; // falta implementacion de jwt en reqs

export const Espacio = {
  getByEdificios: async (req, res) => {
    const { ids_edificios } = req.body;

    if (!Array.isArray(ids_edificios) || ids_edificios.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de IDs de edificios válida."
      });
    }

    try {
      const placeholders = ids_edificios.map((_, index) => `$${index + 1}`).join(', ');
      const query = `SELECT * FROM guayaba.Espacio WHERE id_edificio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_edificios);

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo espacios por edificios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const query = `SELECT * FROM guayaba.Espacio WHERE id_espacio = $1`;
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Espacio no encontrado" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error al obtener el espacio:", error.message);
      res.status(500).json({ error: "Error al obtener el espacio." });
    }
  },

  createEspacio: async (req, res) => {
    const {
      id_edificio,
      nombre,
      estado,
      clasificacion,
      uso,
      tipo,
      piso,
      capacidad,
      mediciónmt2
    } = req.body;

    if (
      !id_edificio ||
      !nombre ||
      !estado ||
      !clasificacion ||
      !uso ||
      !tipo ||
      !piso ||
      !capacidad ||
      !mediciónmt2
    ) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Espacio WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        return res.json({
          message: "El espacio ya está registrado.",
          registered: true,
        });
      }

      const espacioResult = await pool.query(
        `INSERT INTO guayaba.Espacio (id_edificio, nombre, estado, clasificacion, uso, tipo, piso, capacidad, mediciónmt2)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_espacio`,
        [
          id_edificio,
          nombre,
          estado,
          clasificacion,
          uso,
          tipo,
          piso,
          capacidad,
          mediciónmt2
        ]
      );

      if (espacioResult.rowCount === 0) {
        throw new Error("No se pudo crear el espacio.");
      }

      return res.json({
        message: "Espacio creado con éxito.",
        registered: true,
        espacio: espacioResult.rows[0],
      });
    } catch (err) {
      console.error("Error al crear el espacio.", err.message);
      res.status(500).json({ error: "Error al crear el espacio." });
    }
  },

  updateEspacio: async (req, res) => {
    const {
      id_espacio,
      id_edificio,
      nombre,
      estado,
      clasificacion,
      uso,
      tipo,
      piso,
      capacidad,
      mediciónmt2
    } = req.body;

    try {
      const updateEspacioQuery = `
          UPDATE guayaba.Espacio
          SET id_edificio = $2, nombre = $3, estado = $4, clasificacion = $5, uso = $6, tipo = $7, piso = $8, capacidad = $9, mediciónmt2 = $10
          WHERE id_espacio = $1
          RETURNING *;
          `;

      const values = [
        id_espacio,
        id_edificio,
        nombre,
        estado,
        clasificacion,
        uso,
        tipo,
        piso,
        capacidad,
        mediciónmt2
      ];
      const result = await pool.query(updateEspacioQuery, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Espacio no encontrado" });
      }

      res.status(200).json({ message: "Espacio actualizado exitosamente", espacio: result.rows[0] });
    } catch (error) {
      console.error("Error al actualizar el espacio:", error.message);
      res.status(500).json({ error: "Hubo un problema al actualizar el espacio." });
    }
  },

  addEspaciosManual: async (req, res) => {
    const { espacios } = req.body; // Array de espacios
    try {
      await pool.query("BEGIN"); // Iniciar transacción
      const addedEspacios = [];
      for (const espacio of espacios) {
        const {
          id_edificio,
          nombre,
          estado,
          clasificacion,
          uso,
          tipo,
          piso,
          capacidad,
          mediciónmt2
        } = espacio;

        const result = await pool.query(
          `INSERT INTO guayaba.Espacio (id_edificio, nombre, estado, clasificacion, uso, tipo, piso, capacidad, mediciónmt2)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            id_edificio,
            nombre,
            estado,
            clasificacion,
            uso,
            tipo,
            piso,
            capacidad,
            mediciónmt2
          ]
        );

        addedEspacios.push(result.rows[0]);
      }
      await pool.query("COMMIT"); // Confirmar transacción
      res.status(200).json({
        message: "Espacios añadidos exitosamente.",
        espacios: addedEspacios,
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir espacios:", error.message);
      res.status(500).json({
        error: error.message || "Hubo un problema al añadir los espacios.",
      });
    }
  },

  deleteEspacio: async (req, res) => {
    const { id } = req.params;

    try {
      const deleteQuery = `DELETE FROM guayaba.Espacio WHERE id_espacio = $1 RETURNING *;`;
      const result = await pool.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Espacio no encontrado" });
      }

      res.status(200).json({ message: "Espacio eliminado exitosamente", espacio: result.rows[0] });
    } catch (error) {
      console.error("Error eliminando espacio:", error);
      res.status(500).json({ success: false, error: "Error al eliminar espacio" });
    }
  }
};