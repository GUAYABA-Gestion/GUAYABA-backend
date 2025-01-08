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
const port = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.get('/ping', api.ping);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
