import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('DB connected');
  } catch (error) {
    console.error('DB connection error:', error);
  }
};

connectDB();
