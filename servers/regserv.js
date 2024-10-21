const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto'); // Import the crypto module

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'badmin', // replace with your MySQL username
  password: 'securepassword', // replace with your MySQL password
  database: 'trackb' // replace with your database name
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Function to hash a password
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256'); // You can also use 'sha512'
  hash.update(password);
  return hash.digest('hex');
};

// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, password, email, role } = req.body;
  
  // Hash the password before storing it
  const hashedPassword = hashPassword(password);
  
  const sql = 'INSERT INTO user (name, password, email, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, hashedPassword, email, role], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Hash the input password for comparison
  const hashedInputPassword = hashPassword(password);

  // Query the database for a user with the provided email
  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error connecting to the database' });
    }

    if (results.length > 0) {
      // User found, check the hashed password
      const user = results[0];
      if (user.password === hashedInputPassword) {
        // Password matches
        res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
      } else {
        // Password does not match
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // No user found
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
