const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // seu usuário PostgreSQL
    host: 'localhost',
    database: 'controle_gastos',
    password: 'diogo9121',     // sua senha do PostgreSQL
    port: 5432,                // porta padrão
});

module.exports = pool;
