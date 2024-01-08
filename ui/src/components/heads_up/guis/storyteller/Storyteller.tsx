import { useContext } from 'react';
import './Storyteller.scss'
import { GameContext } from '@/components/App';
import StorytellerMenu from './StorytellerMenu';
import { HeadsUpContext } from '../../HeadsUp';
import QuickAccess from './QuickAccess';

function Storyteller(props: any) {
    
    const gameContext = useContext(GameContext)
    const headsUpContext = useContext(HeadsUpContext)
    
    const handleClick = (event: object) => {
        headsUpContext.util.toggleRadialMenuState(true)
      }
    
    return (
        <div id='storytellerMenu'>
            <div>
              <div id='storytellerMenuBackingTop' className='backing'>
                <div className='button_container' onClick={handleClick}>
                    <div className='icon'></div>
                </div>
              </div>
              <div id='storytellerMenuBackingBottom' className='backing'>
                <QuickAccess></QuickAccess>
              </div>
            </div>
          <StorytellerMenu />
        </div>
    );
}

export default Storyteller;
