import { useContext, useEffect } from 'react';
import './Menus.scss';
import { GameContext } from '@/components/App';
import { HeadsUpContext } from '@/components/heads_up/HeadsUp';

function Script(props: any) {
    
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
    
    useEffect(() => {
        return () => {
            
        }
    })
    
    return (
        <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={()=>{headsUpContext.util.toggleRadialMenuState(false)}}></div>
            <div className='center'></div>
                
        </div>
    );
  
}

export default Script;
