import { useState } from 'react'
import './App.css'
import SetlistApiComponent from './setlistAPI'
import MusicPreviewWidget from "./MusicPreviewWidget";
import Events from './Events.jsx'
import Navbar from './Navbar.jsx'

// Franz Ferdinand

function App() {
  const [artist, setArtist] = useState("")
  const [inputArtist, setInputArtist] = useState("")

  // Handler for the input box
  const getUserInputtedArtist = (event) => {
    setInputArtist(event.target.value)
  }

  // Handler for the button click
  const clickButton = () => {
    setArtist(inputArtist)
  }

  return (
    <div className="app-shell">
      <Navbar />
      <h1>Artist Search</h1>
      <h3>Enter an artist's name to see their events and setlists.</h3>
      <div className="search-controls">
        <input id="artist_input" name="artist_input" type="text" onChange={ getUserInputtedArtist }/>
        <button onClick={ clickButton }>Click Me</button>
      </div>

      <div className="results-grid">
        <section className="results-column">
          <SetlistApiComponent artistName={artist} />
        </section>
        <section className="results-column">
          <Events artistName={artist} />
        </section>
      </div>
    </div>
  )
}

export default App
