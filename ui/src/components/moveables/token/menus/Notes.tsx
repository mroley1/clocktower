import { useContext, useEffect, useRef, useState } from 'react';
import './Menus.scss';
import Toggle from './util/toggle';
import { GameContext } from '@/components/App';
import { TokenContext } from '../Token';
import { GameMode } from '@/common/GameModes';

function Notes(props: any) {
    
    const tokenContext = useContext(TokenContext)
    
    const LOCKED_PUBLIC = [GameMode.DAY]
    
    const [isPublic, setIsPublic] = useState(LOCKED_PUBLIC.includes(props.orgMode)?true:false)
    
    function toggleIsPublic() {
        setIsPublic(!isPublic)
    }
    
    function setPub(event: any) {
        let tmp = tokenContext.json
        tmp.pubNotes = event.target.value
        tokenContext.util.setPlayerData(tmp)
    }
    
    function setPriv(event: any) {
        let tmp = tokenContext.json
        tmp.privNotes = event.target.value
        tokenContext.util.setPlayerData(tmp)
    }
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={props.toggleMenuState}></div>
            <div className='center'>
                <h1>Notes for {tokenContext.json.name}</h1>
                <div style={{display: LOCKED_PUBLIC.includes(props.orgMode)?"none":"inherit"}}>
                    <Toggle selected={isPublic} toggle={toggleIsPublic} />
                </div>
                <h2 style={{color: isPublic?"red":"white"}}>
                    {isPublic?"Public":"Private"}
                </h2>
                <textarea
                    style={{width: "75vw", height: "60vh", fontSize: "25pt"}}
                    onChange={isPublic?setPub:setPriv}
                    value={isPublic?tokenContext.json.pubNotes:tokenContext.json.privNotes}
                ></textarea>
            </div>
        </div>
    );
  
}

export default Notes;
