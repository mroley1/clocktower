import { createContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.scss';
import MoveBoard from './moveables/MoveBoard';
import GameContextType from '@Common/GameContextType';
import Background from './Background';
import HeadsUp from './heads_up/HeadsUp';
import { GameMode } from '@Common/GameModes';
import ScriptType from '@/common/ScriptType';
import GameStateType from '@/common/GameStateType';

const TESTSTATE = require('./testState.json');
const queryClient = new QueryClient({})

// create gamemode context
export const GameContext = createContext<GameContextType>({
  "state": {
    "tokens": [],
    "script": {
      "meta": {
        "author": "",
        "description": "",
        "difficulty": 0,
        "gameType": "NORMAL",
        "name": "",
        "date": ""
      },
      "roles": [],
            "recommendedFabled": [],
      "customJinxes": []
    },
    "onBlock": null,
    "gameMode": GameMode.SETUP,
    "quickAccessSettings": {
      "nominationHelp": true
    }
  },
  "setter": () => {},
  "util": {
    "setMode": () => {},
    "setOnBlock": () => {},
    "setScript": () => {}
  },
});

function App() {
  
  // initialize game state
  const [gameState, setGameState] = useState(TESTSTATE)
  
  // set game mode, takes game mode
  function setMode(mode: GameMode) {
    const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.gameMode = mode
    gameContext.setter(tmp)
  }
  
  // set user that is on the block, takes index of user token in gamestate
  function setOnBlock(index: number) {
    const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.onBlock = index
    gameContext.setter(tmp)
  }
  
  // sets the script to be used gamewide
  function setScript(json: ScriptType) {
    const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.script = json
    gameContext.setter(tmp)
  }
  
  // set game context
  const gameContext: GameContextType = {
    "state": gameState,
    "setter": setGameState,
    "util": {
      "setMode": setMode,
      "setOnBlock": setOnBlock,
      "setScript": setScript
    }
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <GameContext.Provider value={gameContext}>
        <Background />
        <MoveBoard />
        <HeadsUp />
      </GameContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
