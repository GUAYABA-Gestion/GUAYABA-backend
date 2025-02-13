import jwt from "jsonwebtoken";

export const generateTestJWT = () => {
  return jwt.sign(
    {
      userId: 1,  // ID de prueba
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 1 día de duración
  );
};
