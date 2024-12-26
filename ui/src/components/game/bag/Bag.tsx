import { useContext, useState } from 'react';
import styles from './Bag.module.scss';
import { ControllerContext, GameContext, ReferenceContext } from '../Game';
import Slider from './Slider';

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
    
    function done() {
        controllerContext.batchBuild(() => {
            gameContext.bag.quantity = playerCountSlider
        })
        completeSetupFunc()
    }
  
    return (
        <>
            <Slider playerCount={playerCountSlider} setPlayerCount={setPlayerCount}></Slider>
            {referenceContext.roles.roleList.map((role) => {
                return (
                    <div key={role.id}>
                        {role.name}
                    </div>
                )
            })}
            <button onClick={done}>start</button>
        </>
    );
}

export default Bag;
