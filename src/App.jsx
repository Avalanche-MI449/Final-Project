import { useState } from "react";
import Navbar from "./Navbar.jsx";
import SongSearch from './SongSearch.jsx';
import DisplayUserSongs from "./DisplayUserSongs.jsx";
import LineWaves from './assets/LineWaves';


function App() {
  const [artist, setArtist] = useState("");
  const [inputArtist, setInputArtist] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [user, setUser] = useState("");
  const [inputUser, setInputUser] = useState("");
  const [userID, setUserID] = useState(null);
  const [songsRefreshKey, setSongsRefreshKey] = useState(0);

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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#141B48]">
      <div className="mx-auto max-w-[1400px] px-6 bg-[#FFFFFF]">
        <Navbar
          inputUser={inputUser}
          user={user}
          onUserInputChange={getUserName}
          onLoginClick={clickLogin}
          onUserID={setUserID}
        />
      </div>


      <div className="relative min-h-[calc(100vh-4rem)] w-full">
        <div className="pointer-events-none absolute w-[1800px] h-full z-0">
          <LineWaves
            speed={0.1}
            innerLineCount={32}
            outerLineCount={36}
            warpIntensity={1}
            rotation={-45}
            edgeFadeWidth={0}
            colorCycleSpeed={1}
            brightness={0.2}
            color1="#390E59"
            color2="#7148B5"
            color3="#C1B5FD"
            enableMouseInteraction
            mouseInfluence={2}
          />
        </div>

        <div className="relative z-10 mx-auto min-h-[calc(100vh-4rem)] max-w-[1400px] px-6 pb-4 pt-8">
          <div className="grid grid-cols-1 items-start gap-y-4 md:min-h-[calc(100vh-8rem)] md:grid-cols-2 md:items-stretch md:gap-x-14">
            <section className="min-h-[560px] rounded-[10px] border-2 border-[#FFFFFF] bg-[#390e59] p-4 text-left md:h-full md:min-h-0">
              <h1 className="mb-3 text-center text-5xl leading-none text-[#FFFFFF] [font-family:'Harlow_Solid_Italic','Harlow_Solid','Brush_Script_MT',cursive]">Artist Search</h1>
              <SongSearch
                userId={userID}
                onSongSaved={() => setSongsRefreshKey((prev) => prev + 1)}
              />
            </section>

            <section className="min-h-[560px] rounded-[10px] border-2 border-[#FFFFFF] bg-[#390e59] p-4 text-left md:h-full md:min-h-0">
              <h1 className="mb-3 text-center text-5xl leading-none text-[#FFFFFF] [font-family:'Harlow_Solid_Italic','Harlow_Solid','Brush_Script_MT',cursive]">Your Songs:</h1>
              <DisplayUserSongs userId={userID} refreshKey={songsRefreshKey} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
