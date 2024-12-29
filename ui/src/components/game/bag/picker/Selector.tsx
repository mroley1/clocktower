
import { useContext } from 'react';
import styles from './Picker.module.scss';
import { ReferenceContext } from '../../Game';
import { ReferenceData } from '@/components/common/ReferenceData';
import { PickerContext } from './Picker';

function Selector() {
    
    const referenceContext = useContext(ReferenceContext)
    const {selectedRole, setSelectedRole, closeInfo, infoIsVisible} = useContext(PickerContext)
    
    function select(roleId: ReferenceData.RoleData) {
        setSelectedRole(roleId)
    }
  
    return (
        <div className={styles.selector} onClick={closeInfo}>
            <span className={styles.header}>Townsfolk</span>
            <div className={styles.grouping}>
                {referenceContext.roles.townsfolk.map(role => <Option key={role.id} role={role}></Option>)}
            </div>
            <span className={styles.header}>Outsiders</span>
            <div className={styles.grouping}>
                {referenceContext.roles.outsiders.map(role => <Option key={role.id} role={role}></Option>)}
            </div>
            <span className={styles.header}>Minions</span>
            <div className={styles.grouping}>
                {referenceContext.roles.minions.map(role => <Option key={role.id} role={role}></Option>)}
            </div>
            <span className={styles.header}>Demons</span>
            <div className={styles.grouping}>
                {referenceContext.roles.demons.map(role => <Option key={role.id} role={role}></Option>)}
            </div>
        </div>
    );
}

export default Selector;

interface OptionProps {
    role: ReferenceData.RoleData
}
function Option({role}: OptionProps) {
    
    const {bagItems, selectedRole, setSelectedRole, closeInfo, infoIsVisible} = useContext(PickerContext)
    
    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        if (selectedRole?.id==role.id && infoIsVisible) {
            closeInfo()
        } else {
            setSelectedRole(role)
        }
    }
    
    const referenceContext = useContext(ReferenceContext)
    
    const image = referenceContext.image.getRoleImage(role.id)
    
    const quantity = bagItems.find(bagItem => bagItem.roleData.id == role.id)?.quantity||0
    
    return <div className={styles.option} onClick={handleClick} data-highlight={selectedRole?.id==role.id && infoIsVisible}>
        <img src={image}></img>
        {quantity==0?null:
            <div className={styles.quantity} data-warn={quantity>1}>{quantity}</div>
        }
    </div>
}
