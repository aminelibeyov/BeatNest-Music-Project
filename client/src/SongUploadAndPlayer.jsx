// SongUploadAndPlayer.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SongUploadAndPlayer = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  // Fetch songs on load
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/songs`);
      setSongs(response.data.data);
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('audioFile', file);

    try {
      await axios.post(`${API_BASE_URL}/songs`, formData);
      setTitle('');
      setArtist('');
      setFile(null);
      fetchSongs();
      alert('Song uploaded successfully!');
    } catch (err) {
      console.error('Error uploading song:', err);
      alert('Failed to upload song');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
      <h1>🎵 Music Streaming App</h1>

      {/* Upload Form */}
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <h2>Upload Song</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: 10 }}
          />
          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            style={{ padding: 10 }}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit" style={{ padding: 10, background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Upload Song
          </button>
        </form>
      </div>

      {/* Song List and Player */}
      <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20 }}>
        <h2>Songs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {songs.map(song => (
            <div
              key={song._id}
              style={{
                padding: 10,
                border: '1px solid #eee',
                borderRadius: 4,
                cursor: 'pointer',
                background: currentSong?._id === song._id ? '#e3f2fd' : 'white'
              }}
              onClick={() => setCurrentSong(song)}
            >
              <strong>{song.title}</strong> - {song.artist}
            </div>
          ))}
        </div>

        {/* Audio Player */}
        {currentSong && (
          <div style={{ textAlign: 'center' }}>
            <h3>Now Playing: {currentSong.title}</h3>
            <p>Artist: {currentSong.artist}</p>
            <audio controls style={{ width: '100%' }}>
              <source src={`http://localhost:5000${currentSong.fileUrl}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongUploadAndPlayer;