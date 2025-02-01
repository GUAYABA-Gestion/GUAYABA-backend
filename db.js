import { config } from 'dotenv';
import pg from 'pg';

config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export { pool }; 
