import { config } from 'dotenv'
import { Pool, PoolClient } from 'pg'

// Load env variables
config()
const pool = new Pool({
    connectionString: process.env.PGURI
});
let client: PoolClient;

beforeAll(async () => {
    client = await pool.connect();
    const colInfo = await client.query('SHOW COLUMNS FROM \"topos; SHOW COLUMN FROM images\"');
    console.log('Column information:');
    console.log(colInfo.rows);
});

afterAll(() => {
    client.release();
    pool.end()
})

test('Printing stuff', () => {
    console.log('Within db.test.ts!');
    console.log('PGUSER = ', process.env.PGUSER)
})
