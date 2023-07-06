import dotenv from "dotenv";
import { pa7_comunConnection } from "../helpers/connection.js";
import bcrypt from "bcrypt";
import { QueryTypes } from "sequelize";
import auth from "basic-auth";
dotenv.config();

export const authCreateUser = async (req, res, next) => {
  const credentials = auth(req);
  if (credentials.name !== "sistemas@giama.com.ar") {
    return res.send(
      "Usuario o contraseña no válidos para realizar esta acción"
    );
  }
  const userFinded = await pa7_comunConnection.query(
    "SELECT * FROM usuarios_api_savi WHERE nombre = ?",
    {
      replacements: [credentials.name],
      type: QueryTypes.SELECT,
    }
  );

  if (!userFinded.length) {
    return res.send("El usuario no existe");
  } else {
    bcrypt.compare(
      credentials.pass,
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
};

export default authCreateUser;
