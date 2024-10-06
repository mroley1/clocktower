import { createContext, useEffect, useState } from 'react';
import { GameProgression } from '../common/reactStates/GameProgression';
import Test from './test/test';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON } from '../common/GameData';


export const GameContext = createContext({} as GameData)

function Game() {
  
  const defaultSettings: GameDataJSON = {
    playerCount: {type: "PlayerCount", UUID: "9384576", quantity: 20},
    gameProgression: {"type": "GameProgression", UUID: "123456789", state: GameProgression.State.SETUP, night: 0, stored: undefined}
  }

  const [gameState, setGameState] = useState(defaultSettings as any as GameData)
  
  const stateManager =  new StateManager.Controller(gameState, setGameState, defaultSettings)
  
  useEffect(() => {
    stateManager.build()
  }, [])
  
  // const [gpState, setgpState] = useState({state: GameProgression.State.SETUP, night: 0, stored: undefined} as GameProgression.ReactState)
  
  //console.log(gpState)
  
  return (
    <GameContext.Provider value={gameState}>
      <Test></Test>
    </GameContext.Provider>
  );
}

export default Game;
