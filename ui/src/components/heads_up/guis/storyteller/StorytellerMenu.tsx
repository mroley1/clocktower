import { useContext, useState, useEffect } from 'react';
import './StorytellerMenu.scss';
import { GameMode } from '@/common/GameModes';
import React from 'react';
import { GameContext } from '@/components/App';
import Kill from './menus/Kill';

function StorytellerMenu({menuState, toggleMenuState}: any) {
    
    const [dilogueName, setDialogueName] = useState("none")
    const gameContext = useContext(GameContext)
  
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
    
    const icon = require('../../assets/storyteller/all-seeing-eye.png')
    
    interface radSlice {
        title: string
        index: number
        function: any
    }
    const data = new Map<GameMode, radSlice[]>();
    data.set(GameMode.SETUP, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
        {"title": "Script", "index": 1, "function": ()=>{setDialogue("script")}},
    ])
    data.set(GameMode.NIGHT, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
    ])
    data.set(GameMode.NOMINATIONS, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
    ])
    data.set(GameMode.DAY, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
        {"title": "Kill", "index": 1, "function": ()=>{setDialogue("kill")}}
    ])
    data.set(GameMode.MOVING, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
    ])
    data.set(GameMode.MARK, [
        {"title": "Notes", "index": 0, "function": ()=>{setDialogue("notes")}},
    ])
    
    const slices = data.get(menuState.orgMode)?.map((radSlice) => <div className={"areas area_" + radSlice.index} key={radSlice.index} data-title={radSlice.title} onClick={radSlice.function}></div>)
    
    const dialogues = new Map()
    dialogues.set("none", <></>)
    dialogues.set("kill", <Kill></Kill>)
    
    useEffect(()=>{
        setDialogueName("none")
    }, [menuState])
    
    return (
        <div style={getStyles()} onClick={toggleMenuState} className='storyteller_menu' id={"storyteller_menu"}>
            <div id={"radial_menu_storytrller"} onClick={stopPropagation} className='radial_menu'>
                {slices}
            </div>
            <div id={"radial_icon_storyteller"} onClick={stopPropagation} className='radial_icon'>
                <img src={icon}></img>
            </div>
            <div onClick={stopPropagation}>
                {dialogues.get(dilogueName)}
            </div>
        </div>
    );
}

export default StorytellerMenu;
