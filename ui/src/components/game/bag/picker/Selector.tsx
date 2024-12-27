
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
        <div className={styles.selector}>
        <span>townsfolk:</span>
        {referenceContext.roles.townsfolk.map(role => <Option key={role.id} role={role} selectFunc={select}></Option>)}
        <span>outsiders:</span>
        {referenceContext.roles.outsiders.map(role => <Option key={role.id} role={role} selectFunc={select}></Option>)}
        <span>minions:</span>
        {referenceContext.roles.minions.map(role => <Option key={role.id} role={role} selectFunc={select}></Option>)}
        <span>demons:</span>
        {referenceContext.roles.demons.map(role => <Option key={role.id} role={role} selectFunc={select}></Option>)}
        </div>
    );
}

export default Selector;

interface OptionProps {
    role: ReferenceData.RoleData
    selectFunc: (roleId: ReferenceData.RoleData) => void
}
function Option({role, selectFunc}: OptionProps) {
    return <div onClick={()=>(selectFunc(role))}>{role.id}</div>
}
