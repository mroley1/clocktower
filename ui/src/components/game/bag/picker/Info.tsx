
import { ReferenceData } from '@/components/common/ReferenceData';
import styles from './Picker.module.scss';
interface InfoProps {
    selectedRole: ReferenceData.RoleData|undefined
    setSelectedRole: (role: ReferenceData.RoleData|undefined) => void
    closeInfo: () => void
    addToBagRoles: (role: ReferenceData.RoleData) => void
    removeFromBagRoles: (roleId: string) => void
}
function Info({selectedRole, setSelectedRole, closeInfo, addToBagRoles, removeFromBagRoles}: InfoProps) {
  
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
    
    return (
        <div className={styles.info}>
            {selectedRole?.id}
            <button onClick={closeInfo}>clear</button>
            <button onClick={add}>add</button>
            <button onClick={remove}>remove</button>
        </div>
    );
}

export default Info;
