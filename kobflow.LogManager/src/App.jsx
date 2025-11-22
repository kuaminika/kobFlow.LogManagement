import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LogDashBoard } from './pages/LogDashBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
   <LogDashBoard></LogDashBoard>
  )
}

export default App
