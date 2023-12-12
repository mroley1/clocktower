import { createContext, useState } from 'react';
import './App.css';
import MoveBoard from './moveables/MoveBoard';

const TESTSTATE = require('./testState.json');

export const GameContext = createContext();

function App() {
  
  const [gameState, setGameState] = useState(TESTSTATE)
  
  const gameContext = {
    "state": gameState,
    "setter": setGameState
  }
  
  return (
    <GameContext.Provider value={gameContext}>
      <MoveBoard />
    </GameContext.Provider>
  );
}

export default App;
