import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://djsrjatigmxnoaxydepq.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const findUserSongs = async (userId) => {
    const { data, error } = await supabase
        .from('user_songs')
        .select('song')
        .eq('user', userId);
    
    return data;
}

const findSongName = async (songId) => {
    // console.log("Finding name for song ID: ", songId['song']);
    const { data, error } = await supabase
        .from('songs')
        .select('name')
        .eq('id', songId['song'])
        .maybeSingle();
    
    return data?.name || null;
}

const DisplayUserSongs = ({ userId }) => {
    const [userSongs, setUserSongs] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchUserSongs = async () => {
            const songs = await findUserSongs(userId);
            setUserSongs(songs);
            // console.log("User songs: ", songs);
        }
        fetchUserSongs();
    }, [userId]);

    useEffect(() => {
        const fetchSongNames = async () => {
            const songNames = [];
            for (const id of userSongs) {
                const name = await findSongName(id);
                songNames.push(name);
            }
            setSongs(songNames);

        }
        fetchSongNames();
    }, [userSongs]);

    // Check if userID is null and if we got data from the database
    if (!userId) {
        return <p>Please log in to see your saved songs.</p>;
    }
    if (userSongs === null || userSongs.length === 0) {
        return <p>You have no saved songs. Search for songs and save them to see them here!</p>;
    }

    // console.log("Songs to display: ", songs);   


    return (
        <div>
        <h1>{userId}</h1> {/* Display the user ID for debugging */}
        <h1>Your Saved Songs: Note, it is white text, so it is a little hard to see</h1>
        <ul>
            {songs.map((song, index) => (
                <li key={index}>{song}</li>
            ))}
        </ul>
        </div>
    )
}

export default DisplayUserSongs;