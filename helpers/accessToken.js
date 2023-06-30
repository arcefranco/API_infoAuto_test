import { pa7_comunConnection } from "./connection.js";
import { QueryTypes } from "sequelize";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const regenerarToken = async () => {
  try {
    const authResponse = await axios.post(
      "https://demo.api.infoauto.com.ar/cars/auth/login",
      {},
      {
        auth: {
          username: process.env.USERNAME_API,
          password: process.env.PASSWORD_API,
        },
      }
    );
    const fechaActual = new Date();
    const fecha55MinAdelante = new Date(fechaActual.getTime() + 55 * 60000);
    const fecha24HorasDespues = new Date(
      fechaActual.getTime() + 24 * 60 * 60000
    );

    await pa7_comunConnection.query(
      "INSERT INTO infoauto_tokens (token, token_vencimiento, refresh, refresh_vencimiento) VALUES (?,?,?,?)",
      {
        replacements: [
          authResponse.data.access_token,
          fecha55MinAdelante,
          authResponse.data.refresh_token,
          fecha24HorasDespues,
        ],
        type: QueryTypes.INSERT,
      }
    );

    return authResponse.data.access_token;
  } catch (error) {
    return error;
  }
};

export const accessToken = async () => {
  try {
    const response = await pa7_comunConnection.query(
      "SELECT * FROM infoauto_tokens ORDER BY id DESC LIMIT 1",
      {
        type: QueryTypes.SELECT,
      }
    );

    if (response[0].length === 0) {
      try {
        return regenerarToken();
      } catch (error) {
        return error;
      }
    } else {
      const fechaActual = new Date();
      const fechaToken = new Date(response[0].token_vencimiento);
      const fechaRefresh = new Date(response[0].refresh_vencimiento);
      const fecha55MinAdelante = new Date(fechaActual.getTime() + 55 * 60000);
      fechaActual.setUTCHours(fechaActual.getUTCHours() - 3);
      fechaActual.setUTCMinutes(fechaActual.getUTCMinutes());
      fechaActual.setUTCSeconds(fechaActual.getUTCSeconds());

      if (fechaActual > fechaToken && fechaActual > fechaRefresh) {
        return regenerarToken();
      }

      if (fechaActual > fechaToken && fechaActual < fechaRefresh) {
        const refreshResponse = await axios.post(
          "https://demo.api.infoauto.com.ar/cars/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${response[0].refresh}` },
          }
        );

        await pa7_comunConnection.query(
          "INSERT INTO infoauto_tokens (token, token_vencimiento, refresh, refresh_vencimiento) VALUES (?,?,?,?)",
          {
            replacements: [
              refreshResponse.data.access_token,
              fecha55MinAdelante,
              response[0].refresh,
              new Date(response[0].refresh_vencimiento).toISOString(),
            ],
            type: QueryTypes.INSERT,
          }
        );
        return refreshResponse.data.access_token;
      }

      if (fechaActual < fechaToken) {
        return response[0].token;
      }
    }
  } catch (error) {
    return error;
  }
};
