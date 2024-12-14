import { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { GameDataJSON, GameDataJSONTag, HistoryJSON } from './common/GameData';
import { GameProgression } from './common/reactStates/GameProgression';
import Game from './game/Game';

function App() {
  
  const [saves, setSaves] = useState<GameDataJSONTag[]>([])
  
  let loadedGameInit: {data: GameDataJSON, history: HistoryJSON}|undefined
  const [loadedGame, setLoadedGame] = useState(loadedGameInit)
  
  const dbPromise = useMemo(initDatabase, [])
  
  function saveGame(gameDataJSON: GameDataJSON, history: HistoryJSON) {
    dbPromise.then(db => {
      saveGameData(db, gameDataJSON, history)
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
    return <Game gameSettings={loadedGame.data} history={loadedGame.history} saveGame={saveGame} quitGame={quitGame}></Game>
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
    metadata: {type: "Metadata", UUID: window.crypto.randomUUID(), active: true, name: "", gameID: dbIdNew(), created: Date.now()},
    playerCount: {type: "PlayerCount", UUID: window.crypto.randomUUID(), active: true, quantity: 20},
    gameProgression: {type: "GameProgression", UUID: window.crypto.randomUUID(), active: true, progressId: 1, currentTurn: undefined},
    players: [],
    interactions: []
  }
}

function genSaveJsonTag(gameDataJSON: GameDataJSON): GameDataJSONTag {
  return {
    name: gameDataJSON.metadata.name,
    gameID: gameDataJSON.metadata.gameID,
    gameProgression: gameDataJSON.gameProgression,
    playerRoles: gameDataJSON.players.filter(player => player.role).map(player => player.role!),
    script: undefined,
    created: gameDataJSON.metadata.created
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
        
        savesObjectStore.createIndex('tag', 'tag', {unique: false})
        savesObjectStore.createIndex('data', 'data', {unique: false})
        savesObjectStore.createIndex('history', 'history', {unique: false})
        
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
    const history: HistoryJSON = {head: 0, transactions: []}
    const newItem = {
      data,
      tag,
      history
    }
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.add(newItem, data.metadata.gameID)
    
    objectStoreRequest.onsuccess = () => {
      resolve(newItem.tag)
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}

function getSaveData(db: IDBDatabase, gameID: number): Promise<{data: GameDataJSON, history: HistoryJSON}> {
  
  return new Promise<{data: GameDataJSON, history: HistoryJSON}>((resolve, reject) => {
    
    const transaction = db.transaction(['saves'], 'readonly')
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.get(gameID)
    
    objectStoreRequest.onsuccess = (event: any) => {
      resolve({data: event.target.result.data as GameDataJSON, history: event.target.result.history})
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}

function saveGameData(db: IDBDatabase, gameData: GameDataJSON, history: HistoryJSON): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    
    const transaction = db.transaction(['saves'], 'readwrite')
    
    const tag = genSaveJsonTag(gameData)
    const newItem = {
      data: gameData,
      tag,
      history
    }
    
    const objectStore = transaction.objectStore('saves')
    const objectStoreRequest = objectStore.put(newItem, gameData.metadata.gameID)
    
    objectStoreRequest.onsuccess = () => {
      resolve()
    }
    
    objectStoreRequest.onerror = (err) => {
      reject(err)
    }
    
    transaction.commit()
  })
}