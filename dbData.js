// CORRER ESTO SOLO UNA VEZ, CON "node dbData.js" 

import { config } from 'dotenv';
import * as api from './api.js';

config();

api.initializeDB();

const query = `
BEGIN;

COMMIT;
`;

api.query(query);
