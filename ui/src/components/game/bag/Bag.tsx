import { useContext, useState } from 'react';
import styles from './Bag.module.scss';
import { ControllerContext, GameContext, ReferenceContext } from '../Game';
import Slider from './Slider';
import Picker from './picker/Picker';
import { ClassType } from '@/components/common/RoleType';
import { ReferenceData } from '@/components/common/ReferenceData';
    
export interface BagItem {
    roleData: ReferenceData.RoleData
    quantity: number
}

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
    
    const rolesInBag = gameContext.bag.roles.map(roleId => referenceContext.roles.getRole(roleId))
    const initalBagItems: BagItem[] = []
    rolesInBag.forEach(role => {
        const subject = initalBagItems.find(bagItem => bagItem.roleData.id == role.id)
        if (subject) {
            subject.quantity++
        } else {
            initalBagItems.push({
                roleData: role,
                quantity: 1
            })
        }
    })
        
    const [bagItems, setBagItems] = useState<BagItem[]>(initalBagItems)
    
    function commitChanges() {
        controllerContext.batchBuild(() => {
            gameContext.bag.quantity = playerCountSlider
            gameContext.bag.roles = bagItems.map(bagItem => bagItem.roleData.id)
            if (gameContext.players.length == 0) {
                controllerContext.aggregateData.initPlayersInCircle()
            }
        })
    }
    
    function saveAndReturn() {
        commitChanges()
        referenceContext.utilies.quitGame()
    }
    
    function done() {
        commitChanges()
        completeSetupFunc()
    }
  
    return (
        <div className={styles.bag}>
            <button className={styles.cancel} onClick={saveAndReturn}>Save and Return</button>
            <button className={styles.done} onClick={done}>Done</button>
            <h1>Pre-game Setup</h1>
            <h3>Player Count</h3>
            <Slider playerCount={playerCountSlider} setPlayerCount={setPlayerCount}></Slider>
            <Picker playerCount={playerCountSlider} bagItems={bagItems} setBagItems={setBagItems}></Picker>
        </div>
    );
}

export default Bag;
