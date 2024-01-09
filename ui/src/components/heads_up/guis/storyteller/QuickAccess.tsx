import { ReactElement, useContext } from 'react';
import './QuickAccess.scss';
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import NominationHelp from './QuickAccessItems/NominationHelp';

function QuickAccess() {
    
    const gameContext = useContext(GameContext)
    
    // define what duttons should be active during which gamemode
    const map = new Map<GameMode, ReactElement[]>()
    map.set(GameMode.NOMINATIONS, [
        <NominationHelp key='nominationHelp'></NominationHelp>
    ])
    
    // compile buttons to display currently
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
