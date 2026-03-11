import React, {useState, useEffect} from 'react';
import axios from 'axios';

// const setlistURL = '/api/1.0/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';
const setlistApiKey = '1c1QlARHxXsUKzGmRT1Tnp3YoDZwTt4R22To';

const formatEventDate = (eventDate) => {
    if (!eventDate) {
        return "";
    }

    const [day, month, year] = eventDate.split('-');
    if (!day || !month || !year) {
        return eventDate;
    }

    return `${month}-${day}-${year}`;
};

const SetlistApiComponent = ({ artistName }) => {
    // This will hold the values for setlisst, which we will get from the API 
    const [artists, setArtists] = useState([]);
    const [artistMBID, setArtistMBID] = useState("");
    const [selectedArtistLabel, setSelectedArtistLabel] = useState("");
    const [setlists, setSetlists] = useState([]);
    const [setlistDate, setSetlistDate] = useState("");
    const [songs, setSongs] = useState([]);



    // Get the artist data from the API based off the artist name
    useEffect(() => {
        // Create a function to fetch the data from the API
        const fetchArtistData = async () => {
            try{
                // Check to make sure we have an artist name before we try to fetch data
                if (!artistName) {
                    return;
                }

                const setlistURL = `/setlistapi/1.0/search/artists?artistName=${artistName}&p=1&sort=sortName`;

                // Connect to the API 
                const response = await axios.get(
                    setlistURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                // Set our variables to the data we get back from the API
                setArtists(response.data.artist || []);
                setArtistMBID("");
                setSelectedArtistLabel("");
                setSetlists([]);
                setSetlistDate("");
                setSongs([]);

            } catch(error) {
                console.error('Error fetching setlist data:', error);
            };
        };

        fetchArtistData();
    }, [artistName]);


    // Get setlist data from the API based off the artist MBID
    useEffect(() => {
        const fetchSetlistData = async () => {
            try {
                if (!artistMBID) {
                    return;
                }

                const setlistURL = `/setlistapi/1.0/artist/${artistMBID}/setlists?p=1`;

                const response = await axios.get(
                    setlistURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                setSetlists(Array.isArray(response.data.setlist) ? response.data.setlist : []);
                setSetlistDate("");
                setSongs([]);

            } catch (error) {
                console.error('Error fetching setlist data:', error);
            }
        };

        fetchSetlistData();
    }, [artistMBID]);

    // Get the songs from a setlist from the API
    useEffect(() => {
        const fetchSongsData = async () => {
            try {
                if (!artistMBID || !setlistDate) {
                    return;
                }

                const songURL = `/setlistapi/1.0/search/setlists?artistMbid=${artistMBID}&date=${encodeURIComponent(setlistDate)}&p=1`;
                
                const response = await axios.get(
                    songURL,
                    {
                        headers: {
                            'x-api-key': setlistApiKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                const foundSetlists = Array.isArray(response.data.setlist) ? response.data.setlist : [];
                const selectedSetlist = foundSetlists.find((setlist) => setlist.eventDate === setlistDate) || foundSetlists[0];
                const setsForDate = selectedSetlist?.sets?.set;
                const normalizedSets = Array.isArray(setsForDate) ? setsForDate : (setsForDate ? [setsForDate] : []);
                const extractedSongs = normalizedSets.flatMap((set) => {
                    const setSongs = set?.song;
                    const normalizedSongs = Array.isArray(setSongs) ? setSongs : (setSongs ? [setSongs] : []);
                    return normalizedSongs.map((song) => song?.name).filter(Boolean);
                });

                setSongs(extractedSongs);

            } catch (error) {
                console.error('Error fetching songs data:', error);
            }
        };

        fetchSongsData();
    }, [artistMBID, setlistDate]);



    // ================================================================================
    // Display the data from the API 
    // Flow: Artist -> Setlist -> Songs
    // ================================================================================
    
    // Only render the setlist data if we have an artist name, otherwise prompt the user to enter one
    if (!artistName) {
        return <h2>Please enter an artist name to see the setlist data.</h2>;
    }

    // Display the possible artists the user can pick 
    if (!artistMBID) {
        return (
            <div>
                <h2>Possible Artists</h2>
                <ul>
                    {artists.map(artist => (
                        <li key={artist.mbid || artist.name}>
                            <button
                                onClick={() => {
                                    if (!artist.mbid) {
                                        return;
                                    }
                                    setArtistMBID(artist.mbid);
                                    setSelectedArtistLabel(artist.name || "");
                                    setSetlistDate("");
                                    setSongs([]);
                                }}
                                disabled={!artist.mbid}
                            >
                                {artist.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Display the possible setlists from the artist the user picked
    if (!setlistDate) {
        return (
            <div>
                <h2>Possible Setlists{selectedArtistLabel ? ` for ${selectedArtistLabel}` : ""}:</h2>
                <button
                    onClick={() => {
                        setArtistMBID("");
                        setSelectedArtistLabel("");
                        setSetlists([]);
                        setSetlistDate("");
                        setSongs([]);
                    }}
                >
                    Back to Artists
                </button>

                {setlists.length > 0 ? (
                    <ul>
                        {setlists.map(setlist => (
                            <li key={setlist.id}>
                                <button onClick={ () => setSetlistDate(setlist.eventDate) }><p>{formatEventDate(setlist.eventDate)}</p></button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No setlists found for this artist.</p>
                )}
            </div>
        );
    }

    if (setlistDate) {
        return (
            <div>
                <p>Setlist for {selectedArtistLabel || artistName} on {formatEventDate(setlistDate)}:</p>
                <button
                    onClick={() => {
                        setSetlistDate("");
                        setSongs([]);
                    }}
                >
                    Back to Dates
                </button>
                <button
                    onClick={() => {
                        setArtistMBID("");
                        setSelectedArtistLabel("");
                        setSetlists([]);
                        setSetlistDate("");
                        setSongs([]);
                    }}
                >
                    Back to Artists
                </button>

                {songs.length > 0 ? (
                    <ul>
                        {songs.map((song, index) => (
                            <li key={index}>{song}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Setlist not available at this time.</p>
                )}
            </div>
        );
    }



    // Display the songs from the setlist the user picked


    // return (
    //     <div>
            
    //         <h2>Artist Name: {artistName}</h2>

            // <p>Possible Artists: </p>
            // <ul>
            //     {artists.map(artist => (
            //         <li key={artist.name}>
            //             <button onClick={() => { setArtistMBID(artistMBIDMap[artist.name])}}>{artist.name}</button>
            //         </li>
            //     ))}
            // </ul>

            // <h3>Possbile Setlists:</h3>
            // <ul>
            //     {setlists.map(setlist => (
            //         <li key={setlist.id}>
            //             <button><p>{setlist.eventDate}</p></button>
            //         </li>
            //     ))}
            // </ul>
    //     </div>
    // );




};

export default SetlistApiComponent;