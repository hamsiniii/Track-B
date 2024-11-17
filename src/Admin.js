import React, { useState } from "react";
import "./Admin.css";

function Admin() {
  const [songData, setSongData] = useState({
    name: "",
    releasedate: "",
    coverart: "",
    genre: "",
  });
  const [albumData, setAlbumData] = useState({
    name: "",
    releasedate: "",
    coverart: "",
  });
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleInputChange = (event, setData, data) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleInsertSong = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/insert/song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(songData),
      });
      const result = await response.json();
      setFeedback(result.message);
      setSongData({ name: '', releasedate: '', coverart: '', genre: '' });
    } catch (error) {
      setFeedback('Error inserting song');
    }
  };
  
  const handleInsertAlbum = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/insert/album', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumData),
      });
      const result = await response.json();
      setFeedback(result.message);
      setAlbumData({ name: '', releasedate: '', coverart: '' });
    } catch (error) {
      setFeedback('Error inserting album');
    }
  };
  
  const handleExecuteQuery = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/execute-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      setFeedback(result.message || JSON.stringify(result.result));
    } catch (error) {
      setFeedback('Error executing query');
    }
  };
  
  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      {/* Song Insertion Form */}
      <div className="admin-section">
        <h3>Insert Song</h3>
        <input
          type="text"
          name="name"
          placeholder="Song Name"
          value={songData.name}
          onChange={(e) => handleInputChange(e, setSongData, songData)}
        />
        <input
          type="date"
          name="releasedate"
          placeholder="Release Date"
          value={songData.releasedate}
          onChange={(e) => handleInputChange(e, setSongData, songData)}
        />
        <input
          type="text"
          name="coverart"
          placeholder="Cover Art URL"
          value={songData.coverart}
          onChange={(e) => handleInputChange(e, setSongData, songData)}
        />
        <button onClick={handleInsertSong}>Insert Song</button>
      </div>

      {/* Album Insertion Form */}
      <div className="admin-section">
        <h3>Insert Album</h3>
        <input
          type="text"
          name="name"
          placeholder="Album Name"
          value={albumData.name}
          onChange={(e) => handleInputChange(e, setAlbumData, albumData)}
        />
        <input
          type="date"
          name="releasedate"
          placeholder="Release Date"
          value={albumData.releasedate}
          onChange={(e) => handleInputChange(e, setAlbumData, albumData)}
        />
        <input
          type="text"
          name="coverart"
          placeholder="Cover Art URL"
          value={albumData.coverart}
          onChange={(e) => handleInputChange(e, setAlbumData, albumData)}
        />
        <button onClick={handleInsertAlbum}>Insert Album</button>
      </div>

      {/* Query Text Box */}
      <div className="admin-section">
        <h3>Execute SQL Query</h3>
        <textarea
          placeholder="Enter SQL command here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleExecuteQuery}>Execute Query</button>
      </div>

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}

export default Admin;
