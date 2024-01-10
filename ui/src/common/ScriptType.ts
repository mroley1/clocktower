

export default interface ScriptType {
    meta: {
        author: string,
        name: string,
        description: string,
        gameType: string,
        difficulty: number,
        date: string
    }
    roles: string[]
        recommendedFabled: string[]
    customJinxes: string[]
}