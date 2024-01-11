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
    
    // stop event propogation
    function stopPropagation(event: any) {
        event.stopPropagation()
    }
    
    // once role is selected add it to the game state in the center
    const onSelect = () => {
        if (selections.length<roleSelectMin) {return}
        const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
        tmp.tokens.push({
            id: crypto.randomUUID(),
            role: selections[0],
            name: "",
            xpos: (Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 2) - 60,
            ypos: (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 2) - 60,
            pubNotes: "",
            privNotes: "",
            viability: Viability.ALIVE,
            ailments: [],
            mad: null,
            convinced: null,
            bluffs: [],
            alignment: selections[0]["alignment"],
            usedActions: []
        })
        gameContext.setter(tmp)
        closeMenu()
    }
    
    // close dialogue menu
    const closeMenu = () => {
        setDialogueOpen(false)
    }
    
    // fetch image for token
    const image = require("@HeadsUpAssets/storyteller/person_add_button.png")
    
    // dialogue menu renderes when clicked
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
        <div className='button' onClick={onClick} title="Adds new Player">
            <img src={image}></img>
            {dialogue}
        </div>
    );
}

export default SetupNewPlayer;
