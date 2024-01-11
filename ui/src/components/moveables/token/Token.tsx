import { createContext, useContext, useState } from 'react';
import './Token.scss';
import TokenContextType from '@Common/TokenContextType';
import Player from '@Common/Player'
import { GameContext } from '@/components/App';
import { CLICKABLE, GameMode, IS_NIGHT, MENU_OPEN, MOVABLE } from '@/common/GameModes';
import TokenMenu from './TokenMenu';
import { Alignment } from '@/common/Alignment';
import GameStateType from '@/common/GameStateType';
import RadialMenuState from '@/common/RadialMenuState';
import { CAN_VOTE, IS_ALIVE, Viability } from '@/common/Viability';
import { AilmentTypes } from '@/common/AilmentTypes';



export const TokenContext = createContext<TokenContextType>({
  json: {
    id: "",
    role: null,
    name: "",
    xpos: 0,
    ypos: 0,
    pubNotes: "",
    privNotes: "",
    viability: Viability.ALIVE,
    ailments: [],
    mad: null,
    convinced: null,
    bluffs: [],
    alignment: Alignment.STORYTELLER
  },
  menuState: {
    open: false,
    dialogue: "none"
  },
  util: {
    setPlayerData: () => {},
    toggleMenuState: () => {},
    closeMenu: () => {}
  }
});

function Token(props: any) {
  
  const gameContext = useContext(GameContext)
  const json: Player = props.json

  const icon = require(`@assets/icons/${json.role?.id}.png`)
  
  const startingMenuState: RadialMenuState = {"open": false, dialogue: "none"}
  const [menuState, setMenuState] = useState(startingMenuState)
  
  function getStyles() {
    return {
      left: json.xpos,
      top: json.ypos
    }
  }
  
  const handleClick = (event: object) => {
    if (!MENU_OPEN.includes(gameContext.state.gameMode)) {
      return
    }
    toggleMenuState()
  }
  
  function toggleMenuState(dialogueName = "none") {
    var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
    if (menuState.open) {
      tmp.open = false
    } else {
      tmp.open = true
      tmp.dialogue = dialogueName
    }
    setMenuState(tmp)
  }
  
  function closeMenu() {
    var tmp: RadialMenuState = JSON.parse(JSON.stringify(menuState));
    tmp.open = false
    setMenuState(tmp)
  }
  
  function setPlayerData(json: Player) {
    var tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
    tmp.tokens[tmp.tokens.findIndex((token)=>token.id === json.id)] = json
    gameContext.setter(tmp)
  }
  
  
  const tokenContext: TokenContextType = {
    json,
    menuState,
    util: {
      setPlayerData,
      toggleMenuState,
      closeMenu
    }
  }
  
  const tokenVisibility = (()=>{
    if (IS_NIGHT.includes(gameContext.state.gameMode)) {
      return "night"
    } else {
      return "day"
    }
  })()
  
  const playerViability = (()=>{
    if (tokenVisibility === "day") {
      return Viability[tokenContext.json.viability].toString().toLowerCase()
    } else {
      return ""
    }
  })()
  
  const tokenCursor = (()=>{
    if (MOVABLE.includes(gameContext.state.gameMode)) {
      return "grabbable"
    } else if (CLICKABLE.includes(gameContext.state.gameMode)) {
      return "clickable"
    }
  })()
  
  const viability = (()=>{
    if (IS_ALIVE.includes(tokenContext.json.viability)) {
      return "alive"
    } else {
      return "dead"
    }
  })()
  
  const ailments = json.ailments.map((ailment) => {
    return <div key={ailment.type} className={'ailment '+ ailment.type.toString().toLowerCase()}></div>
  })
  
  const canVote = (()=>{
    if (gameContext.state.gameMode===GameMode.NOMINATIONS && gameContext.state.quickAccessSettings.nominationHelp) {
      if (CAN_VOTE.includes(tokenContext.json.viability)) {
        return <div className='vote_button yes'></div>
      } else {
        return <div className='vote_button no'></div>
      }
    } else {
      return null
    }
  })()
  
  const alignment = (() => {
    if (json.alignment !== json.role?.alignment) {
      return <div className={'alignment '+ Alignment[json.alignment].toString().toLowerCase()}></div>
    } else {
      return null
    }
  })()
  
  const convinced = (() => {
    if (json.convinced !== null) {
      const icon = require(`@assets/icons/${json.convinced}.png`)
      return <div className='convinced'>
        <img src={icon}></img>
      </div>
    } else {
      return null
    }
  })()
  
  const onBlock = (() => {
    if (gameContext.state.gameMode === GameMode.NOMINATIONS && gameContext.state.onBlock === json.id) {
      return <div className='on_block'></div>
    } else {
      return null
    }
  })()
  
  return (
    <TokenContext.Provider value={tokenContext}>
      <div
        id={"token_"+tokenContext.json.id}
        onPointerDown={props.createDragEvent(tokenContext.json.id)}
        onClick={handleClick}
        style={getStyles()}
        className={`token_container ${tokenVisibility} ${playerViability} ${tokenCursor}`}
        >
          <div className='vote'></div>
          {canVote}
          <div style={{display: tokenVisibility === "night" ? "inherit" : "none", pointerEvents: "none"}}>
            <img src={icon} className={viability}></img>
            {ailments}
            {alignment}
            {convinced}
          </div>
          {onBlock}
          <div className='token_nametag'>{json.name}</div>
          <TokenMenu menuState={menuState} toggleMenuState={toggleMenuState} />
      </div>
    </TokenContext.Provider>
  );
}

export default Token;
