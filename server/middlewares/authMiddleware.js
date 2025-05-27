import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

export const jwtAuth = async (req, res, next) => {
  return res.status(501).json({
    error: "NOT_IMPLEMENTED",
    message: "Este middleware está obsoleto. Usa sessionMiddleware en su lugar."
  });
};

// Middleware para verificar JWT de la cookie de sesión y adjuntar el usuario
export const sessionMiddleware = async (req, res, next) => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        error: "NO_TOKEN",
        message: "Acceso no autorizado. Token no proporcionado."
      });
    }
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar usuario en la base de datos
    const dbUser = await prisma.persona.findUnique({
      where: { id_persona: decoded.id },
    });
    if (!dbUser) {
      return res.status(401).json({
        error: "INVALID_USER",
        message: "Usuario no existe en la base de datos."
      });
    }
    // Adjuntar usuario completo al request
    req.user = dbUser;
    next();
  } catch (error) {
    console.error("Error en jwtAuth middleware:", error);
    let errorType = "INVALID_TOKEN";
    let errorMessage = "Token inválido.";
    if (error instanceof jwt.TokenExpiredError) {
      errorType = "TOKEN_EXPIRED";
      errorMessage = "El token ha expirado. Por favor, inicie sesión nuevamente.";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorType = "MALFORMED_TOKEN";
      errorMessage = "Token malformado.";
    }
    return res.status(401).json({
      error: errorType,
      message: errorMessage
    });
  }
};

// Middleware para control de acceso por rol
export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({
      error: "FORBIDDEN",
      message: "No tienes permisos para acceder a este recurso."
    });
  }
  next();
};