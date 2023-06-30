import { v4 } from "uuid";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateUniqueId() {
  return v4();
}

export function logRequestResponse(requestId, request) {
  const date = moment().format("YYYY-MM-DD");
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const logFilePath = path.join(__dirname, `logs/${date}.txt`);
  const logMessage = `Time: ${hours}:${minutes}:${seconds} Request ID: ${requestId} Log: ${JSON.stringify(
    request
  )}
  `;

  fs.access(logFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      // El archivo no existe, así que se crea uno nuevo
      fs.writeFile(logFilePath, logMessage, (error) => {
        if (error) {
          console.error("Error writing to log file:", error);
        }
      });
    } else {
      // El archivo ya existe, se agrega una nueva línea
      fs.appendFile(logFilePath, logMessage, (error) => {
        if (error) {
          console.error("Error appending to log file:", error);
        }
      });
    }
  });
}
