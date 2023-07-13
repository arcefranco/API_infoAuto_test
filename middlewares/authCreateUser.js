import dotenv from "dotenv";
import { pa7_comunConnection } from "../helpers/connection.js";
import bcrypt from "bcrypt";
import { QueryTypes } from "sequelize";
import jwt from "jsonwebtoken";
dotenv.config();

export const authCreateUser = async (req, res, next) => {
  console.log(req.body);
  const token = req.session.token;
  let decoded;
  if (!token) {
    return res.send("No hay token");
  }

  try {
    decoded = jwt.verify(token, "clave-secreta");
    const nombreAuth = decoded.nombre;
    const contraseñaAuth = decoded.contraseña;
    if (nombreAuth !== "sistemas@giama.com.ar") {
      return res.send(
        "Usuario o contraseña no válidos para realizar esta acción"
      );
    }

    const userFinded = await pa7_comunConnection.query(
      "SELECT * FROM usuarios_api_savi WHERE nombre = ?",
      {
        replacements: [nombreAuth],
        type: QueryTypes.SELECT,
      }
    );

    if (!userFinded.length) {
      return res.send("El usuario no existe");
    } else {
      bcrypt.compare(
        contraseñaAuth,
        userFinded[0].contraseña,
        function (err, result) {
          if (result === true) {
            next();
          } else {
            return res.send(err);
          }
        }
      );
    }
  } catch (error) {
    return res.send("Token inválido");
  }
};

export default authCreateUser;
