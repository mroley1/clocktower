import { useEffect, useState } from 'react';
import './App.scss';
import { GameData, GameDataJSON } from './common/GameData';
import { GameProgression } from './common/reactStates/GameProgression';
import Game from './game/Game';

function App() {
  
  
  
  const [saves, setSaves] = useState(loadSaves())
  
  let loadedGameInit: GameDataJSON|undefined
  const [loadedGame, setLoadedGame] = useState(loadedGameInit)
  
  function newSave() {
    const newSaves = structuredClone(saves)
    newSaves.push(newSaveJSON())
    setSaves(newSaves)
    setLocalStorage(newSaves)
  }
  
  function saveGame(gameDataJSON: GameDataJSON) {
    const newSaves = saves.map((save) => {
      if (save.gameID == gameDataJSON.gameID) {
        return gameDataJSON
      } else {
        return save
      }
    })
    setLocalStorage(newSaves)
    setSaves(newSaves)
  }
  
  function setLocalStorage(saves: GameDataJSON[]) {
    localStorage.setItem("saves", JSON.stringify(saves))
  }
  
  function quitGame() {
    setLoadedGame(undefined)
  }
  
  if (loadedGame) {
    return <Game gameSettings={loadedGame} saveGame={saveGame} quitGame={quitGame}></Game>
  } else {
    return <div>
      <br></br>
      <br></br>
      <button onClick={newSave}>new save</button>
      <br></br>
      {saves.map((save) => 
        <div key={save.gameID} onClick={()=>{setLoadedGame(save)}}>{JSON.stringify(save)}</div>
      )}
    </div>
  }
}

export default App;

function newSaveJSON(): GameDataJSON {
  return {
    gameID: window.crypto.randomUUID(),
    historyHead: 0,
    playerCount: {type: "PlayerCount", UUID: window.crypto.randomUUID(), active: true, quantity: 20},
    gameProgression: {type: "GameProgression", UUID: window.crypto.randomUUID(), active: true, state: GameProgression.State.SETUP, night: 0, stored: undefined},
    players: [],
    interactions: [],
    transactions: []
  }
}

function loadSaves(): GameDataJSON[] {
  const saves = localStorage.getItem("saves")
  if (saves) {
    return JSON.parse(saves)
  } else {
    return []
  }
}