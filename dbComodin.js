// CORRER ESTO SOLO UNA VEZ, CON "node dbSetup.js" 
import { config } from 'dotenv';
import * as api from './api.js';

config();

api.initializeDB();

const query = `
BEGIN;

TRUNCATE TABLE guayaba.Sede RESTART IDENTITY CASCADE;
COMMIT;

`;

const res = await api.query(query);
console.log(res);

//api.query(query);
