import { useContext, useEffect } from 'react';
import '@/components/Menus.scss';
import { GameContext } from '@/components/App';
import { TokenContext } from '../Token';

function OnBlockSet(props: any) {
    
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
    
    useEffect(() => {
        tokenContext.util.closeMenu()
        return () => {
            if (gameContext.state.onBlock === tokenContext.json.id) {
                gameContext.util.setOnBlock(null)
            } else {
                gameContext.util.setOnBlock(tokenContext.json.id)
            }
        }
    })
    
    return (
        <></>
    );
  
}

export default OnBlockSet;
