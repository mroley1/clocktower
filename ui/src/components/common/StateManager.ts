import { GameData, GameDataJSON } from "./GameData";
import { PlayerCount } from "./reactStates/PlayerCount";
import { GameProgression } from "./reactStates/GameProgression";
import { Player } from "./reactStates/Player";
import sha256 from "crypto-js/sha256";
import BaseReactState from "./reactStates/_BaseReactState";
import { Interaction } from "./reactStates/Intereaction";
import { Transaction } from "./reactStates/Transaction";
import { Alignmant } from "./RoleType";
import { Metadata } from "./reactStates/Metadadta";
import { useCallback } from "react";

export namespace StateManager {
    
    const classMap = new Map<string, Object>()
    classMap.set("GameProgression", GameProgression.Data)
    classMap.set("PlayerCount", PlayerCount.Data)
    classMap.set("Player", Player.Data)
    classMap.set("Interaction", Interaction.Data)
    classMap.set("Transaction", Transaction.Data)
    classMap.set("Metadata", Metadata.Data)
    
    export class Controller {
        
        gameState: GameData
        private setgameState: React.Dispatch<React.SetStateAction<GameData>>
        
        gameStateJSON: GameDataJSON
        history: History
        
        private saveGameFunc: (gameDataJSON: GameDataJSON) => void
        private inBatchBuild = false;
        
