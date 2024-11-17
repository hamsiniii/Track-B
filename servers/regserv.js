const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const dbAdmin = mysql.createConnection({
  host: 'localhost',
  user: 'admin', 
  password: 'your_password_here', 
  database: 'trackb'
});

const dbUser = mysql.createConnection({
  host: 'localhost',
  user: 'badmin', 
  password: 'securepassword',
  database: 'trackb'
});

let db=dbUser; 

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Hash password
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256'); 
  hash.update(password);
  return hash.digest('hex');
};

// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, password, email, role } = req.body;
  
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

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedInputPassword = hashPassword(password);

  const query = 'SELECT * FROM user WHERE email = ?';
  dbUser.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error connecting to the database' });
    }

    if (results.length > 0) {
      const user = results[0];
      if (user.password === hashedInputPassword) {
        db = user.role === 'admin' ? dbAdmin : dbUser;

        res.json({
          message: 'Login successful',
          user: {
            id: user.userid,
            name: user.name,
            email: user.email,
            role: user.role 
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});
app.get('/reviews/user/:userid', async (req, res) => {
  const userId = req.params.userid;
  const query = `
    SELECT 
      r.reviewid,
      r.comment,
      r.rating,
      r.date,
      s.name AS songName,
      a.name AS albumName
    FROM review r
    LEFT JOIN song s ON r.songid = s.songid
    LEFT JOIN album a ON r.albumid = a.albumid
    WHERE r.userid = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ message: "Error fetching reviews" });
    }
    
    res.json({ reviews: results });
  });
});

app.get('/search', (req, res) => {
  const { query } = req.query;

  const sql = `
    SELECT 'song' as type, songid as id, name, releasedate as date, coverart 
    FROM song WHERE name LIKE ? 
    UNION 
    SELECT 'album' as type, albumid as id, name, releasedate as date, coverart 
    FROM album WHERE name LIKE ?
    UNION 
    SELECT 'artist' as type, artistid as id, CONCAT(fname, ' ', lname) as name, dob as date, NULL as coverart 
    FROM artist WHERE fname LIKE ? OR lname LIKE ?`;

  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log('Search Results:', results);
    res.json(results);
  });
});

// Fetch artist image
app.get('/artist/image/:id', (req, res) => {
  const artistId = req.params.id;

  const sql = 'SELECT image FROM artist WHERE artistid = ?';
  db.query(sql, [artistId], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      const image = results[0].image;
      res.json({ image: image.toString('base64') }); 
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  });
});
app.get('/details/album/:id', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetAlbumDetails(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching album details:', err);
      return res.status(500).json({ message: 'Error fetching album details' });
    }
    
    res.json(results[0][0]); 
  });
});

// Fetch songs by album ID
app.get('/details/album/:id/songs', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetSongsByAlbumId(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching songs:', err);
      return res.status(500).json({ message: 'Error fetching songs' });
    }
    
    res.json(results[0]); 
  });
});

app.get('/details/song/:id', (req, res) => {
  const { id } = req.params;

  db.query('CALL GetSongDetails(?)', [id], (err, results) => {
    if (err) {
      console.error('Error fetching song details:', err);
      return res.status(500).json({ message: 'Error fetching song details' });
    }
    
    res.json(results[0][0]); 
  });
});

app.get('/reviews/:type/:id', (req, res) => {
  const { type, id } = req.params;

  const sql = `
      SELECT 
        r.reviewid AS reviewid,
        r.comment AS review,
        r.rating,
        r.date,
        u.userid AS userid,
        u.name AS username,
        u.role AS user_role 
      FROM review r 
      JOIN user u ON r.userid = u.userid 
      WHERE ${type}id = ?`;

  db.query(sql, [id], (err, results) => {
      if (err) {
          console.error('Error fetching reviews:', err);
          return res.status(500).json({ message: 'Database error' });
      }
      
      console.log('Reviews fetched:', results); 
      const reviews = results.map(row => ({
          reviewid:row.reviewid,
          review: row.review,
          rating: row.rating,
          date: row.date,
          userid: row.userid,
          username: row.username,
          user_role: row.user_role
      }));

      res.json(reviews);
  });
});

app.delete('/reviews/:reviewId', (req, res) => {
  const reviewId = req.params.reviewId;

  const query = 'DELETE FROM review WHERE reviewid = ?';

  db.query(query, [reviewId], (error, results) => {
      if (error) {
          console.error('Error deleting review:', error);
          return res.status(500).json({ message: 'Error deleting review.' });
      }
      
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Review not found.' });
      }

      return res.status(200).json({ message: 'Review deleted successfully.' });
  });
});

app.post('/reviews', (req, res) => {
  const { type, id, review, rating, userid } = req.body;

  console.log('Received review data:', { type, id, review, rating, userid }); 

  if (!rating || !userid) {
      console.error('Missing rating or user ID'); 
      return res.status(400).json({ message: 'Rating and user login are required' });
  }

  const albumid = type === 'album' ? id : null;
  const songid = type === 'song' ? id : null;
  const date = new Date().toISOString().split('T')[0];

  const sql = `INSERT INTO review (rating, comment, date, songid, albumid, userid) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [rating, review, date, songid, albumid, userid], (err, result) => {
      if (err) {
          console.error('Error inserting review:', err); 
          return res.status(500).json({ message: 'Database error' });
      }
      console.log('Review submitted successfully:', result);
      res.status(201).json({ message: 'Review submitted successfully' });
  });
});
app.get('/artist/:id', (req, res) => {
  const artistId = req.params.id;

  // artist details
  db.query('SELECT fname, lname, dob, about, image FROM artist WHERE artistid = ?', [artistId], (err, artistResults) => {
    if (err) {
      console.error('Error fetching artist details:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (artistResults.length === 0) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // albums by artist
    db.query('SELECT album.albumid, name FROM album JOIN artistalbum ON album.albumid = artistalbum.albumid WHERE artistid = ?', [artistId], (err, albumResults) => {
      if (err) {
        console.error('Error fetching albums:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      // songs by artist
      db.query('SELECT song.songid, name FROM song JOIN artistsong ON song.songid = artistsong.songid WHERE artistid = ?', [artistId], (err, songResults) => {
        if (err) {
          console.error('Error fetching songs:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        // average rating of all songs and albums
        db.query(
          `SELECT AVG(rating) AS avgRating
           FROM review
           WHERE albumid IN (SELECT albumid FROM artistalbum WHERE artistid = ?) 
           OR songid IN (SELECT songid FROM artistsong WHERE artistid = ?)`,
          [artistId, artistId],
          (err, ratingResults) => {
            if (err) {
              console.error('Error fetching average rating:', err);
              return res.status(500).json({ message: 'Server error' });
            }

            const avgRating = ratingResults[0].avgRating || null;

            //reviews for artist's songs and albums
            db.query(
              `SELECT review.comment, review.rating, review.date, 
                      COALESCE(album.name, song.name) AS name,
                      COALESCE(album.albumid, song.songid) AS itemId,
                      IF(album.albumid IS NOT NULL, 'album', 'song') AS type
               FROM review
               LEFT JOIN album ON review.albumid = album.albumid
               LEFT JOIN song ON review.songid = song.songid
               WHERE review.albumid IN (SELECT albumid FROM artistalbum WHERE artistid = ?)
                  OR review.songid IN (SELECT songid FROM artistsong WHERE artistid = ?)`,
              [artistId, artistId],
              (err, reviewResults) => {
                if (err) {
                  console.error('Error fetching reviews:', err);
                  return res.status(500).json({ message: 'Server error' });
                }

                const artistData = {
                  ...artistResults[0],
                  image: artistResults[0].image ? artistResults[0].image.toString('base64') : null,
                  albums: albumResults || [],
                  songs: songResults || [],
                  avgRating,
                  reviews: reviewResults || []
                };

                res.json(artistData);
              }
            );
          }
        );
      });
    });
  });
});



app.get('/details/artist/:id', async (req, res) => {
  try {
      const artistId = req.params.id;
      const artistDetails = await db.query('SELECT * FROM artist WHERE artistid = ?', [artistId]);
      const albums = await db.query('SELECT * FROM album WHERE artistid = ?', [artistId]);
      res.json({ artist: artistDetails[0], albums });
  } catch (error) {
      console.error("Error fetching artist details:", error);
      res.status(500).send("Server error");
  }
});
// edit a review
app.put('/review/:id', (req, res) => {
  const reviewId = req.params.id;
  const { comment, rating } = req.body;

  const query = "UPDATE review SET comment = ?, rating = ? WHERE reviewid = ?";

  db.query(query, [comment, rating, reviewId], (err, results) => {
    if (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ message: "Error updating review" });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });
});
app.get('/topcharts', (req, res) => {
  const { category } = req.query;
  let sql = '';

  if (category === 'artists') {
    // average rating for artists
    sql = `
      SELECT 
        artist.artistid, 
        fname, 
        lname, 
        COALESCE(AVG(review.rating), 0) AS avg_rating
      FROM 
        artist
      LEFT JOIN 
        artistalbum ON artist.artistid = artistalbum.artistid
      LEFT JOIN 
        album ON artistalbum.albumid = album.albumid
      LEFT JOIN 
        review ON review.albumid = album.albumid OR review.songid IN (
          SELECT song.songid FROM song
          JOIN albumsong ON song.songid = albumsong.songid
          WHERE albumsong.albumid = album.albumid
        )
      GROUP BY 
        artist.artistid
      ORDER BY 
        avg_rating DESC
      LIMIT 10;
    `;
  } else if (category === 'albums') {
    sql = `
      SELECT album.albumid, name, coverart, COALESCE(AVG(rating), 0) AS avg_rating 
      FROM album 
      LEFT JOIN review ON album.albumid = review.albumid 
      GROUP BY album.albumid 
      ORDER BY avg_rating DESC 
      LIMIT 10;
    `;
  } else if (category === 'songs') {
    sql = `
      SELECT song.songid, name, coverart, COALESCE(AVG(rating), 0) AS avg_rating 
      FROM song 
      LEFT JOIN review ON song.songid = review.songid 
      GROUP BY song.songid 
      ORDER BY avg_rating DESC 
      LIMIT 10;
    `;
  }
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching top charts:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});


app.use('/admin', (req, res) => {
  // Admin 
  res.send('Admin page');
});

app.post('/api/admin/insert/song', (req, res) => {
  const { name, releasedate, coverart, genre } = req.body;

  const sql = 'INSERT INTO song (name, releasedate, coverart) VALUES (?, ?, ?)';
  dbAdmin.query(sql, [name, releasedate, coverart, genre], (err, result) => {
    if (err) {
      console.error('Error inserting song:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Song inserted successfully', songId: result.insertId });
  });
});
app.post('/api/admin/insert/album', (req, res) => {
  const { name, releasedate, coverart } = req.body;

  const sql = 'INSERT INTO album (name, releasedate, coverart) VALUES (?, ?, ?)';
  dbAdmin.query(sql, [name, releasedate, coverart], (err, result) => {
    if (err) {
      console.error('Error inserting album:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Album inserted successfully', albumId: result.insertId });
  });
});
app.post('/api/admin/execute-query', (req, res) => {
  const { query } = req.body;

  dbAdmin.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Error starting transaction', error: err.message });
    }

    dbAdmin.query(query, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);

        return dbAdmin.rollback(() => {
          res.status(500).json({ message: 'Error executing query', error: err.message });
        });
      }

      dbAdmin.commit((err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          return dbAdmin.rollback(() => {
            res.status(500).json({ message: 'Error committing transaction', error: err.message });
          });
        }

        res.json({ message: 'Query executed and committed successfully', result });
      });
    });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
