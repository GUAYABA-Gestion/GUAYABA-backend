import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import * as api from './api.js';

config();
api.initializeDB();

// Crear una nueva aplicación Express
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json()); // Middleware para parsear JSON

// Definir un puerto para nuestro servidor
const port = process.env.PORT || 4000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.get('/ping', api.ping);

app.get('/api/sedes', api.getSedes);
app.get('/api/edificios', api.getEdificios);
app.post("/api/check-user", api.checkUser);
app.post("/api/register", api.registerUser);
app.get("/api/personas", api.getPersonas);
app.get("/api/account", api.getAccountInfo);
app.get("/api/audit", api.getAuditoria);
app.delete("/api/delete-account", api.deleteAccount);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
