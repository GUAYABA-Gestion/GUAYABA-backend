// CORRER ESTO SOLO UNA VEZ, CON "node dbDelete.js" 

import { config } from 'dotenv';
import * as api from './api.js';

config();

api.initializeDB();

const query = `
DROP SCHEMA guayaba CASCADE;
`;

api.query(query);
