import { GameDataJSON, GameDataJSONTag, HistoryJSON } from "./common/GameData"

const dbPromise = initDatabase()

export function newSaveJSON(): GameDataJSON {
    return {
        metadata: {type: "Metadata", UUID: window.crypto.randomUUID(), active: true, stale: false, name: "", gameID: dbIdNew(), created: Date.now()},
        playerCount: {type: "PlayerCount", UUID: window.crypto.randomUUID(), active: true, stale: false, quantity: 20},
        gameProgression: {type: "GameProgression", UUID: window.crypto.randomUUID(), active: true, stale: false, progressId: 1},
        players: [],
        interactions: [],
        _global: {type: "_Global", UUID: window.crypto.randomUUID(), active: true, stale: false, currentSelected: undefined}
    }
}
  
export function genSaveJsonTag(gameDataJSON: GameDataJSON): GameDataJSONTag {
    return {
        name: gameDataJSON.metadata.name,
        gameID: gameDataJSON.metadata.gameID,
        gameProgression: gameDataJSON.gameProgression.progressId,
        playerRoles: gameDataJSON.players.filter(player => player.role).map(player => player.role!),
        script: undefined,
        created: gameDataJSON.metadata.created
    }
}
  
export function dbIdNew() {
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

export function initDatabase() {
    console.log("init")
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

export function getSaves(): Promise<GameDataJSONTag[]> {
    return dbPromise.then(db => {
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
    })
}

export function newSave() {
    console.log("h")
    return dbPromise.then(db => {
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
                console.error(newItem)
                reject(err)
            }
            
            transaction.commit()
        })
    })
}

export async function getSaveData(gameID: number): Promise<{data: GameDataJSON, history: HistoryJSON}> {

    return dbPromise.then(db => {
        return new Promise<{data: GameDataJSON, history: HistoryJSON}>((resolve, reject) => {
            
            const transaction = db.transaction(['saves'], 'readonly')
            
            const objectStore = transaction.objectStore('saves')
            const objectStoreRequest = objectStore.get(gameID)
            
            objectStoreRequest.onsuccess = (event: any) => {
                const result = event.target.result
                resolve({data: result.data as GameDataJSON, history: result.history})
            }
            
            objectStoreRequest.onerror = (err) => {
                reject(err)
            }
            
            transaction.commit()
        })
    })
}

export function saveGameData(gameData: GameDataJSON, history: HistoryJSON): Promise<void> {
    return dbPromise.then(db => {
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
    })
}