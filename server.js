require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors({ origin: 'https://omsaiclinic.online' }));
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

// Create students table
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL
            )
        `);
        console.log('Students table ready');
    } catch (err) {
        console.error('Table creation failed:', err.stack);
    }
})();

// GET all students
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        console.log('Fetched students:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('GET error:', err.stack);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// POST a student
app.post('/api/students', async (req, res) => {
    const { name, email } = req.body;
    console.log('POST received:', { name, email });
    if (!name || !email) {
        console.error('Invalid input:', { name, email });
        return res.status(400).json({ error: 'Name and email are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        console.log('Inserted:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('POST error:', err.stack);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));