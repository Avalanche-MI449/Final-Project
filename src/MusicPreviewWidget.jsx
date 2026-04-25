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
    <div className="mx-auto w-full max-w-[300px] rounded-[10px] border border-[#ddd] p-5">
      <h2 className="mb-2 text-[1.6em] leading-tight text-white">Music Preview</h2>

      {loading && <p className="text-white">Loading...</p>}

      {track && (
        <div>
          <img src={track.artworkUrl100} alt="album cover" className="mx-auto w-[100px] rounded-lg" />
          <h4 className="mt-2 text-white">{track.trackName}</h4>
          <p className="text-white">{track.artistName}</p>

          <audio controls src={track.previewUrl}>
            Your browser does not support audio.
          </audio>
        </div>
      )}
    </div>
  );
}