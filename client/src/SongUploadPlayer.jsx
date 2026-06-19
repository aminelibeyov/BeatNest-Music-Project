// SongUploadPlayer.jsx - Complete frontend component!
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MINIMAL_API_URL = 'http://localhost:5001/api';

const SongUploadPlayer = () => {
  // State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  // 1. Load songs on component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // 2. Function to fetch all songs from backend
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${MINIMAL_API_URL}/songs`);
      setSongs(response.data.data);
    } catch (err) {
      console.error('❌ Error fetching songs:', err);
    }
  };

  // 3. Function to handle form submission (upload!)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select an audio file to upload');
      return;
    }

    setIsUploading(true);

    // Create FormData object to send file + data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('audioFile', file); // this is our audio file!

    try {
      // Send POST request
      await axios.post(`${MINIMAL_API_URL}/songs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Song uploaded successfully!');
      // Reset form
      setTitle('');
      setArtist('');
      setFile(null);
      // Refresh song list
      fetchSongs();

    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Failed to upload song');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          🎵 Music Upload & Player
        </h1>

        {/* 1. Upload Form Section */}
        <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Upload New Song</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Song Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-green-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter song title..."
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Artist</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-green-500 outline-none"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Audio File</label>
              <input
                type="file"
                accept="audio/*"
                className="w-full p-2 rounded-lg bg-slate-700 border border-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500 cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              {file && <p className="mt-2 text-sm text-green-400">Selected: {file.name}</p>}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-3 rounded-lg font-bold transition ${
                isUploading
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500'
              }`}
            >
              {isUploading ? '⏳ Uploading...' : '🚀 Upload Song'}
            </button>
          </form>
        </div>

        {/* 2. Song Library & Player Section */}
        <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Your Music Library</h2>

          {/* Song List */}
          <div className="grid gap-3 mb-6">
            {songs.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No songs uploaded yet! Upload your first track above.</p>
            ) : (
              songs.map((song) => (
                <div
                  key={song._id}
                  onClick={() => setCurrentSong(song)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    currentSong?._id === song._id
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-slate-700 bg-slate-700/30 hover:border-green-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{song.title}</h3>
                      <p className="text-slate-400 text-sm">{song.artist}</p>
                    </div>
                    {currentSong?._id === song._id && <span className="text-green-400">🔊 Playing</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Audio Player */}
          {currentSong && (
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-center font-semibold text-xl mb-4">
                Now Playing: <span className="text-green-400">{currentSong.title}</span> by <span className="text-blue-400">{currentSong.artist}</span>
              </h3>
              <audio
                controls
                autoPlay
                className="w-full"
                src={`http://localhost:5001${currentSong.fileUrl}`}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongUploadPlayer;