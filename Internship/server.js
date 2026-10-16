const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allows your HTML frontend to connect to the backend

// Secret key used to encrypt the token signature (Keep this private!)
const JWT_SECRET = 'your_super_secure_secret_key_123';

// Mock database (In production, connect this to MongoDB, PostgreSQL, etc.)
const users = [];

// 1. SIGN UP ROUTE
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation check
        if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
        if (users.find(u => u.username === username)) return res.status(400).json({ error: 'User already exists' });

        // Securely hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully! Proceed to Sign In.' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. SIGN IN ROUTE
app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT Token valid for 2 hours
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(5000, () => console.log('Authentication Server running on port 5000'));
