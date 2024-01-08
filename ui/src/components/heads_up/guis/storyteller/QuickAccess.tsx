import { ReactElement, useContext } from 'react';
import './QuickAccess.scss';
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import NominationHelp from './QuickAccessItems/NominationHelp';

function QuickAccess() {
    
    const gameContext = useContext(GameContext)
    
    const map = new Map<GameMode, ReactElement[]>()
    map.set(GameMode.NOMINATIONS, [
        <NominationHelp key='nominationHelp'></NominationHelp>
    ])
    
    const buttons = (() => {
        if (map.has(gameContext.state.gameMode)) {
            return map.get(gameContext.state.gameMode) 
        } else {
            return null
        }
    })()
    
    return (
        <>
            {buttons}
        </>
    );
}

export default QuickAccess;
