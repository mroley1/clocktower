import { useState } from 'react';
import RoleSelect from './util/RoleSelect'
import './Menus.scss';

function RoleChange(props: any) {
    
    const [selections, setSelections] = useState([])
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='center'>
                <h1>Select New Character</h1>
                <RoleSelect max={1} selections={selections} setSelections={setSelections} />
            </div>
        </div>
    );
  
}

export default RoleChange;