        private usedUUIDs = new Set<string>()
        private instanceMap = new Map<string, {json: BaseReactState, jsonHash: string, instance: Object}>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, gameStateJSON: GameDataJSON, saveGame: (gameDataJSON: GameDataJSON) => void) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = gameStateJSON;
            this.saveGameFunc = saveGame;
            this.history = new History(this)
        }
        
        private useSetGameState(newGameState: any) {
            this.gameState = newGameState;
            this.setgameState(newGameState);
        }
        
        private newUUID() {
            let UUID = null;
            while (!UUID || this.usedUUIDs.has(UUID)) {
                UUID = window.crypto.randomUUID();
            }
            this.usedUUIDs.add(UUID);
            return UUID;
        }
        
        private mapObject(obj: any, fn: (obj: BaseReactState) => any): any {
            if (obj.hasOwnProperty("type")) {
                return fn(obj)
            }
            let mapped: any
            if (Array.isArray(obj)) {
                mapped = [];
                obj.forEach((member) => {
                    const mpObj = this.mapObject(member, fn)
                    if (mpObj) {
                        mapped.push(mpObj);
                    }
                })
            } else {
                mapped = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (typeof value != "object") {
                        mapped[key] = value;
                    } else {
                        mapped[key] = this.mapObject(value, fn);
                    }
                }
            }
            return mapped;
        }
        
        public saveGame() {
            if (this.gameStateJSON) {
                this.saveGameFunc(this.gameStateJSON)
            }
        }
        
        private setValues(values: BaseReactState[], suppressHistory?: boolean) {
            const valuesMap = new Map<string, BaseReactState>();
            values.forEach(value => valuesMap.set(value.UUID, value))
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                if (valuesMap.has(obj.UUID)) {
                    return valuesMap.get(obj.UUID);
                } else {
                    return obj;
                }
            })
            this.build(suppressHistory);
        }
        
        // ! unused for later improvment to use patches instead of full states in history
        applyPatches = (patches: Patch[]) => {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                patches.forEach((patch) => {
                    if (obj.UUID == patch.UUID) {
                        function setValue(obj: any, value: any, path: string[]) {
                            if (path.length == 1) {
                                return obj[path[1]] = value
                            } else {
                                setValue(obj[path.pop()!], value, path)
                            }
                        }
                        if (patch.path.length > 0) {
                            setValue(obj, patch.value, patch.path)
                        }
                    }
                })
                this.build(true);
            })
        }
        
        addPlayer = () => {
            const newPlayerJSON = {
                type: "Player",
                UUID: this.newUUID(),
                active: true,
                name: "",
                role: undefined,
                viability: {state: Player.ViabilityState.ALIVE, deadVote: true},
                position: {x: (window.innerWidth / 2) - 75, y: (window.innerHeight / 2) - 75},
                alignment: Alignmant.NONE
            };
            this.gameStateJSON?.players.push(newPlayerJSON);
            this.build();
        }
        
        addInteraction = () => {
            const newInteractionJSON = {
                type: "Interaction",
                UUID: this.newUUID(),
                active: true,
                owner: "this._owner",
                bound: true,
                name: "this._name",
                length: 0,
                effect: 0,
                effected: "this._effected"
            }
            this.gameStateJSON.interactions.push(newInteractionJSON)
            this.build();
        }
        
        // used to group separate edits into one build
        batchBuild(callback: () => void) {
            this.batchBuildEntry()
            callback()
            this.batchBuildExit()
        }
        // manually enter or leave batch
        batchBuildEntry() {
            this.inBatchBuild = true
        }
        batchBuildExit() {
            this.inBatchBuild = false
            this.build()
        }
        
        public build(suppressHistory = false) {
            if (this.inBatchBuild) {return}
            const transactionBuffer: {new: BaseReactState[], old: BaseReactState[]} = {new: [], old: []}
            const callback = (reactState: BaseReactState[], suppressHistory?: boolean) => {
                this.setValues(reactState, suppressHistory)
            }
            
            if (!suppressHistory) {
                while (this.gameStateJSON.transactions.length > this.gameStateJSON.metadata.historyHead) {
                    this.gameStateJSON.transactions.pop()
                }
            }
            
            const newGameState = this.mapObject(this.gameStateJSON, (obj: BaseReactState) => {
                this.usedUUIDs.add(obj.UUID);
                const storedInstance = this.instanceMap.get(obj.UUID);
                if (obj.active || !storedInstance) {
                    if (storedInstance) {
                        console.log(sha256(JSON.stringify(obj)).toString() + " == " + storedInstance!.jsonHash + ": ", sha256(JSON.stringify(obj)).toString() == storedInstance!.jsonHash)
                    }
                    if (storedInstance && sha256(JSON.stringify(obj)).toString() == storedInstance.jsonHash) {
                        return storedInstance.instance
                    } else {
                        const newClass = new (classMap.get(obj.type) as any)(obj, callback);
                        console.log(newClass)
                        if (!suppressHistory) {
                            transactionBuffer.new.push(obj)
                            if (storedInstance) {
                                transactionBuffer.old.push(storedInstance.json)
                            } else {
                                const initilizingObject = structuredClone(obj)
                                initilizingObject.active = false;
                                transactionBuffer.old.push(initilizingObject)
                            }
                        }
                        
                        this.instanceMap.set(obj.UUID, {json: obj, jsonHash: sha256(JSON.stringify(obj)).toString(), instance: newClass})
                        return newClass
                    }
                }
            })
            
            if (!suppressHistory && this.gameStateJSON && (transactionBuffer.new.length > 0 || transactionBuffer.old.length > 0)) {
                const transactionJSON: Transaction.ReactState = {
                    type: "Transaction",
                    UUID: this.newUUID(),
                    active: true,
                    newValues: transactionBuffer.new,
                    oldValues: transactionBuffer.old
                }
                transactionBuffer.new = []
                transactionBuffer.old = []
                this.gameStateJSON.transactions.push(transactionJSON);
                const newClass = new Transaction.Data(transactionJSON, callback)
                newGameState.transactions.push(newClass);
                this.instanceMap.set(transactionJSON.UUID, {json: transactionJSON, jsonHash: sha256(JSON.stringify(transactionJSON)).toString(), instance: newClass})
                this.gameStateJSON.metadata.historyHead++
                console.log(this.instanceMap)
            }
            
            
            this.saveGame()
            this.useSetGameState(newGameState)
        }
        
        public toJSON() {
            throw new Error("Not Implemented yet :(")
        }
    }
    
    interface Patch {
        UUID: string
        path: string[]
        value: string|number|boolean
    }
    
    class History {
        
        controller: StateManager.Controller
        
        constructor (controller: StateManager.Controller) {
            this.controller = controller
        }
        
        undo = () => {
            if (this.controller.gameStateJSON.metadata.historyHead > 0) {
                this.controller.gameState.transactions[--this.controller.gameStateJSON.metadata.historyHead].revert();
                return true;
            } else {
                return false;
            }
        }
        
        redo = () => {
            if (this.controller.gameStateJSON.metadata.historyHead < this.controller.gameState.transactions.length) {
                this.controller.gameState.transactions[this.controller.gameStateJSON.metadata.historyHead++].apply();
                return true;
            } else {
                return false;
            }
        }
        
        toJSON() {
            return JSON.stringify({
                head: this.controller.gameStateJSON.metadata.historyHead
            })
        }
    }
    
    class Interactions {}
}