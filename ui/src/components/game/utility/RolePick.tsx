import { useContext } from 'react';
import styles from './RolePick.module.scss'
import { DataContext } from '../Game';

interface RolePickProps {setRoleSelect: React.Dispatch<React.SetStateAction<string|undefined>>}
function RolePick({setRoleSelect}: RolePickProps) {
    
    const dataContext = useContext(DataContext)
    
    const selectRole = (role: string) => {
        setRoleSelect(role)
    }
  
    return (
        <div>
            Select Role: 
            {dataContext.script.players.map(role => 
                <button key={role} onClick={() => {selectRole(role)}}>{role}</button>
            )}
        </div>
    );
}

export default RolePick;
