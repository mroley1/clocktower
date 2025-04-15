import { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { GameDataJSON, GameDataJSONTag, HistoryJSON } from './common/GameData';
import Game from './game/Game';
import ScriptMenu from './scriptMenu/ScriptMenu';
import ScriptData from './common/ScriptData';
import { saveGameData, newSave, getSaves } from './API';
import { useNavigate } from 'react-router';

function App() {
  
  const [saves, setSaves] = useState<GameDataJSONTag[]>([])
  
  let loadedGameInit: {data: GameDataJSON, history: HistoryJSON}|undefined
  const [loadedGame, setLoadedGame] = useState(loadedGameInit)
  
  //used for script menu, set to undefined for now
  const [loadedScript, setLoadedScript] = useState("a")

  
  const navigate = useNavigate();
  
  function saveGame(gameDataJSON: GameDataJSON, history: HistoryJSON) {
    saveGameData(gameDataJSON, history)
  }
  
  function handleNewSave(script?: ScriptData | null) {
    newSave().then(newValue => {
      const newSaves = structuredClone(saves)
      if(script){newValue.script = script}       
      newSaves.push(newValue)
      setSaves(newSaves)
    })
  }
  
  function handleLoadSave(saveId: number) {
    navigate("/" + saveId)
  }

  function handleScriptMenu() {
    setLoadedScript("b");
  }

  function quitScriptMenu() {
    setLoadedScript("a");
  }
  
  useEffect(() => {
    getSaves().then(saves => {
      setSaves(saves)
    })
  }, [loadedGame])
  
  function quitGame() {
    setLoadedGame(undefined)
  }
  
  if (loadedGame) {
    return <Game gameSettings={loadedGame.data} history={loadedGame.history}></Game>
  }else if(loadedScript == "b"){
    return <ScriptMenu quitScriptMenu={quitScriptMenu} handleNewSave={handleNewSave}></ScriptMenu>
  }else {
    return <div>
      <br></br>
      <br></br>
      <button onClick={() => handleNewSave()}>new save</button>
      <button onClick={handleScriptMenu}>script menu</button>
      <br></br>
      {saves.map((save) => 
        <div key={save.gameID} onClick={()=>{handleLoadSave(save.gameID)}}>{JSON.stringify(save)}</div>
      )}
    </div>
  }
}

export default App;
