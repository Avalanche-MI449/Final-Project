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

const SongSearch = ({ userId, onSongSaved }) => {
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
      onSongSaved?.(song);
    } catch (err) {
      setMessage("Failed to save song. Please try again.");
    }
  };

  return (
    <div className="text-left">
      <div className="flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center ">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full rounded-md border-2 border-[#cf68e8] bg-[#390e59] px-3 py-2 text-sm text-white placeholder-[#FFFFFF] outline-none focus:border-[#cfd6ff]"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-md border border-[#cf68e8] bg-[#cf68e8] px-4 py-2 text-sm font-semibold text-white transition hover:border-[#d2d8ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            message.includes("saved") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <ul className="mt-4 space-y-2 p-0">
        {results.map((song) => (
          <li
            key={song.trackId}
            className="flex items-center justify-between rounded-lg border border-[#2e3877] bg-[#1a235c] px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={song.artworkUrl100}
                alt={`${song.collectionName || song.trackName} album cover`}
                className="h-14 w-14 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {song.trackName} - {song.artistName}
                </p>
                <p className="truncate text-xs text-[#b8c1e0]">{song.collectionName}</p>
              </div>
            </div>
            <button
              onClick={() => handleSave(song)}
              disabled={savedSongs.includes(song.trackId)}
              className="shrink-0 rounded-md border border-[#d2d8ff] bg-[#262e61] px-3 py-2 text-xs font-semibold text-[#d2d8ff] transition hover:border-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savedSongs.includes(song.trackId) ? "Saved" : "Save"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongSearch;
