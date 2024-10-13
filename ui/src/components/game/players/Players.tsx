import { useContext, useState } from 'react';
import styles from './Players.module.scss';
import { ControllerContext, DataContext, GameContext } from '../Game';
import PlayerPartial from './player/Player';


function Players() {
  
  const gameContext = useContext(GameContext)
  const controllerContext = useContext(ControllerContext)
  const referenceData = useContext(DataContext)
  
  return (
    <div className={styles.dragContext}>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <button onClick={() => {controllerContext.addPlayer()}}>new</button>
        {gameContext.players.map(player => <PlayerPartial key={player.id} playerData={player}></PlayerPartial>)}
    </div>
  );
}

export default Players;
