import { useContext } from 'react';
import styles from './RolePick.module.scss'
import { DataContext } from '../Game';

interface RolePickProps {setRoleSelect: (role: string) => void}
function RolePick({setRoleSelect}: RolePickProps) {
    
    const dataContext = useContext(DataContext)
  
    return (
        <div>
            Select Role: 
            {dataContext.script.roleNames.map(role => 
                <button key={role} onClick={() => {setRoleSelect(role)}}>{role}</button>
            )}
        </div>
    );
}

export default RolePick;
