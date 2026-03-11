import React, { useState, useEffect } from "react";

export default function MusicPreviewWidget({ artistName }) {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artistName) return;

    const searchSong = async () => {
      setLoading(true);
      setTrack(null);

      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=1`
        );

        const data = await response.json();

        if (data.results.length > 0) {
          setTrack(data.results[0]);
        } else {
          setTrack(null);
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }

      setLoading(false);
    };

    searchSong();
  }, [artistName]);

  return (
    <div className="music-widget">
      <h2>Music Preview</h2>

      {loading && <p>Loading...</p>}

      {track && (
        <div className="song-preview">
          <img src={track.artworkUrl100} alt="album cover" />
          <h4>{track.trackName}</h4>
          <p>{track.artistName}</p>

          <audio controls src={track.previewUrl}>
            Your browser does not support audio.
          </audio>
        </div>
      )}
    </div>
  );
}