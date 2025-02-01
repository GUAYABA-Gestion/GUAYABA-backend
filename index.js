import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from "./routes/index.js"

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Desarrollo local
    'https://guayaba-frontend.vercel.app/' // Producción
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => res.send(`
  <h1>Guayaba Backend</h1>
  <p><a href="/api/ping">Ping database</a></p>
`));

app.use("/api", routes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
