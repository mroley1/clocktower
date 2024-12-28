
import { ReferenceData } from '@/components/common/ReferenceData';
import styles from './Picker.module.scss';
import { useContext } from 'react';
import { ReferenceContext } from '../../Game';
import { PickerContext } from './Picker';
interface InfoProps {
    addToBagRoles: (role: ReferenceData.RoleData) => void
    removeFromBagRoles: (roleId: string) => void
}
function Info({addToBagRoles, removeFromBagRoles}: InfoProps) {
    
    const referenceContext = useContext(ReferenceContext)
    const {selectedRole, closeInfo} = useContext(PickerContext)
  
    function add() {
        if (selectedRole) {
            addToBagRoles(selectedRole)
        }
    }
    
    function remove() {
        if (selectedRole) {
            removeFromBagRoles(selectedRole.id)
        }
    }
    
    if (selectedRole) {
    
        const image = referenceContext.image.getRoleImage(selectedRole.id)
        
        return (
            <div className={styles.info}>
                <img src={image}></img>
                <div className={styles.text}>
                    <span className={styles.title}>{selectedRole.name}</span>
                    <br></br>
                    <span className={styles.description}>{selectedRole.description}</span>
                </div>
                <div className={styles.options}>
                    <div className={styles.add} onClick={add}>
                        <span>ADD</span>
                    </div>
                    <div className={styles.remove} onClick={remove}>
                        <span>REMOVE</span>
                    </div>
                </div>
                <div className={styles.close} onClick={closeInfo}></div>
            </div>
        );
    } else {
        return null
    }
}

export default Info;
