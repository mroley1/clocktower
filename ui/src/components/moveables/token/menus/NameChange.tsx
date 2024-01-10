import { useContext } from 'react';
import '@/components/Menus.scss';
import { TokenContext } from '../Token';

function NameChange() {
    
    const tokenContext = useContext(TokenContext)
    
    function setName(event: any) {
        let tmp = tokenContext.json
        tmp.name = event.target.value
        tokenContext.util.setPlayerData(tmp)
    }
    
    const closeMenu = () => {
        tokenContext.util.closeMenu()
    }
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>Name</h1>
                <input onChange={setName} value={tokenContext.json.name}></input>
                <br></br>
                <br></br>
                <input onClick={closeMenu} value='Done' type='button'></input> 
            </div>
        </div>
    );
  
}

export default NameChange;
