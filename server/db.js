import { config } from 'dotenv';
import pg from 'pg';
import { PrismaClient } from '@prisma/client';

config();

// Construir DATABASE_URL dinámicamente si no está definida
if (!process.env.DATABASE_URL && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_DB) {
    // Variables intermedias para mayor claridad
    const user = process.env.POSTGRES_USER;
    const password = process.env.POSTGRES_PASSWORD;
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;
    const db = process.env.POSTGRES_DB;
    process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:${port}/${db}`;
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Manejo global de errores del pool para evitar que el backend se caiga si la DB falla
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL:', err);
    // No terminar el proceso, solo loguear
});

export { pool };
export const prisma = new PrismaClient();
