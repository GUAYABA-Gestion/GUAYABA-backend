import passport from "passport";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

// Helper to create and set the session JWT cookie with only user id
function setSessionJwt(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// Endpoint para iniciar login con Google
export const loginWithGoogle = [
	passport.authenticate("google", { scope: ["profile", "email"] }),
];

// Callback de Google
export const googleCallback = [
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/auth/google/failure",
	}),
	async (req, res) => {
        console.log("Callback de Google recibido", req.user);
		const user = req.user;
		const email = user.emails[0].value;
		try {
			// Buscar usuario en la base de datos
			const dbUser = await prisma.persona.findUnique({
				where: { correo: email },
			});
			if (!dbUser) {
				// Usuario NO existe: crear JWT temporal y redirigir a registro
				const tempPayload = {
					email,
					name: user.displayName,
					googleId: user.id,
					// Puedes agregar más info del perfil de Google si la necesitas
				};
				const tempToken = jwt.sign(tempPayload, process.env.JWT_SECRET, {
					expiresIn: "15m",
				});
				res.cookie("temp_reg", tempToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					maxAge: 15 * 60 * 1000,
				});
				return res.redirect("http://localhost:3000/registro");
			}
			// Usuario SÍ existe: crear JWT de sesión SOLO con id
			setSessionJwt(res, dbUser.id_persona);
			res.redirect("http://localhost:3000/");
		} catch (error) {
			console.error("Error en callback de Google:", error);
			res.clearCookie("token");
			res.clearCookie("temp_reg");
			res.redirect("http://localhost:3000/login?error=server");
		}
	},
];

// Endpoint para logout
export const logout = (req, res) => {
	res.clearCookie("token");
	res.clearCookie("temp_reg");
	res.redirect("http://localhost:3000/login");
};

// Registro de usuario desde el flujo de Google (valida JWT temporal y completa registro)
export const registerUser = async (req, res) => {
  try {
    // El JWT temporal debe venir en la cookie 'temp_reg'
    const tempToken = req.cookies.temp_reg;
    if (!tempToken) {
      return res.status(401).json({ error: "Token de registro no encontrado o expirado." });
    }
    let tempPayload;
    try {
      tempPayload = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Token de registro inválido o expirado." });
    }
    // Recibe info adicional del frontend (por ejemplo, id_sede, rol, acepta_politicas, etc.)
    const { id_sede, rol, telefono, detalles, acepta_politicas } = req.body;
    if (!acepta_politicas) {
      return res.status(400).json({ error: "Debes aceptar las políticas para registrarte." });
    }
    // Crear usuario en la base de datos
    const newUser = await prisma.persona.create({
      data: {
        correo: tempPayload.email,
        nombre: tempPayload.name,
        id_sede,
        rol,
        telefono,
        detalles,
        es_manual: false,
      },
    });
    // Crear JWT de sesión SOLO con id y setear cookie
    setSessionJwt(res, newUser.id_persona);
    res.clearCookie("temp_reg");
    res.status(201).end(); // No enviar info extra, solo status
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};
