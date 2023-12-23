import { useEffect, useContext } from 'react';
import './TokenMenu.scss';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';

function TokenMenu({json, menuState, toggleMenuState}: any) {
    
    const gameContext = useContext(GameContext)
  
    function getStyles() {
        if (menuState.open) {
            var display = "inherit"
            var pointerEvents = "all"
        } else {
            var display = "none"
            var pointerEvents = "none"
        }
        return {
            display,
            pointerEvents
        } as React.CSSProperties
    }
    
    function stopPropagation(event: any) {
        event.stopPropagation()
    }
    
    useEffect(() => {
        
    })
    
    function click() {
        alert("huh")
    }
    
    const icon = require(`@assets/icons/${json.role}.png`)
    interface radSlice {
        title: string
        index: number
        function: any
    }
    const data = new Map<GameMode, radSlice[]>();
    data.set(GameMode.SETUP, [
        {"title": "Notes", "index": 0, "function": click},
        {"title": "Name", "index": 1, "function": click},
        {"title": "Bluffs", "index": 2, "function": click},
        {"title": "Conviction", "index": 3, "function": click},
        {"title": "Role", "index": 4, "function": click},
        {"title": "Alignment", "index": 5, "function": click}
    ])
    data.set(GameMode.NIGHT, [
        {"title": "Notes", "index": 0, "function": click},
        {"title": "Action", "index": 1, "function": click},
        {"title": "Info", "index": 2, "function": click},
        {"title": "Reminders", "index": 3, "function": click},
        {"title": "Role", "index": 4, "function": click},
        {"title": "Alignment", "index": 5, "function": click}
    ])
    data.set(GameMode.NOMINATIONS, [
        {"title": "Nominate", "index": 1, "function": click}
    ])
    data.set(GameMode.DAY, [
        {"title": "Notes", "index": 0, "function": click}
    ])
    
    const slices = data.get(menuState.orgMode)?.map((radSlice) => <div className={"areas area_" + radSlice.index} key={radSlice.index} data-title={radSlice.title} onClick={radSlice.function}></div>)
    
    return (
        <div style={getStyles()} onClick={toggleMenuState} className='token_menu' id={"token_menu_"+json.id}>
            <div id={"radial_menu_"+json.id} onClick={stopPropagation} className='radial_menu'>
                {slices}
            </div>
            <div id={"radial_icon_"+json.id} onClick={stopPropagation} style={{left: json.xpos, top: json.ypos}} className='radial_icon'>
                <img src={icon}></img>
            </div>
        </div>
    );
  
}

export default TokenMenu;
