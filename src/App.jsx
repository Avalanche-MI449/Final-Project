import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SetlistComponent from './setlistAPI'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <SetlistComponent artistName="Franz Ferdinand" />
      {/* <SetlistComponent artistName="The Beatles" /> */}
    </>
  )
}

export default App
