import { useContext, useEffect } from 'react';
import './BoardStateMenu.scss'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import GameStateType from '@/common/GameStateType';

function BoardStateMenu(props: any) {
    
    const gameContext = useContext(GameContext)
    
    function setMode(mode: GameMode) {
        const tmp:GameStateType = JSON.parse(JSON.stringify(gameContext.state));
        tmp.gameMode = mode
        gameContext.setter(tmp)
    }
    
    useEffect(() => {
        const gameMode = gameContext.state.gameMode
        
        document.getElementById('boardStateMenuTab')!.style.backgroundImage = 'linear-gradient(to right, ' + GameMode.color(gameMode)+ ', #00000000)'
        
        document.getElementById('boardStateMenu_night')!.style.backgroundColor = gameMode === GameMode.NIGHT? GameMode.color(GameMode.NIGHT):"grey";
        document.getElementById('boardStateMenu_moveable')!.style.backgroundColor = gameMode === GameMode.MOVING? GameMode.color(GameMode.MOVING):"grey";
    })
    
    return (
        <div id='boardStateMenu'>
            <span id='boardStateMenuTab'></span>
            <div id='boardStateMenu_night' onClick={() => {setMode(GameMode.NIGHT)}}></div>
            <div id='boardStateMenu_moveable' onClick={() => {setMode(GameMode.MOVING)}}></div>
        </div>
    );
}

export default BoardStateMenu;
