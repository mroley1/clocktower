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
    
    useEffect(() => {
        
    })
    
    return (
        <div style={getStyles()} onClick={toggleMenuState} className='token_menu' id={"token_menu_"+json.id}>
            
        </div>
    );
  
}

export default TokenMenu;
