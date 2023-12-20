import { useContext, useEffect } from 'react';
import './BoardStateMenu.scss'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import GameStateType from '@/common/GameStateType';
import MaintainenceImg from '@HeadsUpAssets/board_state/maintainance';
import MoveImg from '../assets/board_state/move';
import NightImg from '../assets/board_state/night';

function BoardStateMenu(props: any) {
    
    const gameContext = useContext(GameContext)
    
    function setMode(mode: GameMode) {
        const tmp:GameStateType = JSON.parse(JSON.stringify(gameContext.state));
        tmp.gameMode = mode
        gameContext.setter(tmp)
    }
    
    function colorFind(mode: GameMode) {
        if (gameContext.state.gameMode === mode) {
            let color = GameMode.color(mode)
            return {backgroundColor: color.background, color: color.foreground}
        } else {
            return {backgroundColor: "grey", color: "black"}
        }
    }
    
    useEffect(() => {
        let gameMode = gameContext.state.gameMode
        if (gameMode === undefined) {
            gameMode = GameMode.SETUP
        }
        
        
        document.getElementById('boardStateMenuTab')!.style.backgroundImage = 'linear-gradient(to right, ' + GameMode.color(gameMode).background + ', #00000000)'
        
    })
    
    return (
        <div id='boardStateMenu'>
            <span id='boardStateMenuTab'></span>
            <div id='boardStateMenu_night' style={colorFind(GameMode.NIGHT)} onClick={() => {setMode(GameMode.NIGHT)}}>
                <NightImg fill={colorFind(GameMode.NIGHT).color}/>
            </div>
            <div id='boardStateMenu_moveable' style={colorFind(GameMode.MOVING)} onClick={() => {setMode(GameMode.MOVING)}}>
                <MoveImg fill={colorFind(GameMode.MOVING).color}/>
            </div>
            <div id='boardStateMenu_setup' style={colorFind(GameMode.SETUP)} onClick={() => {setMode(GameMode.SETUP)}}>
                <MaintainenceImg fill={colorFind(GameMode.MOVING).color}/>
            </div>
        </div>
    );
}

export default BoardStateMenu;
