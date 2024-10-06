import { createContext, useContext, useState } from 'react';
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
    </>
  );
}

export default Test;
