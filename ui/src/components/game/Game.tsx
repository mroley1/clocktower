import { createContext, useEffect, useMemo, useState } from 'react';
import { GameProgression } from '../common/reactStates/GameProgression';
import Test from './test/test';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON } from '../common/GameData';


export const GameContext = createContext({} as GameData)

export const ControllerContext = createContext({} as StateManager.Controller)

function Game() {
  
  const defaultSettings: GameDataJSON = {
    playerCount: {type: "PlayerCount", UUID: window.crypto.randomUUID(), active: true, quantity: 20},
    gameProgression: {type: "GameProgression", UUID: window.crypto.randomUUID(), active: true, state: GameProgression.State.SETUP, night: 0, stored: undefined},
    players: [],
    interactions: []
  }

  const [gameState, setGameState] = useState(defaultSettings as any as GameData)
  
  const stateManager = useMemo(() => new StateManager.Controller(gameState, setGameState, defaultSettings), [])
  
  useEffect(() => {
    stateManager.build(true)
  }, [])
  
  return (
    <GameContext.Provider value={gameState}>
      <ControllerContext.Provider value={stateManager}>
        <Test></Test>
      </ControllerContext.Provider>
    </GameContext.Provider>
  );
}

export default Game;
