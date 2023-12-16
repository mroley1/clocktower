import { createContext, useState } from 'react';
import './App.scss';
import MoveBoard from './moveables/MoveBoard';
import GameContextType from '@Common/GameContextType';
import Background from './Background';
import HeadsUp from './heads_up/HeadsUp';
import { GameMode } from '@Common/GameModes';

const TESTSTATE = require('./testState.json');

export const GameContext = createContext<GameContextType>({
  "state": {
    "tokens": [],
    "gameMode": GameMode.SETUP
  },
  "setter": () => {}
});

function App() {
  
  const [gameState, setGameState] = useState(TESTSTATE)
  
  const gameContext: GameContextType = {
    "state": gameState,
    "setter": setGameState
  }
  
  return (
    <GameContext.Provider value={gameContext}>
      <Background />
      <MoveBoard />
      <HeadsUp />
    </GameContext.Provider>
  );
}

export default App;
