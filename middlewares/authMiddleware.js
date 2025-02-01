import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// Middleware unificado para Google Token
export const dynamicGoogleValidation = (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    validateGoogleTokenFromGet(req, res, next);
  } else if (req.body.googleToken) {
    validateGoogleToken(req, res, next);
  } else {
    res.status(401).json({ error: "Token no proporcionado" });
  }
};

export const validateGoogleToken = async (req, res, next) => {
  try {
    const { googleToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    req.user = { email: payload.email, name: payload.name}; // Añadir datos al request

    next();
  } catch (error) {
    res.status(401).json({ error: "Token de Google inválido" });
  }
};

export const validateGoogleTokenFromGet = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    
    const googleToken = authHeader.split(' ')[1];
    
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    req.user = { email: payload.email , name: payload.name};
    next();
  } catch (error) {
    res.status(401).json({ error: "Token de Google inválido" });
  }
};

export const jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: "NO_TOKEN",
        message: "Acceso no autorizado" 
      });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar en base de datos
    const user = await pool.query(
      `SELECT id_persona, rol FROM guayaba.Persona 
       WHERE id_persona = $1`,
      [decoded.userId]
    );

    if (user.rowCount === 0) {
      return res.status(401).json({
        error: "INVALID_USER",
        message: "Usuario no existe"
      });
    }

    // Adjuntar usuario al request
    req.user = {
      ...decoded,
      role: user.rows[0].rol // Incluir rol para autorizaciones
    };
    
    next();

  } catch (error) {
    console.error("Error en authMiddleware:", error);
    
    const errorType = error instanceof jwt.TokenExpiredError 
      ? "TOKEN_EXPIRED" 
      : "INVALID_TOKEN";

    res.status(401).json({
      error: errorType,
      message: error.message
    });
  };
};