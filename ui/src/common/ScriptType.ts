

export default interface ScriptType {
    meta: {
        author: string,
        name: string,
        description: string,
        gameType: string,
        difficulty: number
    }
    roles: string[]
    recommendedFabled: string[]
}