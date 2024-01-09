import { useContext, useState, useEffect } from 'react';
import './StorytellerMenu.scss';
import { GameMode } from '@/common/GameModes';
import React from 'react';
import { GameContext } from '@/components/App';
import Kill from './menus/Kill';
import Script from './menus/Script';
import { HeadsUpContext } from '../../HeadsUp';

function StorytellerMenu({menuState, toggleMenuState}: any) {
    
    const [dilogueName, setDialogueName] = useState("none")
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
  
    // define custom styles for when the radial menu should be visible
    function getStyles() {
        var display = "none"
        var pointerEvents = "none"
        if (headsUpContext.state.menuState.open) {
            display = "inherit"
            pointerEvents = "all"
        }
        return {
            display,
            pointerEvents
        } as React.CSSProperties
    }
    
    // when called stops event propogation so parent elements do not receive event
    function stopPropagation(event: any) {
        event.stopPropagation()
    }
    
    // sets which dialogue should be opened
    function setDialogue(type: string) {
        setDialogueName(type)
    }
    
    // closes radial menu
    function closeMenu() {
        headsUpContext.util.toggleRadialMenuState(false)
    }
    
    // fetches sroryteller eye graphic
    const icon = require('../../assets/storyteller/all-seeing-eye.png')
    
    // defines what information is needed for each slice of a radial menu
    interface radSlice {
        title: string
        index: number
        function: any
    }
    // defines what radial menu options are availible during each game mode from the storyteller menu
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
    
    // populates radial menu with slices for current game mode
    var slices: any[] = []
    if (headsUpContext.state.menuState.orgMode !== null) {
        slices = data.get(headsUpContext.state.menuState.orgMode!)!.map((radSlice) => <div className={"areas area_" + radSlice.index} key={radSlice.index} data-title={radSlice.title} onClick={radSlice.function}></div>)
    }
    
    // maps dialogue names with their respective components for when they are selected
    const dialogues = new Map()
    dialogues.set("none", null)
    dialogues.set("kill", <Kill></Kill>)
    dialogues.set("script", <Script></Script>)
    
    // sets dialogue to none when component is loaded
    useEffect(()=>{
        setDialogueName("none")
    }, [headsUpContext.state.menuState])
    
    return (
        <div style={getStyles()} onClick={closeMenu} className='storyteller_menu' id={"storyteller_menu"}>
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
