import { pool } from "../db.js";
import jwt from "jsonwebtoken";

// Exportar un objeto con todas las funciones del controlador
export const User = {
  // Función para verificar si un usuario existe
  checkUser: async (req, res) => {
    try {
      const { email } = req.user; // Email obtenido del middleware

      const result = await pool.query(
        `SELECT * FROM guayaba.Persona WHERE correo = $1`,
        [email]
      );

      if (result.rowCount === 0) return res.json({ exists: false });

      // Generar nuevo JWT
      const user = result.rows[0];
      const token = jwt.sign(
        {
          userId: user.id_persona,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ exists: true, token });
    } catch (error) {
      console.error("Error en checkUser:", error);
      res.status(500).json({ error: "Error al verificar usuario" });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { email, name } = req.user; // Datos del middleware
      const { id_sede } = req.body;

      // Insertar el nuevo usuario en la tabla guayaba.Persona
      const result = await pool.query(
        `INSERT INTO guayaba.Persona (correo, nombre, id_sede, rol) VALUES ($1, $2, $3, $4) RETURNING *`,
        [email, name, id_sede, "user"] // Asignar rol "user" por defecto
      );

      const newUser = result.rows[0];
      const token = jwt.sign(
        {
          userId: newUser.id_persona,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ registered: true, user: newUser, token });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(400).json({ error: "Error al registrar usuario" });
    }
  },

  getUsersData: async (req, res) => {
    try {
      // Consulta para obtener todos los usuarios con detalles de sede
      const users = await pool.query(
        `SELECT 
          id_persona, 
          correo, 
          nombre, 
          telefono, 
          rol, 
          detalles, 
          id_sede,
          es_manual
        FROM guayaba.Persona;`
      );

      if (users.rowCount === 0) {
        return res.status(404).json({ error: "Usuarios no encontrados" });
      }

      res.json(users.rows);
    } catch (error) {
      console.error("Error en getUsersData:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getUserData: async (req, res) => {
    try {
      // Usuario ya validado por el middleware
      const user = await pool.query(
        `SELECT id_persona, correo, nombre, rol, id_sede 
         FROM guayaba.Persona 
         WHERE id_persona = $1`,
        [req.user.userId]
      );

      if (user.rowCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user.rows[0]);
    } catch (error) {
      console.error("Error en getMe:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  getUserDataById: async (req, res) => {
    try {
      // Usuario ya validado por el middleware
      const user = await pool.query(
        `SELECT id_persona, correo, nombre, rol, id_sede 
         FROM guayaba.Persona 
         WHERE id_persona = $1`,
        [req.body.userId]
      );

      if (user.rowCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user.rows[0]);
    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.user.userId; // Obtener ID del usuario autenticado

      // Iniciar transacción
      await pool.query("BEGIN");

      // 1. Eliminar relaciones dependientes (si las hay)
      await pool.query(
        `DELETE FROM guayaba.Mantenimiento 
         WHERE id_encargado = $1`,
        [userId]
      );

      await pool.query(
        `UPDATE guayaba.Sede 
         SET coordinador = NULL 
         WHERE coordinador = $1`,
        [userId]
      );

      // 2. Eliminar usuario
      const result = await pool.query(
        `DELETE FROM guayaba.Persona 
         WHERE id_persona = $1 
         RETURNING id_persona, correo`,
        [userId]
      );

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Confirmar transacción
      await pool.query("COMMIT");

      res.json({
        success: true,
        deletedUser: result.rows[0],
      });
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ error: "Error al eliminar la cuenta" });
    }
  },

  updateUser: async (req, res) => {
    const { id_persona, nombre, correo, telefono, rol, detalles, id_sede } =
      req.body;

    try {
      const updatePersonaQuery = `
        UPDATE guayaba.Persona
        SET nombre = $2, correo = $3, telefono = $4, rol = $5, detalles = $6, id_sede = $7
        WHERE id_persona = $1
        RETURNING *;
      `;

      const values = [
        id_persona,
        nombre,
        correo,
        telefono,
        rol,
        detalles,
        id_sede,
      ];
      const result = await pool.query(updatePersonaQuery, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }

      res.status(200).json(result.rows[0]); // Devuelve el usuario actualizado
    } catch (error) {
      console.error("Error al actualizar la cuenta:", error.message);
      res
        .status(500)
        .json({ error: "Hubo un problema al actualizar la cuenta." });
    }
  },

  addUsersManual: async (req, res) => {
    const { users } = req.body; // Array de usuarios
    try {
      await pool.query("BEGIN"); // Iniciar transacción
      const addedUsers = [];
      for (const user of users) {
        const { nombre, correo, telefono, rol, detalles, id_sede } = user;

        const result = await pool.query(
          `INSERT INTO guayaba.Persona (nombre, correo, telefono, rol, detalles, id_sede, es_manual)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *`,
          [nombre, correo, telefono, rol, detalles, id_sede]
        );

        addedUsers.push(result.rows[0]);
      }
      await pool.query("COMMIT"); // Confirmar transacción
      res
        .status(200)
        .json({
          message: "Usuarios añadidos exitosamente.",
          users: addedUsers,
        });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir usuarios back:", error.message);
      res
        .status(500)
        .json({
          error: error.message || "Hubo un problema al añadir los usuarios.",
        });
    }
  },
  deleteUserManual: async (req, res) => {
    const { id_persona } = req.body;
    try {
      await pool.query(
        `DELETE FROM guayaba.Persona WHERE id_persona = $1 AND es_manual = TRUE`,
        [id_persona]
      );
      res.status(200).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      res
        .status(500)
        .json({ error: "Hubo un problema al eliminar el usuario." });
    }
  },

  getUserReferences: async (req, res) => {
    const { id_persona } = req.body;
    try {
      const references = [];

      // Verificar referencias en la tabla Mantenimiento
      const mantenimientoResult = await pool.query(
        `SELECT id_mantenimiento FROM guayaba.Mantenimiento WHERE id_encargado = $1`,
        [id_persona]
      );
      if (mantenimientoResult.rowCount > 0) {
        references.push("Mantenimiento");
      }

      // Verificar referencias en la tabla Sede
      const sedeResult = await pool.query(
        `SELECT id_sede FROM guayaba.Sede WHERE coordinador = $1`,
        [id_persona]
      );
      if (sedeResult.rowCount > 0) {
        references.push("Sede");
      }

      res.json({ references });
    } catch (error) {
      console.error("Error al obtener referencias del usuario:", error.message);
      res.status(500).json({ error: "Hubo un problema al obtener las referencias del usuario." });
    }
  },
};
