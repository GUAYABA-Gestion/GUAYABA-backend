import { pool } from "../db.js";
import jwt from "jsonwebtoken";

export const Edificio = {
  createEdificio: async (req, res) => {
    const {
      id_sede,
      id_titular,
      nombre,
      direccion,
      categoria,
      propiedad,
      area_terreno,
      area_construida,
      cert_uso_suelo,
    } = req.body;

    if (
      (!id_sede ||
        !id_titular ||
        !nombre ||
        !direccion ||
        !categoria ||
        !propiedad,
      !area_terreno || !area_construida || !cert_uso_suelo)
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    try {
      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Edificio WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        return res.json({
          message: "El edificio ya está registrado.",
          registered: true,
        });
      }

      const edificioResult = await pool.query(
        `INSERT INTO guayaba.Edificio (id_sede, id_titular, nombre, direccion,
            categoria, propiedad, area_terreno, area_construida, cert_uso_suelo) VALUES ($1,
            $2, $3, $4, $5, $6, $7, $8 , $9) RETURNING id_edificio`,
        [
          id_sede,
          id_titular,
          nombre,
          direccion,
          categoria,
          propiedad,
          area_terreno,
          area_construida,
          cert_uso_suelo,
        ]
      );

      if (edificioResult.rowCount === 0) {
        throw new Error("No se pudo crear el edificio.");
      }

      return res.json({
        message: "Edificio creado con éxito.",
        registered: true,
      });
    } catch (err) {
      console.error("Error al crear el edificio.", err.message);
      res.status(500).json({ error: "Error al crear el edificio." });
    }
  },

  getEdificios: async (req, res) => {
    try {
      const query = `
        SELECT e.id_edificio, e.nombre, e.dirección, e.categoría, e.propiedad, e.area_terreno,
                e.area_construida, e.cert_uso_suelo, s.nombre AS nombre_sede
        FROM guayaba.Edificio e
        INNER JOIN guayaba.Sede s ON e.id_sede = s.id_sede
      `;

      const { rows } = await pool.query(query);

      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los edificios:", error.message);
      res.status(500).json({ error: "Error al obtener los edificios." });
    }
  },


  updateEdificio: async (req, res) => {
    const {
      id_sede,
      id_titular,
      nombre,
      direccion,
      categoria,
      propiedad,
      area_terreno,
      area_construida,
      cert_uso_suelo,
    } = req.body;

    try {
      const updateEdificioQuery = `
          UPDATE guayaba.Edificio
          SET id_sede = $2, id_titular = $3 nombre = $4, direccion = $5, categoria = $6,
          propiedad = $7, area_terreno = $8, area_construida = $9, cert_uso_suelo = $10
          WHERE id_edificio = $1;
          `;

      const values = [
        id_sede,
        id_titular,
        nombre,
        direccion,
        categoria,
        propiedad,
        area_terreno,
        area_construida,
        cert_uso_suelo,
      ];
      await pool.query(updateEdificioQuery, values);

      res.status(200).json({ message: "Sede actualizada exitosamente" });
    } catch (error) {
      console.error("Error al actualizar la sede:", error.message);
      res
        .status(500)
        .json({ error: "Hubo un problema al actualizar la sede." });
    }
  },
};
