import { useContext } from 'react';
import styles from './RolePick.module.scss'
import { ReferenceContext } from '../Game';

interface RolePickProps {setRoleSelect: (role: string) => void}
function RolePick({setRoleSelect}: RolePickProps) {
    
    const referenceContext = useContext(ReferenceContext)
  
    return (
        <div>
            Select Role: 
            {referenceContext.script.roleNames.map(role => 
                <button key={role} onClick={() => {setRoleSelect(role)}}>{role}</button>
            )}
        </div>
    );
}

export default RolePick;
