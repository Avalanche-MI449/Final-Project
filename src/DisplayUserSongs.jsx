import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://djsrjatigmxnoaxydepq.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const findUserSongs = async (userId) => {
    const { data, error } = await supabase
        .from("user_songs")
        .select("song")
        .eq("user", userId);

    if (error) {
        throw error;
    }

    return data || [];
};

const findSongsByIds = async (songIds) => {
    if (!songIds.length) {
        return [];
    }

    const { data, error } = await supabase
        .from("songs")
        .select("id, song_id, name")
        .in("id", songIds);

    if (error) {
        throw error;
    }

    return data || [];
};

const fetchTrackDetails = async (trackId) => {
    const response = await fetch(
        `https://itunes.apple.com/lookup?id=${encodeURIComponent(trackId)}&entity=song`,
    );

    if (!response.ok) {
        throw new Error("Failed to fetch iTunes track details");
    }

    const data = await response.json();
    return data?.results?.[0] || null;
};

const DisplayUserSongs = ({ userId, refreshKey = 0 }) => {
    const [userSongs, setUserSongs] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserSongs = async () => {
            if (!userId) {
                setUserSongs([]);
                return;
            }

            try {
                const links = await findUserSongs(userId);
                setUserSongs(links);
            } catch (err) {
                console.error("Error fetching user songs:", err);
                setUserSongs([]);
                setError("Could not load saved songs right now.");
            }
        };

        fetchUserSongs();
    }, [userId, refreshKey]);

    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!userSongs.length) {
                setSongs([]);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const songIds = userSongs.map((item) => item.song).filter(Boolean);
                const storedSongs = await findSongsByIds(songIds);

                const details = await Promise.all(
                    storedSongs.map(async (song) => {
                        try {
                            const trackInfo = await fetchTrackDetails(song.song_id);
                            return {
                                trackId: song.song_id,
                                trackName: trackInfo?.trackName || song.name,
                                artistName: trackInfo?.artistName || "Unknown artist",
                                artworkUrl100: trackInfo?.artworkUrl100 || "",
                            };
                        } catch {
                            return {
                                trackId: song.song_id,
                                trackName: song.name,
                                artistName: "Unknown artist",
                                artworkUrl100: "",
                            };
                        }
                    }),
                );

                setSongs(details);
            } catch (err) {
                console.error("Error fetching saved song details:", err);
                setSongs([]);
                setError("Could not load saved songs right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetails();
    }, [userSongs]);

    if (!userId) {
        return <p className="text-[#FFFFFF]">Please log in to see your saved songs.</p>;
    }
    if (loading) {
        return <p className="text-[#FFFFFF]">Loading your saved songs...</p>;
    }
    if (error) {
        return <p className="text-red-300">{error}</p>;
    }
    if (userSongs === null || userSongs.length === 0) {
        return <p className="text-[#FFFFFF]">You have no saved songs. Search for songs and save them to see them here!</p>;
    }

    return (
        <div>
        <ul className="mt-4 space-y-2 p-0">
            {songs.map((song) => (
                <li
                    key={song.trackId}
                    className="flex items-center justify-between rounded-lg border border-[#2e3877] bg-[#1a235c] px-3 py-2"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        {song.artworkUrl100 ? (
                            <img
                                src={song.artworkUrl100}
                                alt={`${song.trackName} album cover`}
                                className="h-14 w-14 rounded-md object-cover"
                            />
                        ) : (
                            <div className="h-14 w-14 rounded-md bg-[#262e61]" aria-hidden="true" />
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                {song.trackName}
                            </p>
                            <p className="truncate text-xs text-[#b8c1e0]">{song.artistName}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        </div>
    );
};

export default DisplayUserSongs;