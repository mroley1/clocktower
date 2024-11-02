import { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { GameDataJSON, GameDataJSONTag } from './common/GameData';
import { GameProgression } from './common/reactStates/GameProgression';
import Game from './game/Game';

function App() {
  
  const [saves, setSaves] = useState<GameDataJSONTag[]>([])
  
  let loadedGameInit: GameDataJSON|undefined
  const [loadedGame, setLoadedGame] = useState(loadedGameInit)
  
  const dbPromise = useMemo(initDatabase, [])
  
  function saveGame(gameDataJSON: GameDataJSON) {
    dbPromise.then(db => {
      saveGameData(db, gameDataJSON)
    })
  }
  
  function handleNewSave() {
    dbPromise.then(db => {
      newSave(db).then(newValue => {
        const newSaves = structuredClone(saves)
        newSaves.push(newValue)
        setSaves(newSaves)
      })
    })
  }
  
  function handleLoadSave(saveId: number) {
    dbPromise.then(db => {
      getSaveData(db, saveId).then(saveJSON => {
        setLoadedGame(saveJSON)
      })
    })
  }
  
  useEffect(() => {
    dbPromise.then(db => {
      getSaves(db).then(saves => {
        setSaves(saves)
      })
    })
  }, [loadedGame])
  
  function quitGame() {
    setLoadedGame(undefined)
  }
  
  if (loadedGame) {
    return <Game gameSettings={loadedGame} saveGame={saveGame} quitGame={quitGame}></Game>
  } else {
    return <div>
      <br></br>
      <br></br>
      <button onClick={handleNewSave}>new save</button>
      <br></br>
      {saves.map((save) => 
        <div key={save.gameID} onClick={()=>{handleLoadSave(save.gameID)}}>{JSON.stringify(save)}</div>
      )}
    </div>
  }
}

export default App;

function newSaveJSON(): GameDataJSON {
  return {
    name: "",
    gameID: dbIdNew(),
    historyHead: 0,
    playerCount: {type: "PlayerCount", UUID: window.crypto.randomUUID(), active: true, quantity: 20},
    gameProgression: {type: "GameProgression", UUID: window.crypto.randomUUID(), active: true, state: GameProgression.State.SETUP, night: 0, stored: undefined, currentTurnOwner: ""},
    players: [],
    interactions: [],
    transactions: []
  }
}

function genSaveJsonTag(gameDataJSON: GameDataJSON): GameDataJSONTag {
  return {
    name: "",
    gameID: gameDataJSON.gameID,
    gameProgression: gameDataJSON.gameProgression,
    playerRoles: gameDataJSON.players.filter(player => player.role).map(player => player.role!),
    script: undefined,
    created: Date.now()
  }
}

function dbIdNew() {
  const current = localStorage.getItem("dbCurrentIndex")
  if (!current) {
    localStorage.setItem("dbCurrentIndex", "0")
    return 0
  } else {
    const next = parseInt(current) + 1
    localStorage.setItem("dbCurrentIndex", next.toString())
    return next
  }
}

function initDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const DBOpenRequest = indexedDB.open("storedGameStates")
    
    DBOpenRequest.onerror = (err) => {
      reject(err)
    }
    
    DBOpenRequest.onsuccess = () => {
      resolve(DBOpenRequest.result)
    }
    
    DBOpenRequest.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase
      if (db) {
        
        db.onerror = (err) => {
          console.error(err)
        }
        
        const savesObjectStore = db.createObjectStore("saves")
        
        savesObjectStore.createIndex('tags', 'tags', {unique: false})
        savesObjectStore.createIndex('data', 'data', {unique: false})
        
        resolve(db)
      } else {
        reject(event)
      }
    }
  })
}

function getSaves(db: IDBDatabase): Promise<GameDataJSONTag[]> {
  
  const objectStore = db.transaction('saves').objectStore('saves')
  
  return new Promise<GameDataJSONTag[]>((resolve, reject) => {
    
    let saves: GameDataJSONTag[] = []
    
    const cursor = objectStore.openCursor()
    
    if (cursor) {
      cursor.onsuccess = (event: any) => {
        const result = event.target.result
        if (!result) {
          resolve(saves)
        } else {
          saves.push(result.value.tag);
          result.continue()
        }
      }
      
      cursor.onerror = (err) => {
        reject(err)
      }
    }
  })
}
  
function newSave(db: IDBDatabase) {
  return new Promise<GameDataJSONTag>((resolve, reject) => {
    const transaction = db.transaction(['saves'], 'readwrite')
    
    const data = newSaveJSON()
    const tag = genSaveJsonTag(data)
    const newItem = {
      data,
      tag
    }
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.add(newItem, data.gameID)
    
    objectStoreRequest.onsuccess = () => {
      resolve(newItem.tag)
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}

function getSaveData(db: IDBDatabase, gameID: number): Promise<GameDataJSON> {
  
  return new Promise<GameDataJSON>((resolve, reject) => {
    
    const transaction = db.transaction(['saves'], 'readonly')
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.get(gameID)
    
    objectStoreRequest.onsuccess = (event: any) => {
      resolve(event.target.result.data as GameDataJSON)
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}

function saveGameData(db: IDBDatabase, gameData: GameDataJSON): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    
    const transaction = db.transaction(['saves'], 'readwrite')
    
    const tag = genSaveJsonTag(gameData)
    const newItem = {
      data: gameData,
      tag
    }
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.put(newItem, gameData.gameID)
    
    objectStoreRequest.onsuccess = () => {
      resolve()
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}