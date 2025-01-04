import { useContext, useRef, useState } from 'react';
import styles from './BagSelect.module.scss'
import { ControllerContext, ReferenceContext } from '../Game';
import { shuffleArray } from './shuffleArray';

interface BagSelectProps {pickFromBag: (role: string) => void}
function BagSelect({pickFromBag}: BagSelectProps) {
    
    const controllerContext = useContext(ControllerContext)
    const referenceContext = useContext(ReferenceContext)
    
    const bag = controllerContext.aggregateData.leftInBag()
    shuffleArray(bag)
    
    const [selectedRoleIndex, setSelectedRoleIndex] = useState<number|undefined>(undefined)
    
    function complete() {
        if (selectedRoleIndex != undefined) {
            pickFromBag(bag[selectedRoleIndex])
        }
    }
    
    function pickCard(index: number) {
        if (!selectedRoleIndex) {
            setSelectedRoleIndex(index)
        }
    }
  
    return (
        <div className={styles.container}>
            <div className={styles.cards}>
                {bag.map((roleId, i) => {
                    if (selectedRoleIndex == i) {
                        const image = referenceContext.image.getRoleImage(roleId);
                        const roleData = referenceContext.roles.getRole(roleId);
                        return <div key={i} className={`${styles.card} ${styles.selected}`} onClick={() => {pickCard(i)}}>
                            <img src={image}></img>
                            <span>{roleData.name}</span>
                        </div>
                    } else {
                        return <div key={i} className={styles.card} onClick={() => {pickCard(i)}}></div>
                    }
                })}
            </div>
            {selectedRoleIndex != undefined?
                <div className={styles.bottom}>
                    <div className={styles.description}>{referenceContext.roles.getRole(bag[selectedRoleIndex]).description}</div>
                    <div className={styles.complete} onClick={complete}>return</div>
                </div>
                :null
            }
        </div>
    );
}

export default BagSelect;
