import { GameData, GameDataJSON } from "./GameData";
import { PlayerCount } from "./reactStates/PlayerCount";
import { GameProgression } from "./reactStates/GameProgression";
import { Player } from "./reactStates/Player";
import sha256 from "crypto-js/sha256";
import BaseReactState from "./reactStates/_BaseReactState";
import { Interaction } from "./reactStates/Intereaction";

export namespace StateManager {
    
    const classMap = new Map<string, Object>()
    classMap.set("GameProgression", GameProgression.Data)
    classMap.set("PlayerCount", PlayerCount.Data)
    classMap.set("Player", Player.Data)
    classMap.set("Interaction", Interaction.Data)
    
    export class Controller {
        
        gameState: GameData
        setgameState: React.Dispatch<React.SetStateAction<GameData>>
        
        gameStateJSON: GameDataJSON|undefined
        history: History
        
        private usedUUIDs = new Set<string>()
        private instanceMap = new Map<string, {json: BaseReactState, jsonHash: string, instance: Object}>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, gameStateJSON: GameDataJSON, transactions?: TransactionJSON[]) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = gameStateJSON;
            this.history = new History(this, transactions)
        }
        
        private useSetGameState(newGameState: any) {
            this.setgameState(newGameState)
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
                    mapped[key] = this.mapObject(value, fn);
                }
            }
            return mapped;
        }
        
        public setValue(value: BaseReactState, suppressHistory?: boolean) {
            this.gameStateJSON = this.mapObject(this.gameStateJSON, obj => {
                if (obj.UUID == value.UUID) {
                    return value;
                } else {
                    return obj;
                }
            })
            this.build(suppressHistory);
        }
        
        public setValues(values: BaseReactState[], suppressHistory?: boolean) {
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
        
        addPlayer = () => {
            const newPlayerJSON = {
                type: "Player",
                UUID: this.newUUID(),
                active: true,
                name: "",
                role: 0,
                viability: {state: Player.ViabilityState.ALIVE, deadVote: true},
                position: {x: 0, y: 0}
            };
            this.gameStateJSON?.players.push(newPlayerJSON);
            this.build();
        }
        
        public build(suppressHistory = false) {
            const transactionBuffer: {new: BaseReactState[], old: BaseReactState[]} = {new: [], old: []}
            const newGameState = this.mapObject(this.gameStateJSON, (obj: BaseReactState) => {
                this.usedUUIDs.add(obj.UUID);
                const storedInstance = this.instanceMap.get(obj.UUID);
                if (obj.active || !storedInstance) {
                    if (storedInstance && sha256(JSON.stringify(obj)).toString() == storedInstance.jsonHash) {
                        return storedInstance.instance
                    } else {
                        const callback = (reactState: BaseReactState) => {
                            this.setValue(reactState)
                        }
                        const newClass = new (classMap.get(obj.type) as any)(obj, callback);
                        
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
            
            if (!suppressHistory) {
                this.history.logEvent(new Transaction({newValues: transactionBuffer.new, oldValues: transactionBuffer.old}))
            }
            
            this.useSetGameState(newGameState)
        }
        
        public toJSON() {
            throw new Error("Not Implemented yet :(")
        }
    }
    
    class History {
        controller: Controller
        stack: Transaction[] = []
        private _head = 0
        
        constructor(controller: Controller, transactions?: TransactionJSON[]) {
            this.controller = controller
            if (transactions) {
                this.stack = transactions.map((transaction) => new Transaction(transaction))
            }
        }
        
        undo = () => {
            if (this._head > 0) {
                this._head--;
                this.stack[this._head].revert(this.controller);
                return true;
            } else {
                return false;
            }
        }
        
        redo = () => {
            if (this._head < this.stack.length) {
                this.stack[this._head].apply(this.controller);
                this._head++;
                return true;
            } else {
                return false;
            }
        }
        
        cleanHead() {
            while (this.stack.length > this._head) {
                this.stack.pop()
            }
        }
        
        logEvent(transaction: Transaction) {
            this.cleanHead()
            this.stack.push(transaction)
            this._head++
        }
        
        toJSON() {
            return JSON.stringify({
                stack: JSON.stringify(this.stack),
                head: this._head
            })
        }
    }
    
    export interface TransactionJSON {
        newValues: BaseReactState[]
        oldValues: BaseReactState[]
    }
    
    class Transaction {
        newValues: BaseReactState[]
        oldValues: BaseReactState[]
        
        constructor(transactionJson: TransactionJSON) {
            this.newValues = transactionJson.newValues
            this.oldValues = transactionJson.oldValues
        }
        
        public revert(controller: Controller) {
            controller.setValues(this.oldValues, true);
        }
        
        public apply(controller: Controller) {
            controller.setValues(this.newValues, true);
        }
        
        public toJSON() {
            return JSON.stringify({
                newValue: this.newValues,
                oldValue: this.oldValues
            })
        }
    }
}