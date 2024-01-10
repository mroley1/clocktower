import { useContext, useEffect } from 'react';
import '@/components/Menus.scss';
import { TokenContext } from '../Token';
import { Viability } from '@/common/Viability';

function Vote(props: any) {
    
    const tokenContext = useContext(TokenContext)
    
    useEffect(() => {
        tokenContext.util.closeMenu()
        return () => {
            if (tokenContext.menuState.open === true) {
                if (props.restore) {
                    let tmp = tokenContext.json
                    tmp["viability"] = Viability.DEADVOTE
                    tokenContext.util.setPlayerData(tmp)
                }
                else if (tokenContext.json.viability === Viability.DEADVOTE) {
                    let tmp = tokenContext.json
                    tmp["viability"] = Viability.DEAD
                    tokenContext.util.setPlayerData(tmp)
                }
            }
        }
    })
    
    return null;
  
}

export default Vote;
