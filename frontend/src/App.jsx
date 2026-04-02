import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import GameScreen from './components/GameScreen'
import Leaderboard from './components/Leaderboard'
import ResultScreen from './components/ResultScreen'

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = '/' element={<LandingPage/>}/>
        <Route path = '/game' element={<GameScreen/>}/>
        <Route path = '/result' element={<ResultScreen/>}/>
        <Route path = '/leaderboard' element={<Leaderboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App