import React, {useState, useEffect} from 'react';
import axios from 'axios';

// const setlistURL = '/api/1.0/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d';
const setlistKey = '1c1QlARHxXsUKzGmRT1Tnp3YoDZwTt4R22To';

const SetlistComponent = ({ artistName }) => {
    // This will hold the values for setlisst, which we will get from the API 
    const [artists, setArtists] = useState([]);

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
                            'x-api-key': setlistKey,
                            'Accept': 'application/json'
                        }
                    }
                )

                setArtists(response.data.artist);
            } catch(error) {
                console.error('Error fetching setlist data:', error);
            };
        };
        fetchArtistData();
    }, [artistName]);

    // Only render the setlist data if we have an artist name, otherwise prompt the user to enter one
    if (!artistName) {
        return <p>Please enter an artist name to see the setlist data.</p>;
    }

    return (
        <div>
            <h2>Artist Name: {artistName}</h2>
            <p>Setlist data will be displayed here.</p>
            <ul>
                {artists.map(artist => (
                    <li>{artist.name}</li>
                ))}
            </ul>
        </div>
    );




};

export default SetlistComponent;