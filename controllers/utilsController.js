import jwt from "jsonwebtoken";

export const generateTestJWT = () => {
  return jwt.sign(
    {
      userId: 9999,  // ID de prueba
      email: "testuser@guayaba.com",
      userName: "Test User",
      rol: "admin",
      id_sede: 1
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 1 día de duración
  );
};
