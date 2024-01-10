import { Alignment } from "@/common/Alignment";
import GameStateType from "@/common/GameStateType";
import { Viability } from "@/common/Viability";
import { GameContext } from "@/components/App";
import RoleSelect from "@/components/util/RoleSelect";
import { useContext, useState } from "react";


function SetupNewPlayer(props: any) {
    
    const gameContext = useContext(GameContext)
    
    const [dialogueOpen, setDialogueOpen] = useState(false)
    const [selections, setSelections] = useState([])
    
    const roleSelectMax = 1
    const roleSelectMin = 1
    
    // handle toggles role
    function onClick() {
        setDialogueOpen(true)
    }
    
    function stopPropagation(event: any) {
        event.stopPropagation()
    }
    
    const onSelect = () => {
        const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
        tmp.tokens.push({
            id: crypto.randomUUID(),
            role: selections[0],
            name: "",
            xpos: 600,
            ypos: 600,
            pubNotes: "",
            privNotes: "",
            viability: Viability.ALIVE,
            ailments: [],
            mad: null,
            convinced: null,
            bluffs: [],
            alignment: selections[0]["alignment"]}
        )
        gameContext.setter(tmp)
        closeMenu()
    }
    
    const closeMenu = () => {
        setDialogueOpen(false)
    }
    
    // grey out token if diabled
    // ! not implemented
    const style = {
        filter: ""
    } as React.CSSProperties
    
    // fetch image for token
    const image = require("@HeadsUpAssets/storyteller/person_add_button.png")
    
    const dialogue = (() => {
        if (dialogueOpen) {
            return (
                <div id='radialMenuActionSolidBase' onClick={stopPropagation}>
                    <div className='close' onClick={closeMenu}></div>
                    <div className='center'>
                        <h1>Select New Role</h1>
                        <div className='focus'>
                            <RoleSelect max={roleSelectMax} selections={selections} setSelections={setSelections} />
                            <div className='bottomTray'>
                                <div className='cancel' onClick={closeMenu}>Cancel</div>
                                <div className='select' onClick={onSelect} aria-disabled={selections.length<roleSelectMin}>Select</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    })()
    
    return (
        <div className='button' style={style} onClick={onClick} title="Adds new Player">
            <img src={image}></img>
            {dialogue}
        </div>
    );
}

export default SetupNewPlayer;
