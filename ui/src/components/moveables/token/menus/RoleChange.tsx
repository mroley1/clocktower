import { useContext, useState } from 'react';
import RoleSelect from './util/RoleSelect'
import './Menus.scss';
import { TokenContext } from '../Token';
import { GameContext } from '@/components/App';

function RoleChange(props: any) {
    
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
    
    const closeMenu = () => {
        tokenContext.util.closeMenu()
    }
    
    const style = {
        width: "80%",
        height: "70vh",
        margin: "0% 10% 0% 10%"
    } as React.CSSProperties
    
    const [selections, setSelections] = useState([])
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>Select New Role</h1>
                <div style={style}>
                    <RoleSelect max={1} selections={selections} setSelections={setSelections} />
                </div>
            </div>
        </div>
    );
  
}

export default RoleChange;
