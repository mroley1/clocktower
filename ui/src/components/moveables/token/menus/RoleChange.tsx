import { useContext, useState } from 'react';
import RoleSelect from '@util/RoleSelect'
import '@/components/Menus.scss';
import { TokenContext } from '../Token';

function RoleChange(props: any) {
    
    const tokenContext = useContext(TokenContext)
    
    const roleSelectMax = 1
    const roleSelectMin = 1
    
    const closeMenu = () => {
        tokenContext.util.closeMenu()
    }
    
    const changeRole = () => {
        if (selections.length<roleSelectMin) {return}
        let tmp = tokenContext.json
        tmp.role = selections[0]
        tokenContext.util.setPlayerData(tmp)
        closeMenu()
    }
    
    const [selections, setSelections] = useState([])
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>Select New Role</h1>
                <div className='focus'>
                    <RoleSelect max={roleSelectMax} selections={selections} setSelections={setSelections} />
                    <div className='bottomTray'>
                        <div className='cancel' onClick={closeMenu}>Cancel</div>
                        <div className='select' onClick={changeRole} aria-disabled={selections.length<roleSelectMin}>Select</div>
                    </div>
                </div>
            </div>
        </div>
    );
  
}

export default RoleChange;
