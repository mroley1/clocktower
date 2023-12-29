import { useContext } from 'react';
import './HeadsUp.scss'
import BoardStateMenu from './guis/BoardStateMenu';
import { GameContext } from '../App';
import Storyteller from './guis/storyteller/Storyteller';


function HeadsUp(props: any) {
  const gameContext = useContext(GameContext)
  return (
    <div id='heads_up'>
        <BoardStateMenu />
        <Storyteller />
        <span style={{position: "absolute"}}>{gameContext.state.onBlock}</span>
    </div>
  );
}

export default HeadsUp;
