
interface EphemeralContextValue {
    currentTurnOwner: string
}

interface EphemeralContext {
    value: EphemeralContextValue
    setter: React.Dispatch<React.SetStateAction<EphemeralContextValue>>
}
