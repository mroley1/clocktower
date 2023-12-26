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
    "script": {},
    "gameMode": GameMode.SETUP
  },
  "setter": () => {},
  "util": {
    "setMode": () => {}
  }
});

function App() {
  
  const [gameState, setGameState] = useState(TESTSTATE)
  
  function setMode(mode: GameMode) {
    const tmp = JSON.parse(JSON.stringify(gameContext.state));
    tmp["gameMode"] = mode
    gameContext.setter(tmp)
  }
  
  const gameContext: GameContextType = {
    "state": gameState,
    "setter": setGameState,
    "util": {
      "setMode": setMode
    }
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
