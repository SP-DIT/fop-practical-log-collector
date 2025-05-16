import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const oldPoolQuery = pool.query.bind(pool);

const newPoolQuery = async (query, params) => {
    console.log('Executing query:', query, 'with params:', params);
    const result = await oldPoolQuery(query, params);
    return result;
};

pool.query = newPoolQuery;

export default pool;
