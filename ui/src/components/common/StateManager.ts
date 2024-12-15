import { GameData, GameDataJSON, HistoryJSON, TransactionJSON } from "./GameData";
import { PlayerCount } from "./reactStates/PlayerCount";
import { GameProgression } from "./reactStates/GameProgression";
import { Player } from "./reactStates/Player";
import sha256 from "crypto-js/sha256";
import BaseReactState from "./reactStates/_BaseReactState";
import { Interaction } from "./reactStates/Intereaction";
import { Alignmant } from "./RoleType";
import { Metadata } from "./reactStates/Metadata";
import { ReferenceData } from "./ReferenceData";
import { EffectKit } from "../game/utility/ApplyEffect";
import { getExpireeFromLength, isExpireeExpired } from "./GameProgressionTranslator";

export namespace StateManager {
    
    /*
    
    ^ DO we need to not owner in history? Interactions should handle this
    
    ? Interactions can have effective range where their start and end are recorded making revisiting and ending prematurly easier
    ? possibly mark them inactive to remove from built structure but an interaction scanner is run against JSON? kinda sketch.
    
    */
    
    const classMap = new Map<string, Object>()
    classMap.set("GameProgression", GameProgression.Data)
    classMap.set("PlayerCount", PlayerCount.Data)
    classMap.set("Player", Player.Data)
    classMap.set("Interaction", Interaction.Data)
    classMap.set("Metadata", Metadata.Data)
    
    export class Controller {
        
        gameState: GameData
        private setgameState: React.Dispatch<React.SetStateAction<GameData>>
        
        gameStateJSON: GameDataJSON
        historyController: History
        aggregateData: AggregateData
        
        private saveGameFunc: (gameDataJSON: GameDataJSON, history: HistoryJSON) => void
        private inBatchBuild = false;
        
        private usedUUIDs = new Set<string>()
        private instanceMap = new Map<string, {json: BaseReactState, instance: Object}>()
        
        constructor(gameState: GameData, setGameState: React.Dispatch<React.SetStateAction<GameData>>, history: HistoryJSON, gameStateJSON: GameDataJSON, saveGame: (gameDataJSON: GameDataJSON, history: HistoryJSON) => void, referenceData: ReferenceData.ContextFormat) {
            this.gameState = gameState;
            this.setgameState = setGameState;
            this.gameStateJSON = gameStateJSON;
            this.saveGameFunc = saveGame;
            this.historyController = new History(history.head, history.transactions)
            this.aggregateData = new AggregateData(this, referenceData)
        }
        
        private useSetGameState(newGameState: any) {
            this.gameState = newGameState;
            this.setgameState(newGameState);
        }
        
        public newUUID() {
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
                this.saveGameFunc(this.gameStateJSON, this.historyController.json())
            }
        }
        
        getPlayerFromId = (UUID: string|undefined) => {
            return this.gameStateJSON.players.find((player) => player.UUID == UUID)
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
        
        // used to group separate edits into one build
        batchBuild(callback: () => void, suppressHistory = false) {
            this.batchBuildEntry()
            try {
                callback()
            } catch(e) {
                this.batchBuildExit()
                throw(e)
            }
            this.batchBuildExit(suppressHistory)
        }
        // manually enter or leave batch
        batchBuildEntry() {
            this.inBatchBuild = true
        }
        batchBuildExit(suppressHistory = false) {
            this.inBatchBuild = false
            this.build(suppressHistory)
        }
        
        public build(suppressHistory = false) {
            if (this.inBatchBuild) {return}
            const transactionBuffer: {new: BaseReactState[], old: BaseReactState[]} = {new: [], old: []}
            const callback = (reactState: BaseReactState[], suppressHistory?: boolean) => {
                this.setValues(reactState, suppressHistory)
            }
            
            // expire old interactions
            this.gameStateJSON.interactions.forEach(interaction => {
                if (isExpireeExpired(interaction.end, this.gameStateJSON.gameProgression.progressId)) {
                    interaction.active = false
                }
            })
            
            const newGameState: GameData = this.mapObject(this.gameStateJSON, (obj: BaseReactState) => {
                this.usedUUIDs.add(obj.UUID);
                const storedInstance = this.instanceMap.get(obj.UUID);
                if (obj.active || !storedInstance) {
                    if (storedInstance && !obj.stale) {
                        return storedInstance.instance
                    } else {
                        const newClass = new (classMap.get(obj.type) as any)(obj, callback);
                        obj.stale = false
                        if (!suppressHistory && !obj.type.startsWith("_")) {
                            transactionBuffer.new.push(obj)
                            if (storedInstance) {
                                transactionBuffer.old.push(storedInstance.json)
                            } else {
                                const initilizingObject = structuredClone(obj)
                                initilizingObject.active = false;
                                transactionBuffer.old.push(initilizingObject)
                            }
                        }
                        
                        this.instanceMap.set(obj.UUID, {json: obj, instance: newClass})
                        return newClass
                    }
                }
            })
            
            // history integration
            if (!suppressHistory && this.gameStateJSON && (transactionBuffer.new.length > 0 || transactionBuffer.old.length > 0)) {
                this.historyController.push(transactionBuffer.old, transactionBuffer.new)
            }
            
            this.saveGame()
            this.useSetGameState(newGameState)
        }
        
        public toJSON() {
            throw new Error("Not Implemented yet :(")
        }
    }
    
