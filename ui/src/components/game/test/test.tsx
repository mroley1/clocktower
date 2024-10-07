import { useContext } from 'react';
import { ControllerContext, GameContext } from '../Game';
import { GameProgression } from '../../common/reactStates/GameProgression';

function Test() {
  
  const gameContext = useContext(GameContext)
  
  const controllerContext = useContext(ControllerContext)
  
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
    <br></br>
    <br></br>
    <br></br>
    <button onClick={controllerContext.addPlayer}>new player</button>
    {gameContext.players.map((player) => <p key={player.id}>{player.toJSON()}</p>)}
    <br></br>
    <br></br>
    <br></br>
    <button onClick={controllerContext.undo}>undo</button>
    <button onClick={controllerContext.redo}>redo</button>
    </>
  );
}

export default Test;
