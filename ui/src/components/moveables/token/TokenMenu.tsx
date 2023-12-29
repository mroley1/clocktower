import { useContext, useState, useEffect } from 'react';
import './TokenMenu.scss';
import { GameMode } from '@/common/GameModes';
import React from 'react';
import NotesChange from './menus/NotesChange';
import Action from './menus/Action';
import NameChange from './menus/NameChange';
import BluffsChange from './menus/BluffsChange';
import ConvictionChange from './menus/ConvictionChange';
import RoleChange from './menus/RoleChange';
import AlignmentChange from './menus/AlignmentChange';
import Info from './menus/Info';
import RemindersChange from './menus/RemindersChange';
import Nominate from './menus/Nominate';
import { TokenContext } from './Token';
import OnBlockSet from './menus/OnBlockSet';
import Execute from './menus/Execute';
import Vote from './menus/Vote';
import { GameContext } from '@/components/App';
import { Viability } from '@/common/Viability';

function TokenMenu({menuState, toggleMenuState}: any) {
    
    const [dilogueName, setDialogueName] = useState("none")
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
  
    function getStyles() {
        var display = "none"
        var pointerEvents = "none"
        if (menuState.open) {
            display = "inherit"
            pointerEvents = "all"
        }
        return {
            display,
            pointerEvents
        } as React.CSSProperties
    }
    
    function stopPropagation(event: any) {
        event.stopPropagation()
    }
    
    function setDialogue(type: string) {
        setDialogueName(type)
    }
    
    const icon = require(`@assets/icons/${tokenContext.json.role?.id}.png`)
    
    interface radSlice {
        title: string
        index: number
        function: any
    }
    const data = new Map<GameMode, radSlice[]>();
    data.set(GameMode.SETUP, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
        {"title": "Name", "index": 1, "function": ()=>{setDialogue("name")}},
        {"title": "Bluffs", "index": 2, "function": ()=>{setDialogue("buffs")}},
        {"title": "Conviction", "index": 3, "function": ()=>{setDialogue("conviction")}},
        {"title": "Role", "index": 4, "function": ()=>{setDialogue("role")}},
        {"title": "Alignment", "index": 5, "function": ()=>{setDialogue("alignment")}}
    ])
    data.set(GameMode.NIGHT, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
        {"title": "Action", "index": 1, "function": ()=>{setDialogue("action")}},
        {"title": "Info", "index": 2, "function": ()=>{setDialogue("info")}},
        {"title": "Reminders", "index": 3, "function": ()=>{setDialogue("reminders")}},
        {"title": "Role", "index": 4, "function": ()=>{setDialogue("role")}},
        {"title": "Alignment", "index": 5, "function": ()=>{setDialogue("alignment")}}
    ])
    data.set(GameMode.NOMINATIONS, [
        {"title": "Nominate", "index": 1, "function": ()=>{setDialogue("nominate")}},
        {"title": "On Block", "index": 3, "function": ()=>{setDialogue("onblock")}},
        {"title": "Vote", "index": 4, "function": ()=>{setDialogue("vote")}},
        {"title": "Execute", "index": 5, "function": ()=>{setDialogue("execute")}}
    ])
    data.set(GameMode.DAY, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}}
    ])
    
    const slices = data.get(menuState.orgMode)?.map((radSlice) => <div className={"areas area_" + radSlice.index} key={radSlice.index} data-title={radSlice.title} onClick={radSlice.function}></div>)
    
    
    const dialogues = new Map()
    dialogues.set("none", <></>)
    dialogues.set("notes", <NotesChange />)
    dialogues.set("name", <NameChange />)
    dialogues.set("bluffs", <BluffsChange />)
    dialogues.set("conviction", <ConvictionChange />)
    dialogues.set("role", <RoleChange />)
    dialogues.set("alignment", <AlignmentChange />)
    dialogues.set("action", <Action />)
    dialogues.set("info", <Info />)
    dialogues.set("reminders", <RemindersChange />)
    dialogues.set("nominate", <Nominate />)
    dialogues.set("onblock", <OnBlockSet />)
    dialogues.set("vote", <Vote restore={tokenContext.json.viability===Viability.DEAD} />)
    dialogues.set("execute", <Execute />)
    
    useEffect(()=>{
        setDialogueName("none")
    }, [menuState])
    
    const centerIcon = (()=>{
        if (gameContext.state.gameMode === GameMode.RADIAL) {
            return <img src={icon}></img>
        } else {
            return <></>
        }
    })()
    
    return (
        <div style={getStyles()} onClick={toggleMenuState} className='token_menu' id={"token_menu_"+tokenContext.json.id}>
            <div id={"radial_menu_"+tokenContext.json.id} onClick={stopPropagation} className='radial_menu'>
                {slices}
            </div>
            <div id={"radial_icon_"+tokenContext.json.id} onClick={stopPropagation} style={{left: tokenContext.json.xpos, top: tokenContext.json.ypos}} className='radial_icon'>
                {centerIcon}
            </div>
            <div onClick={stopPropagation}>
                {dialogues.get(dilogueName)}
            </div>
        </div>
    );
  
}

export default TokenMenu;
