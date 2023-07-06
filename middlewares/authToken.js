import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authToken = async (req, res, next) => {
  // el token viene en el header de la petición, lo tomamos:
  const token = req.header("Authorization");
  // Si no nos han proporcionado un token lanzamos un error
  if (!token) {
    return res.send("Token not found");
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET
    );
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.send("Invalid token");
  }
};

export default authToken;
