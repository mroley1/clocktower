import GameStateType from "@/common/GameStateType";
import { GameContext } from "@/components/App";
import { useContext } from "react";


function NominationHelp(props: any) {
    
    const gameContext = useContext(GameContext)
    
    // handle toggling nominationHelp in game state when clicked
    function onClick() {
        const tmp: GameStateType = JSON.parse(JSON.stringify(gameContext.state));
        tmp.quickAccessSettings.nominationHelp = !tmp.quickAccessSettings.nominationHelp
        gameContext.setter(tmp)
    }
    
    // grey out token if diabled
    // ! not implemented yet
    const style = {
        filter: ""
    } as React.CSSProperties
    
    // fetch image for token
    const image = require("./assets/Homemade-Barbecue-Sauce-without-ketchup.webp")
    
    return (
        <div className='button' style={style} onClick={onClick} title="Display who can vote in this election">
            <img src={image}></img>
        </div>
    );
}

export default NominationHelp;
