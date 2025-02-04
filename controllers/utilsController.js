import jwt from "jsonwebtoken";

export const generateTestJWT = () => {
  return jwt.sign(
    {
      userId: 1,  // ID de prueba
      email: "guayabagestion@gmail.com",
      userName: "Guayaba Test Admin",
      rol: "admin",
      id_sede: 1
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 1 día de duración
  );
};
