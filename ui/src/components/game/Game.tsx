import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON, HistoryJSON } from '../common/GameData';
import Menu from './menu/Menu';
import { ReferenceData } from '../common/ReferenceData';
import Players from './players/Players';
import Setup from './setup/Setup';
import Bag from './bag/Bag';


export const GameContext = createContext({} as GameData)

export const ControllerContext = createContext({} as StateManager.Controller)

export const ReferenceContext = createContext({} as ReferenceData.ContextFormat)

interface GameProps {gameSettings: GameDataJSON, history: HistoryJSON, saveGame: (gameDataJSON: GameDataJSON, history: HistoryJSON)=>void, quitGame: ()=>void}
function Game({gameSettings, history, saveGame, quitGame}: GameProps) {
  
  const [gameState, setGameState] = useState(gameSettings as any as GameData)
  
  const [scriptJSON, setScriptJSON] = useState(require('../../data/scripts/bad_moon_rising.json'));
  
  const referenceData = useMemo(() => {
    const script = new ReferenceData.Script(scriptJSON);
    const roles = new ReferenceData.Roles(script);
    const image = new ReferenceData.Image(roles);
    const nightOrder = new ReferenceData.NightOrder(roles);
    const interactions = new ReferenceData.Interactions(roles);
    const jinxes = new ReferenceData.Jinxes();
    const fabled = new ReferenceData.Fabled();
    return {
    utilies: {
      saveGame,
      quitGame
    },
    roles,
    script,
    image,
    nightOrder,
    interactions,
    jinxes,
    fabled,
  } as ReferenceData.ContextFormat}, [scriptJSON])
  
  const stateManager = useMemo(() => new StateManager.Controller(gameState, setGameState, history, gameSettings, saveGame, referenceData), [])
  
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
          <ReferenceContext.Provider value={referenceData}>
            <Content/>
          </ReferenceContext.Provider>
        </ControllerContext.Provider>
      </GameContext.Provider>
    );
  }
}

export default Game;

function Content() {
  
  const gameContext = useContext(GameContext);
  
  const [initalSetup, setInitalSetup] = useState(gameContext.gameProgression.progressId == 1)
  
  function completeSetup() {
    setInitalSetup(false)
  }
  
  function openInitialSetup() {
    setInitalSetup(true)
  }
  
  if (initalSetup) {
    return ( // * inital bag setup
      <div>
        <Bag completeSetupFunc={completeSetup}></Bag>
      </div>
    )
  } else {
    return ( // * proper game
      <>
        <Players></Players>
        <Menu openInitialSetup={openInitialSetup}></Menu>
        <Setup></Setup>
      </>
    )
  }
}
