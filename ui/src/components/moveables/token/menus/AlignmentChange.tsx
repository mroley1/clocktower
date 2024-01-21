import '@/components/Menus.scss';
import { useContext } from 'react';
import { TokenContext } from '../Token';
import { Alignment } from '@/common/Alignment';

function AlignmentChange(props: any) {
    
    const tokenContext = useContext(TokenContext)
    
    const closeMenu = () => {
        tokenContext.util.closeMenu()
    }
    
    const setAlignment = (alignment: Alignment) => {
        let tmp = tokenContext.json
        tmp.alignment = alignment
        tokenContext.util.setPlayerData(tmp)
        closeMenu()
    }
    
    const goodIcon = require('@assets/icons/good.png');
    const neutralIcon = require('@assets/icons/hells_librarian.png');
    const evilIcon = require('@assets/icons/evil.png');
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>Change Alignment of {tokenContext.json.name}</h1>
                <div className='large_options'>
                    <div className='option' title='Evil' onClick={()=>{setAlignment(Alignment.EVIL)}}>
                        <img src={evilIcon}></img>
                    </div>
                    <div className='option' title='Neutral' onClick={()=>{setAlignment(Alignment.STORYTELLER)}}>
                        <img src={neutralIcon}></img>
                    </div>
                    <div className='option' title='Good' onClick={()=>{setAlignment(Alignment.GOOD)}}>
                        <img src={goodIcon}></img>
                    </div>
                </div>
            </div>
            <div className='peek'></div>
        </div>
    );
  
}

export default AlignmentChange;