    // ! unused
    interface Patch {
        UUID: string
        path: string[]
        value: string|number|boolean
    }
    
    export class History {
        
        private _head
        private _transactions
        
        constructor(head: number = 0, transactions: TransactionJSON[] = []) {
            this._head = head
            this._transactions = transactions
        }
        
        json(): HistoryJSON {
            return {
                head: this._head,
                transactions: this._transactions
            }
        }
        
        public undo(): BaseReactState[] {
            if (this._head == 0) { return [] }
            return this._transactions[--this._head].old
        }
        
        public redo(): BaseReactState[] {
            if (this._head == this._transactions.length) { return [] }
            return this._transactions[this._head++].new
        }
        
        private cleanHead() {
            this._transactions = this._transactions.filter((_, i) => i < this._head)
        }
        
        public push(oldValues: BaseReactState[], newValues: BaseReactState[]) {
            this.cleanHead()
            this._transactions.push({
                old: oldValues,
                new: newValues
            } as TransactionJSON)
            this._head++
        }
    }
    
    class AggregateData {
        
        private _controller: Controller
        private _referenceData: ReferenceData.ContextFormat
        
        constructor(controller: Controller, referenceData: ReferenceData.ContextFormat) {
            this._controller = controller
            this._referenceData = referenceData
        }
        
        public players() {
            return this._controller.gameState.players.filter(player =>
                player.role
            ).map(player => 
                player.role
                    ? this._referenceData.script.getRole(player.role)
                    : undefined
            )
        }
        
        addPlayer = () => {
            const newPlayerJSON = {
                type: "Player",
                UUID: this._controller.newUUID(),
                active: true,
                stale: false,
                name: "",
                role: undefined,
                viability: {state: Player.ViabilityState.ALIVE, deadVote: true},
                position: {x: (window.innerWidth / 2) - 75, y: (window.innerHeight / 2) - 75},
                alignment: Alignmant.NONE
            };
            this._controller.gameStateJSON?.players.push(newPlayerJSON);
            this._controller.build();
        }
        
        public availableInteractions(playerData: Player.Data): ReferenceData.Interaction[] {
            const inPlayRoles = this._controller.gameState.players.map(player => player.role)
                .filter(role => role != undefined)
            if (this._controller.gameState.gameProgression.isSetup) {
                return this._referenceData.interactions.getAllInterations(inPlayRoles)
            } else {
                const currentTurnRole = this._controller.getPlayerFromId(this._controller.gameState.gameProgression.currentTurnOwner)?.role
                const interactions = this._referenceData.interactions.getInteractions(currentTurnRole, inPlayRoles)
                    .filter(interaction => 
                        (!interaction.limitToSelf || interaction.role == playerData.role) // if effect is limited to self interaction and player role must match
                        && (interaction.availability != Interaction.EffectAvailability.DAY || this._controller.gameState.gameProgression.isDay) // if effect visibility is only day then it must be day
                        && (interaction.availability != Interaction.EffectAvailability.NIGHT || this._controller.gameState.gameProgression.isNight) // if the effect visibility is night it must be night
                        && (interaction.availability != Interaction.EffectAvailability.SETUP || this._controller.gameState.gameProgression.isSetup) // if effect visibility is setup only it must be setup
                    )
                return interactions
            }
        }
        
        public activeInteractions(playerId: string): Interaction.Data[] {
            return this._controller.gameState.interactions.filter(interaction => interaction.isActive && interaction.effected == playerId)
        }
        
        addInteraction = (interaction: ReferenceData.Interaction, effected: string, role: string|undefined = undefined) => {
            const UUID = this._controller.newUUID()
            const newInteractionJSON = {
                type: "Interaction",
                UUID,
                active: true,
                stale: false,
                owner: this._controller.gameStateJSON.gameProgression.currentTurn,
                end: getExpireeFromLength(interaction.length, this._controller.gameStateJSON.gameProgression.progressId),
                effected: effected,
                interaction: interaction,
                role
            } as Interaction.ReactState
            this._controller.gameStateJSON.interactions.push(newInteractionJSON)
            this._controller.build()
        }
        
        // all effects currently acivive for player
        public activeEffects(playerId: string): Interaction.Effect[] {
            const set = new Set(this.activeInteractions(playerId).map(interaction => interaction.effect))
            return Array.from(set)
        }
        
        // all effects that are shown for player
        public visibleEffects(playerId: string) {
            return this.activeEffects(playerId).filter(effect => Interaction.visibleEffects.includes(effect))
        }
    }
}