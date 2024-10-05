import { createContext, useState } from 'react';
import { GameProgression } from '../common/reactStates/GameProgression';
import Test from './test/test';


export const GameContext = createContext({gameProgression: {}})

function Game() {
  
  const [gpState, setgpState] = useState({state: GameProgression.State.SETUP, night: 0, stored: undefined} as GameProgression.ReactState)
  
  //console.log(gpState)
  
  return (
    <GameContext.Provider value={{gameProgression: new GameProgression.Data(gpState, setgpState)}}>
      <Test></Test>
    </GameContext.Provider>
  );
}

export default Game;
