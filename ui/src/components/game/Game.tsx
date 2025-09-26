import { createContext, useEffect, useMemo, useState } from 'react';
import { StateManager } from '../common/StateManager';
import { GameData, GameDataJSON, HistoryJSON } from '../common/GameData';
import Menu from './menu/Menu';
import { ReferenceData } from '../common/ReferenceData';
import Players from './players/Players';
import Setup from './setup/Setup';
import { useLoaderData, useNavigate } from 'react-router';
import { saveGameData } from '../saves';
import ScriptData from '../common/ScriptData';


export const GameContext = createContext({} as GameData)

export const ControllerContext = createContext({} as StateManager.Controller)

export const ReferenceContext = createContext({} as ReferenceData.ContextFormat)


function Game() {
  
  const navigate = useNavigate();
  
  
  const loaderData = useLoaderData();
  const gameSettings = loaderData.data;
  const history = loaderData.history;
  const scriptData = loaderData.scriptData; //! currently in wrong format
  
  const [gameState, setGameState] = useState(gameSettings as any as GameData)
  
  const [scriptJSON, setScriptJSON] = useState(require('../../data/scripts/trouble_brewing.json'));
  
  let quitGame = () => {
    navigate("/")
  }
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
  
  const stateManager = useMemo(() => new StateManager.Controller(gameState, setGameState, history, gameSettings, referenceData), [])
  
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
            <Players></Players>
            <Menu></Menu>
            <Setup></Setup>
          </ReferenceContext.Provider>
        </ControllerContext.Provider>
      </GameContext.Provider>
    );
  }
}

export default Game;
