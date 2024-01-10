import { createContext, useContext, useState } from 'react';
import './HeadsUp.scss'
import BoardStateMenu from './guis/BoardStateMenu';
import { GameContext } from '../App';
import Storyteller from './guis/storyteller/Storyteller';
import HeadsUpContextType from '@/common/HeadsUpContextType';
import RadialMenuState from '@/common/RadialMenuState';
import { IS_NIGHT, GameMode } from '@/common/GameModes';


const startingMenuState: RadialMenuState = {"open": false, dialogue: "none"}
export const HeadsUpContext = createContext<HeadsUpContextType>({
  state: {
    menuState: startingMenuState
  },
  util: {
    toggleRadialMenuState: ()=>{}
  }
})

function HeadsUp(props: any) {
  
  const gameContext = useContext(GameContext)
  
    const [menuState, setMenuState] = useState(startingMenuState)
    
    const toggleRadialMenuState = ( set: boolean | null = null, dialogueName = "none") => {
        var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
        if (set === null) {
            set = !tmp.open
        }
        if (tmp.open) {
            tmp.open = false
          } else {
            tmp.open = true
            tmp.dialogue = dialogueName
          }
          setMenuState(tmp)
    }
  
  
  const initialState: HeadsUpContextType = {
    state: {
      menuState
    },
    util: {
      toggleRadialMenuState
    }
  }
  
  return (
    <HeadsUpContext.Provider value={initialState}>
      <div id='heads_up'>
          <BoardStateMenu />
          <Storyteller />
      </div>
    </HeadsUpContext.Provider>
  );
}

export default HeadsUp;
