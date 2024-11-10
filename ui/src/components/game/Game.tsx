import { createContext, useEffect, useMemo, useState } from 'react';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON, HistoryJSON } from '../common/GameData';
import Menu from './menu/Menu';
import { ReferenceData } from '../common/ReferenceData';
import Players from './players/Players';
import NightGuide from './nightGuide/NightGuide';


export const GameContext = createContext({} as GameData)

export const ControllerContext = createContext({} as StateManager.Controller)

export const DataContext = createContext({} as ReferenceData.ContextFormat)

interface GameProps {gameSettings: GameDataJSON, history: HistoryJSON, saveGame: (gameDataJSON: GameDataJSON, history: HistoryJSON)=>void, quitGame: ()=>void}
function Game({gameSettings, history, saveGame, quitGame}: GameProps) {
  
  const [gameState, setGameState] = useState(gameSettings as any as GameData)
  
  const stateManager = useMemo(() => new StateManager.Controller(gameState, setGameState, history, gameSettings, saveGame), [])
  
  const referenceData = useMemo(() => {
    const roles = new ReferenceData.Roles();
    const script = new ReferenceData.Script(roles);
    const nightOrder = new ReferenceData.NightOrder(script);
    const interactions = new ReferenceData.Interactions(script);
    const jinxes = new ReferenceData.Jinxes();
    const fabled = new ReferenceData.Fabled();
    return {
    utilies: {
      saveGame,
      quitGame
    },
    roles,
    script,
    nightOrder,
    interactions,
    jinxes,
    fabled,
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
            <Players></Players>
            <Menu></Menu>
            <NightGuide></NightGuide>
          </DataContext.Provider>
        </ControllerContext.Provider>
      </GameContext.Provider>
    );
  }
}

export default Game;
