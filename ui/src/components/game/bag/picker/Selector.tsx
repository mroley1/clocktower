
import { useContext } from 'react';
import styles from './Picker.module.scss';
import { ReferenceContext } from '../../Game';
import { ReferenceData } from '@/components/common/ReferenceData';

interface SelectorProps {
    selectedRole: ReferenceData.RoleData|undefined,
    setSelectedRole: (role: ReferenceData.RoleData|undefined) => void
}
function Selector({selectedRole, setSelectedRole}: SelectorProps) {
    
    const referenceContext = useContext(ReferenceContext)
    
    function select(roleId: ReferenceData.RoleData) {
        setSelectedRole(roleId)
    }
  
    return (
        <div className={styles.selector} onClick={()=>{setSelectedRole(undefined)}}>
            <span className={styles.header}>Townsfolk</span>
            <div className={styles.grouping}>
                {referenceContext.roles.townsfolk.map(role => <Option key={role.id} role={role} selectFunc={select} highlight={selectedRole?.id==role.id}></Option>)}
            </div>
            <span className={styles.header}>Outsiders</span>
            <div className={styles.grouping}>
                {referenceContext.roles.outsiders.map(role => <Option key={role.id} role={role} selectFunc={select} highlight={selectedRole?.id==role.id}></Option>)}
            </div>
            <span className={styles.header}>Minions</span>
            <div className={styles.grouping}>
                {referenceContext.roles.minions.map(role => <Option key={role.id} role={role} selectFunc={select} highlight={selectedRole?.id==role.id}></Option>)}
            </div>
            <span className={styles.header}>Demons</span>
            <div className={styles.grouping}>
                {referenceContext.roles.demons.map(role => <Option key={role.id} role={role} selectFunc={select} highlight={selectedRole?.id==role.id}></Option>)}
            </div>
        </div>
    );
}

export default Selector;

interface OptionProps {
    role: ReferenceData.RoleData
    selectFunc: (roleId: ReferenceData.RoleData) => void
    highlight: boolean
}
function Option({role, selectFunc, highlight}: OptionProps) {
    
    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()
        selectFunc(role)
    }
    
    const referenceContext = useContext(ReferenceContext)
    
    const image = referenceContext.image.getRoleImage(role.id)
    
    return <div className={styles.option} onClick={handleClick} data-highlight={highlight}>
        <img src={image}></img>
    </div>
}
