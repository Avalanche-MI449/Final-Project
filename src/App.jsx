import { useState } from "react";
import "./App.css";
import SetlistApiComponent from "./setlistAPI";
import MusicPreviewWidget from "./MusicPreviewWidget";
import Events from "./Events.jsx";
import Navbar from "./Navbar.jsx";
import Login from "./Users.jsx";
import SongSearch from './SongSearch.jsx';
import DisplayUserSongs from "./DisplayUserSongs.jsx";

// Franz Ferdinand

function App() {
  const [artist, setArtist] = useState("");
  const [inputArtist, setInputArtist] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [user, setUser] = useState("");
  const [inputUser, setInputUser] = useState("");
  const [userID, setUserID] = useState(null);

  // Handler for the input box
  const getUserInputtedArtist = (event) => {
    setInputArtist(event.target.value);
  };

  // Handler for the button click
  const clickButton = () => {
    setArtist(inputArtist);
    setSelectedArtist("");
  };

  // Handler for the user input box
  const getUserName = (event) => {
    setInputUser(event.target.value);
  };

  // Handler for the login button click
  const clickLogin = () => {
    setUser(inputUser);
    console.log("User logged in:", inputUser);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <h1>Artist Search</h1>
      <SongSearch userId={userID} />

      <h1>Login: </h1>
      <div>
        <input id="user" name="user" type="text" onChange={getUserName} />
        <button onClick={clickLogin}>Login</button>
      </div>

      <Login inputUser={user} onUserID={setUserID} />


      <h1>Display User Songs / Your Playlist: </h1>
      <DisplayUserSongs userId={userID} />

    </div>
  );
}

export default App;
