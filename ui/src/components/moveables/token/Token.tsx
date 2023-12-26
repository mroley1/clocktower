import { createContext, useContext, useState } from 'react';
import './Token.scss';
import TokenContextType from '@Common/TokenContextType';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { GameMode } from '@/common/GameModes';
import TokenMenu from './TokenMenu';
import { Alignment } from '@/common/Alignment';
import GameStateType from '@/common/GameStateType';

export const MOVABLE = [GameMode.MOVING]
export const CLICKABLE = [GameMode.NIGHT, GameMode.PLAYERSELECT, GameMode.ROLESELECT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]
export const TokenContext = createContext<TokenContextType>({
  json: {
    id: -1,
    role: undefined,
    name: "",
    xpos: 0,
    ypos: 0,
    pubNotes: "",
    privNotes: "",
    ailments: [],
    mad: null,
    convinced: null,
    bluffs: [],
    alignment: Alignment.STORYTELLER
  },
  util: {
    setPlayerData: () => {},
  }
});

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json
  const MENU_OPEN = [GameMode.NIGHT, GameMode.SETUP, GameMode.NOMINATIONS, GameMode.DAY]
  const icon = require(`@assets/icons/${json.role}.png`)
  
  interface MenuState {
    open: boolean
    orgMode: GameMode
  }
  const startingMenuState: MenuState = {"open": false, "orgMode": GameMode.NIGHT}
  const [menuState, setMenuState] = useState(startingMenuState)
  
  function getStyles() {
    if (MOVABLE.includes(gameContext.state.gameMode)) {
      var cursor = "grab"
    } else if (CLICKABLE.includes(gameContext.state.gameMode)) {
      var cursor = "pointer"
    } else {
      var cursor = "unset"
    }
    return {
      left: json.xpos,
      top: json.ypos,
      cursor
    }
  }
  
  const handleClick = (event: object) => {
    if (!MENU_OPEN.includes(gameContext.state.gameMode)) {
      return
    }
    toggleMenuState()
  }
  
  function toggleMenuState() {
    var tmp: MenuState = JSON.parse(JSON.stringify(menuState));
    if (menuState.open) {
      tmp.open = false
      gameContext.util.setMode(tmp.orgMode)
    } else {
      tmp.open = true
      tmp.orgMode = gameContext.state.gameMode
      gameContext.util.setMode(GameMode.RADIAL)
    }
    setMenuState(tmp)
  }
  
  function setPlayerData(json: Player) {
    var tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.tokens[json.id] = json
    gameContext.setter(tmp)
  }
  
  
  const tokenContext: TokenContextType = {
    json,
    util: {
      setPlayerData
    }
  }
  
  const ailments = json.ailments.map((ailment) => {
    return <div key={ailment} className={'ailment '+ ailment.toString().toLowerCase()}></div>
  })
  
  const alignment = (() => {
    if (json.alignment === json.alignment) {
      return <div className={'alignment '+ json.alignment.toString().toLowerCase()}></div>
    } else {
      return <></>
    }
  })()
  
  const convinced = (() => {
    if (json.convinced !== null) {
      const icon = require(`@assets/icons/${json.convinced}.png`)
      return <div className='convinced'>
        <img src={icon}></img>
      </div>
    } else {
      return <></>
    }
  })()
  
  return (
    <TokenContext.Provider value={tokenContext}>
      <div
        id={"token_"+tokenContext.json.id}
        onMouseDown={props.createDragEvent(tokenContext.json.id)}
        onTouchStart={props.createDragEvent(tokenContext.json.id)}
        onClick={handleClick}
        style={getStyles()}
        className='token_container'
        >
          <img src={icon}></img>
          {ailments}
          {alignment}
          {convinced}
          <div className='token_nametag'>{json.name}</div>
          <TokenMenu menuState={menuState} toggleMenuState={toggleMenuState} />
      </div>
    </TokenContext.Provider>
  );
}

export default Token;
