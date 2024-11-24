import { useContext } from 'react';
import style from './Setup.module.scss';
import { ControllerContext, GameContext } from '../Game';


function Setup() {
  
  const gameContext = useContext(GameContext)
  
  const controllerContext = useContext(ControllerContext)
  
  const handleClick = () => {
    gameContext.gameProgression.toggleSetup()
  }
  
  return (
    <div className={style.container} onClick={handleClick}></div>
  );
}

export default Setup;
