import { useContext } from 'react';
import './MoveBoard.css';
import { GameContext } from '../App'
import Token from './token/Token';

function MoveBoard() {
    
    const gameContext = useContext(GameContext)
    
    function exitContext() {
        const tmp = JSON.parse(JSON.stringify(gameContext.state));
        tmp["tokens"][0].role = "test"
        gameContext.setter(tmp)
    }
    
    const tokens = gameContext.state.tokens.map((token) => <Token json={token} />)
  
  return (
    <>
        <ul>
            {tokens}
        </ul>
        <br></br>
        <input type='button' onClick={() => exitContext()} value="make test"></input>
    </>
  );
}

export default MoveBoard;