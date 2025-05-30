import { pool } from "../db.js";

export const Edificio = {

  getMetricasAgrupadas: async (req, res) => {
    const { ids_sedes } = req.body;

    // Validar que se proporcionen las IDs de las sedes
    if (!Array.isArray(ids_sedes) || ids_sedes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de IDs de sedes válida.",
      });
    }

    try {
      // Crear placeholders para las IDs de las sedes
      const placeholders = ids_sedes.map((_, index) => `$${index + 1}`).join(', ');

      // Consulta SQL para obtener las métricas agrupadas
      const query = `
        SELECT 
          e.categoría AS categoria,
          e.propiedad,
          e.cert_uso_suelo AS cert_uso_suelo,
          COUNT(*) AS total_edificios,
          SUM(e.area_terreno) AS suma_area_terreno,
          AVG(e.area_terreno) AS promedio_area_terreno,
          SUM(e.area_construida) AS suma_area_construida,
          AVG(e.area_construida) AS promedio_area_construida,
          ARRAY_AGG(e.id_edificio) AS ids_edificios,
          ARRAY_AGG(CONCAT(s.nombre, ' - ', e.nombre)) AS nombres_sedes_edificios
        FROM 
          guayaba.Edificio e
        JOIN 
          guayaba.Sede s ON e.id_sede = s.id_sede
        WHERE 
          e.id_sede IN (${placeholders})
        GROUP BY 
          e.categoría, e.propiedad, e.cert_uso_suelo;
      `;

      // Ejecutar la consulta
      const { rows } = await pool.query(query, ids_sedes);

      // Responder con los datos agrupados
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo métricas agrupadas de edificios:", error.message);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getBySedes: async (req, res) => {
    const { ids_sedes } = req.body;
  
    if (!Array.isArray(ids_sedes) || ids_sedes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de IDs de sedes válida."
      });
    }
  
    try {
      const placeholders = ids_sedes.map((_, index) => `$${index + 1}`).join(', ');
      const query = `
        SELECT 
          e.id_edificio,
          e.nombre,
          e.dirección,
          e.id_sede,
          e.categoría,
          e.propiedad,
          e.area_terreno,
          e.area_construida,
          e.cert_uso_suelo,
          e.id_titular,
          p.correo AS correo_titular
        FROM 
          guayaba.Edificio e
        LEFT JOIN 
          guayaba.Persona p ON e.id_titular = p.id_persona
        WHERE 
          e.id_sede IN (${placeholders});
      `;
      const { rows } = await pool.query(query, ids_sedes);
  
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo edificios por sedes:", error.message);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getEdificios: async (req, res) => {
    try {
      const query = `
          SELECT 
            e.id_edificio,
            e.nombre,
            e.dirección,
            e.id_sede,
            e.categoría,
            e.propiedad,
            e.area_terreno,
            e.area_construida,
            e.cert_uso_suelo,
            e.id_titular,
            p.correo AS correo_titular
          FROM 
            guayaba.Edificio e
          LEFT JOIN 
            guayaba.Persona p ON e.id_titular = p.id_persona;
      `;

      const { rows } = await pool.query(query);

      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los edificios:", error.message);
      res.status(500).json({ error: "Error al obtener los edificios." });
    }
  },

  getEdificioById: async (req, res) => {
    const { id } = req.params;

    try {
      const query = `
        SELECT 
          e.id_edificio,
          e.nombre,
          e.dirección,
          e.id_sede,
          e.categoría,
          e.propiedad,
          e.area_terreno,
          e.area_construida,
          e.cert_uso_suelo,
          e.id_titular,
          p.correo AS correo_titular
        FROM 
          guayaba.Edificio e
        LEFT JOIN 
          guayaba.Persona p ON e.id_titular = p.id_persona
        WHERE 
          e.id_edificio = $1;
      `;
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Edificio no encontrado" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error al obtener el edificio:", error.message);
      res.status(500).json({ error: "Error al obtener el edificio." });
    }
  },

  addEdificiosManual: async (req, res) => {
    const { edificios } = req.body; // Array de edificios
    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const addedEdificios = [];
      for (const edificio of edificios) {
        const {
          id_sede,
          id_titular,
          nombre,
          dirección,
          categoría,
          propiedad,
          area_terreno,
          area_construida,
          cert_uso_suelo,
        } = edificio;

        const result = await pool.query(
          `INSERT INTO guayaba.Edificio (id_sede, id_titular, nombre, dirección, categoría, propiedad, area_terreno, area_construida, cert_uso_suelo)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            id_sede,
            id_titular,
            nombre,
            dirección,
            categoría,
            propiedad,
            area_terreno,
            area_construida,
            cert_uso_suelo,
          ]
        );

        addedEdificios.push(result.rows[0]);
      }
      await pool.query("COMMIT"); // Confirmar transacción
      res.status(200).json({
        message: "Edificios añadidos exitosamente.",
        edificios: addedEdificios,
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir edificios:", error.message);
      res.status(500).json({
        error: error.message || "Hubo un problema al añadir los edificios.",
      });
    }
  },

  createEdificio: async (req, res) => {
    const {
      id_sede,
      id_titular,
      nombre,
      dirección,
      categoría,
      propiedad,
      area_terreno,
      area_construida,
      cert_uso_suelo,
    } = req.body;

    if (
      !id_sede ||
      !id_titular ||
      !nombre ||
      !dirección ||
      !categoría ||
      !propiedad ||
      !area_terreno ||
      !area_construida ||
      !cert_uso_suelo
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Edificio WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.json({
          message: "El edificio ya está registrado.",
          registered: true,
        });
      }

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const edificioResult = await pool.query(
        `INSERT INTO guayaba.Edificio (id_sede, id_titular, nombre, dirección,
            categoría, propiedad, area_terreno, area_construida, cert_uso_suelo) VALUES ($1,
            $2, $3, $4, $5, $6, $7, $8 , $9) RETURNING id_edificio`,
        [
          id_sede,
          id_titular,
          nombre,
          dirección,
          categoría,
          propiedad,
          area_terreno,
          area_construida,
          cert_uso_suelo,
        ]
      );

      if (edificioResult.rowCount === 0) {
        throw new Error("No se pudo crear el edificio.");
      }

      await pool.query("COMMIT"); // Confirmar transacción

      return res.json({
        message: "Edificio creado con éxito.",
        registered: true,
        edificio: edificioResult.rows[0],
      });
    } catch (err) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al crear el edificio.", err.message);
      res.status(500).json({ error: "Error al crear el edificio." });
    }
  },

  updateEdificio: async (req, res) => {
    const {
      id_edificio,
      id_sede,
      id_titular,
      nombre,
      dirección,
      categoría,
      propiedad,
      area_terreno,
      area_construida,
      cert_uso_suelo
    } = req.body;


    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const updateEdificioQuery = `
          UPDATE guayaba.Edificio
          SET id_sede = $2, id_titular = $3, nombre = $4, dirección = $5, categoría = $6,
          propiedad = $7, area_terreno = $8, area_construida = $9, cert_uso_suelo = $10
          WHERE id_edificio = $1
          RETURNING *;
          `;

      const values = [
        id_edificio,
        id_sede,
        id_titular,
        nombre,
        dirección,
        categoría,
        propiedad,
        area_terreno,
        area_construida,
        cert_uso_suelo,
      ];
      const result = await pool.query(updateEdificioQuery, values);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Edificio no encontrado" });
      }

      await pool.query("COMMIT"); // Confirmar transacción

      res.status(200).json({
        message: "Edificio actualizado exitosamente",
        edificio: result.rows[0],
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al actualizar el edificio:", error.message);
      res.status(500).json({ error: "Hubo un problema al actualizar el edificio." });
    }
  },

  deleteEdificio: async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const deleteQuery = `DELETE FROM guayaba.Edificio WHERE id_edificio = $1 RETURNING *;`;
      const result = await pool.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Edificio no encontrado" });
      }

      await pool.query("COMMIT"); // Confirmar transacción

      res.status(200).json({
        message: "Edificio eliminado exitosamente",
        edificio: result.rows[0],
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      if (error.code === "23503") {
        // Foreign key violation
        res.status(400).json({
          error: "No se puede eliminar el edificio hasta que se eliminen los espacios y otros registros asociados.",
        });
      } else {
        console.error("Error al eliminar el edificio:", error.message);
        res.status(500).json({ error: "Hubo un problema al eliminar el edificio." });
      }
    }
  },

};