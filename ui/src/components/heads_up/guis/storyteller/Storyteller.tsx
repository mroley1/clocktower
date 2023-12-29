import { useContext, useState } from 'react';
import './Storyteller.scss'
import { GameContext } from '@/components/App';
import RadialMenuState from '@/common/RadialMenuState';
import { GameMode, IS_NIGHT } from '@/common/GameModes';
import StorytellerMenu from './StorytellerMenu';

function Storyteller(props: any) {
    
    const gameContext = useContext(GameContext)
    
    const startingMenuState: RadialMenuState = {"open": false, "orgMode": null, dialogue: "none"}
    const [menuState, setMenuState] = useState(startingMenuState)
    
    const toggleMenuState = (dialogueName = "none", set: boolean | null = null) => {
        var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
        if (set === null) {
            set = !tmp.open
        }
        if (tmp.open) {
            tmp.open = false
            gameContext.util.setMode(tmp.orgMode)
          } else {
            tmp.open = true
            tmp.dialogue = dialogueName
            tmp.orgMode = gameContext.state.gameMode
            if (IS_NIGHT.includes(gameContext.state.gameMode)) {
              gameContext.util.setMode(GameMode.RADIAL)
            } else {
              gameContext.util.setMode(GameMode.BLINDRADIAL)
            }
          }
          setMenuState(tmp)
    }
    
    const handleClick = (event: object) => {
        toggleMenuState("none", true)
      }
    
    return (
        <div id='storytellerMenu'>
            <div>
              <div id='storytellerMenuBackingTop' className='backing'>
                <div className='button_container' onClick={handleClick}>
                    <div className='icon'></div>
                </div>
              </div>
              <div id='storytellerMenuBackingBottom' className='backing'>
                <div className='button'></div>
                <div className='button'></div>
                <div className='button'></div>
              </div>
            </div>
          <StorytellerMenu menuState={menuState} toggleMenuState={toggleMenuState} />
        </div>
    );
}

export default Storyteller;
