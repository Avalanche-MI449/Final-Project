import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://djsrjatigmxnoaxydepq.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const searchSongs = async (query) => {
  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=10`,
  );
  const data = await response.json();
  return data.results;
};

const saveSong = async (trackId, songName, userId) => {
  const { data: songData, error: songError } = await supabase
    .from("songs")
    .upsert(
      { song_id: trackId, name: songName },
      { onConflict: "song_id", ignoreDuplicates: false },
    )
    .select()
    .single();

  if (songError) {
    console.error("songs upsert error:", JSON.stringify(songError));
    throw songError;
  }

  const { error: linkError } = await supabase
    .from("user_songs")
    .insert([{ user: userId, song: songData.id }]);

  if (linkError) {
    console.error("user_songs insert error:", JSON.stringify(linkError));
    throw linkError;
  }
};

const SongSearch = ({ userId }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedSongs, setSavedSongs] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const songs = await searchSongs(query);
      setResults(songs);
    } catch (err) {
      setMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (song) => {
    if (!userId) {
      setMessage("Please log in before saving songs.");
      return;
    }
    try {
      await saveSong(song.trackId, song.trackName, userId);
      setSavedSongs((prev) => [...prev, song.trackId]);
      setMessage(`"${song.trackName}" saved to your playlist!`);
    } catch (err) {
      setMessage("Failed to save song. Please try again.");
    }
  };

  return (
    <div>
      <h2>Song Search</h2>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && (
        <p style={{ color: message.includes("saved") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((song) => (
          <li
            key={song.trackId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{song.trackName}</strong> — {song.artistName}
              <br />
              <small>{song.collectionName}</small>
            </div>
            <button
              onClick={() => handleSave(song)}
              disabled={savedSongs.includes(song.trackId)}
            >
              {savedSongs.includes(song.trackName) ? "Saved" : "Save"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongSearch;
