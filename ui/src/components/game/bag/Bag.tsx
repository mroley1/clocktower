import { useContext, useState } from 'react';
import styles from './Bag.module.scss';
import { ControllerContext, GameContext, ReferenceContext } from '../Game';
import Slider from './Slider';
import Picker from './picker/Picker';

interface BagProps {
    completeSetupFunc: () => void
}
function Bag({completeSetupFunc}: BagProps) {
  
    const referenceContext = useContext(ReferenceContext)
    const gameContext = useContext(GameContext)
    const controllerContext = useContext(ControllerContext)
  
    const [playerCountSlider, setPlayerCountSlider] = useState(gameContext.bag.quantity)
    function setPlayerCount(count: number) {
        setPlayerCountSlider(count)
    }
    
    function cancel() {
        referenceContext.utilies.quitGame()
    }
    
    function done() {
        controllerContext.batchBuild(() => {
            gameContext.bag.quantity = playerCountSlider
        })
        completeSetupFunc()
    }
  
    return (
        <div className={styles.bag}>
            <button className={styles.cancel} onClick={cancel}>Cancel</button>
            <button className={styles.done} onClick={done}>Done</button>
            <h1>Pre-game Setup</h1>
            <h3>Player Count</h3>
            <Slider playerCount={playerCountSlider} setPlayerCount={setPlayerCount}></Slider>
            <Picker playerCount={playerCountSlider}></Picker>
        </div>
    );
}

export default Bag;
