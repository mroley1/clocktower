import { createContext, useEffect, useMemo, useState } from 'react';
import { GameProgression } from '../common/reactStates/GameProgression';
import Test from './test/test';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON } from '../common/GameData';
import Menu from './Menu';
import { ReferenceData } from '../common/ReferenceData';


export const GameContext = createContext({} as GameData)

export const ControllerContext = createContext({} as StateManager.Controller)

export const DataContext = createContext({} as ReferenceData.ContextFormat)

interface GameProps {gameSettings: GameDataJSON, saveGame: (gameDataJSON: GameDataJSON)=>void, quitGame: ()=>void}
function Game({gameSettings, saveGame, quitGame}: GameProps) {
  
  const [gameState, setGameState] = useState(gameSettings as any as GameData)
  
  const stateManager = useMemo(() => new StateManager.Controller(gameState, setGameState, gameSettings, saveGame), [])
  
  const referenceData = useMemo(() => {return {
    utilies: {
      saveGame,
      quitGame
    },
    role: new ReferenceData.Role()
  } as ReferenceData.ContextFormat}, [])
  
  const [building, setBuilding] = useState(true);
  
  useEffect(() => {
    stateManager.build(true);
    setBuilding(false);
  }, [])
  
  if (building) {
    return <>loading</>
  } else {
    return (
      <GameContext.Provider value={gameState}>
        <ControllerContext.Provider value={stateManager}>
          <DataContext.Provider value={referenceData}>
            <Menu></Menu>
            <Test></Test>
          </DataContext.Provider>
        </ControllerContext.Provider>
      </GameContext.Provider>
    );
  }
}

export default Game;
