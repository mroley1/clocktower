import { useContext } from 'react';
import styles from './BagSelect.module.scss'
import { ControllerContext, ReferenceContext } from '../Game';

interface BagSelectProps {setRoleSelect: (role: string) => void}
function BagSelect({setRoleSelect}: BagSelectProps) {
    
    const controllerContext = useContext(ControllerContext)
    
    const bag = controllerContext.aggregateData.leftInBag()
  
    return (
        <div>
            {bag.map(role => 
                <button key={role} onClick={() => {setRoleSelect(role)}}>secret</button>
            )}
        </div>
    );
}

export default BagSelect;
