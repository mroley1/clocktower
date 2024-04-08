import { useContext } from 'react';
import './PlayerSelect.scss';
import { GameContext } from '../App';

interface Props {}
function PlayerSelect(props: Props) {
    
    const gameContext = useContext(GameContext)
    
    const select = (e: any) => {
        if (e.target.classList.contains('selected')) {
            e.target.classList = 'player'
        } else {
            e.target.classList = 'player selected'
        }
    }
    
    return (
        <div className='player_select_modal_menu'>
            {gameContext.state.tokens.map((player)=>
                <div key={player.id} className='player' style={{left: player.xpos, top: player.ypos}} onClick={select}>
                    <label>{player.name}</label>
                </div>
            )}
        </div>
    )
  
}

export default PlayerSelect;
