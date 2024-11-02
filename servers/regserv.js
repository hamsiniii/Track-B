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
  const hashedInputPassword = hashPassword(password); // Use your existing hash function

  // Query the database for a user with the provided email
  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error connecting to the database' });
    }

    if (results.length > 0) {
      // User found, check the hashed password
      const user = results[0];

      // Compare the hashed input password with the stored password
      if (user.password === hashedInputPassword) {
        // Password matches
        res.json({ 
          message: 'Login successful', 
          user: { 
            id: user.userid,  // Include user ID
            name: user.name, 
            email: user.email 
          } 
        });
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

// Search endpoint
app.get('/search', (req, res) => {
  const { query } = req.query;

  // SQL query to search for songs, albums, and artists
  const sql = `
    SELECT 'song' as type, songid as id, name, releasedate as date, coverart 
    FROM song WHERE name LIKE ? 
    UNION 
    SELECT 'album' as type, albumid as id, name, releasedate as date, coverart 
    FROM album WHERE name LIKE ?
    UNION 
    SELECT 'artist' as type, CONCAT(fname, ' ', lname) as name, artistid as id, dob as date, NULL as coverart 
    FROM artist WHERE fname LIKE ? OR lname LIKE ?`;

  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`,`%${query}%`], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log('Search Results:', results);
    res.json(results); // Return the search results
  });
});
app.get('/details/album/:id', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetAlbumDetails(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching album details:', err);
      return res.status(500).json({ message: 'Error fetching album details' });
    }
    
    // Return the album details
    res.json(results[0][0]); 
  });
});

// New endpoint to fetch songs by album ID
app.get('/details/album/:id/songs', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetSongsByAlbumId(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching songs:', err);
      return res.status(500).json({ message: 'Error fetching songs' });
    }
    
    // Return the list of songs
    res.json(results[0]); // Assuming the songs are in the first result set
  });
});

app.get('/details/song/:id', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetSongDetails(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching song details:', err);
      return res.status(500).json({ message: 'Error fetching song details' });
    }
    
    res.json(results[0][0]); // Return the song details
  });
});

app.get('/reviews/:type/:id', (req, res) => {
  const { type, id } = req.params;

  const sql = `
      SELECT 
        r.comment AS review,
        r.rating,
        r.date,
        u.name AS username 
      FROM review r 
      JOIN user u ON r.userid = u.userid 
      WHERE ${type}id = ?`;

  db.query(sql, [id], (err, results) => {
      if (err) {
          console.error('Error fetching reviews:', err);
          return res.status(500).json({ message: 'Database error' });
      }
      
      console.log('Reviews fetched:', results); // Log the results
      const reviews = results.map(row => ({
          review: row.review,
          rating: row.rating,
          date: row.date,
          username: row.username,
      }));

      res.json(reviews);
  });
});


app.post('/reviews', (req, res) => {
  const { type, id, review, rating, userid } = req.body;

  console.log('Received review data:', { type, id, review, rating, userid }); // Log incoming review data

  // Ensure that `rating` and `userid` are provided
  if (!rating || !userid) {
      console.error('Missing rating or user ID'); // Log missing data
      return res.status(400).json({ message: 'Rating and user login are required' });
  }

  const albumid = type === 'album' ? id : null;
  const songid = type === 'song' ? id : null;
  const date = new Date().toISOString().split('T')[0];

  const sql = `INSERT INTO review (rating, comment, date, songid, albumid, userid) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [rating, review, date, songid, albumid, userid], (err, result) => {
      if (err) {
          console.error('Error inserting review:', err); // Log database errors
          return res.status(500).json({ message: 'Database error' });
      }
      console.log('Review submitted successfully:', result); // Log success
      res.status(201).json({ message: 'Review submitted successfully' });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
