import { createContext, useContext, useState } from 'react';
import { GameContext } from '../Game';
import GameData from '@/components/common/GameData';
import { GameProgression } from '../../common/reactStates/GameProgression';

function Test() {
  
  const gameContext = useContext(GameContext) as any as GameData
  
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
