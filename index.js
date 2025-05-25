import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from "./server/routes.js"

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000', // Desarrollo
    'https://guayaba-frontend.vercel.app' // Producción 
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.use("/api", routes);

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Guayaba Backend API',
    version: '1.0.0',
    description: 'Documentación de la API de Guayaba',
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Servidor local' },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Puedes documentar tus rutas con JSDoc
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
