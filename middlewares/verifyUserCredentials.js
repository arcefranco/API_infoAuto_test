import bcrypt from "bcrypt";
import { pa7_comunConnection } from "../helpers/connection.js";
import { QueryTypes } from "sequelize";
import jwt from "jsonwebtoken";

// Middleware para verificar usuario y contraseña
const verifyUserCredentials = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No hay token" });
  }

  // Verificar y decodificar el token JWT
  jwt.verify(token, "clave-secreta", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token inválido o caducado" });
    }

    // Almacenar el identificador del usuario en el objeto de solicitud
    req.userId = decoded.userId;

    // El token es válido, se permite el acceso
    next();
  });
};

export default verifyUserCredentials;
