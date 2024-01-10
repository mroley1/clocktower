import { useContext, useEffect } from 'react';
import '@/components/Menus.scss';
import { GameContext } from '@/components/App';
import { TokenContext } from '../Token';
import { Viability } from '@/common/Viability';

function Execute(props: any) {
    
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
    
    useEffect(() => {
        tokenContext.util.closeMenu()
        return () => {
            let tmp = tokenContext.json
            tmp["viability"] = Viability.DEADVOTE
            tokenContext.util.setPlayerData(tmp)
            gameContext.util.setOnBlock(null)
        }
    })
    
    return (
        <></>
    );
  
}

export default Execute;
