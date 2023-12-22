import { useEffect } from 'react';
import './TokenMenu.scss';
import Player from '@Common/Player'

function TokenMenu({json, menuState, toggleMenuState}: any) {
  
    function getStyles() {
        if (menuState) {
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
    
    const icon = require(`@assets/icons/${json.role}.png`)
    
    return (
        <div style={getStyles()} onClick={toggleMenuState} className='token_menu' id={"token_menu_"+json.id}>
            <div id={"radial_menu_"+json.id} onClick={stopPropagation} className='radial_menu'>
                <div className='areas area_0' data-title='area 0'></div>
                <div className='areas area_1' data-title='action'></div>
                <div className='areas area_2' data-title='area 2'></div>
                <div className='areas area_3' data-title='area 3'></div>
                <div className='areas area_4' data-title='info'></div>
                <div className='areas area_5' data-title='area 5'></div>
            </div>
            <div id={"radial_icon_"+json.id} onClick={stopPropagation} style={{left: json.xpos, top: json.ypos}} className='radial_icon'>
                <img src={icon}></img>
            </div>
        </div>
    );
  
}

export default TokenMenu;
