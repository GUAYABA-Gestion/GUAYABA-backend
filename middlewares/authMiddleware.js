import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden' });
};

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
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1];

    // Si no hay token, devolver error
    if (!token) {
      return res.status(401).json({ 
        error: "NO_TOKEN",
        message: "Acceso no autorizado. Token no proporcionado." 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si el usuario existe en la base de datos
    const user = await pool.query(
      `SELECT id_persona,correo, nombre rol FROM guayaba.Persona 
       WHERE id_persona = $1`,
      [decoded.id_persona]
    );

    // Si el usuario no existe, devolver error
    if (user.rowCount === 0) {
      return res.status(401).json({
        error: "INVALID_USER",
        message: "Usuario no existe en la base de datos."
      });
    }

    // Adjuntar el usuario al request para uso posterior
    req.user = {
      ...decoded,
      role: user.rows[0].rol // Incluir el rol del usuario
    };

    // Continuar con el siguiente middleware o ruta
    next();

  } catch (error) {
    console.error("Error en jwtAuth middleware:", error);

    // Manejar errores específicos de JWT
    let errorType = "INVALID_TOKEN";
    let errorMessage = "Token inválido.";

    if (error instanceof jwt.TokenExpiredError) {
      errorType = "TOKEN_EXPIRED";
      errorMessage = "El token ha expirado. Por favor, inicie sesión nuevamente.";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorType = "MALFORMED_TOKEN";
      errorMessage = "Token malformado.";
    }

    // Devolver el error al cliente
    return res.status(401).json({
      error: errorType,
      message: errorMessage
    });
  }
};