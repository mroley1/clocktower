import { useContext } from 'react';
import { GameContext } from '../Game';
import { GameProgression } from '../../common/reactStates/GameProgression';

function Test() {
  
  const gameContext = useContext(GameContext)
  
  return (
    <>
    {GameProgression.State[gameContext.gameProgression.state]}
    {gameContext.gameProgression.night}
    <br></br>
    <button onClick={gameContext.gameProgression.nextStage}>next</button>
    <button onClick={gameContext.gameProgression.enterSetup}>enter setup</button>
    <button onClick={gameContext.gameProgression.leaveSetup}>leave setup</button>
    <br></br>
    <br></br>
    <br></br>
    Travellers: {gameContext.playerCount.travellers}
    <br></br>
    Quantity: {gameContext.playerCount.quantity}
    <br></br>
    Town: {gameContext.playerCount.townsfolk}
    <br></br>
    <button onClick={() => {gameContext.playerCount.quantity = 2}}>set 2</button>
    <button onClick={() => {gameContext.playerCount.quantity = 13}}>set 13</button>
    <button onClick={() => {gameContext.playerCount.quantity = 20}}>set 20</button>
    </>
  );
}

export default Test;
