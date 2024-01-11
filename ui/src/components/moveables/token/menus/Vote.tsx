import { useContext, useEffect } from 'react';
import '@/components/Menus.scss';
import { TokenContext } from '../Token';
import { Viability } from '@/common/Viability';
import Player from '@/common/Player';

function Vote(props: any) {
    
    const tokenContext = useContext(TokenContext)
    
    useEffect(() => {
        tokenContext.util.closeMenu()
        return () => {
            if (tokenContext.menuState.open === true) {
                // restore deadvote
                if (props.restore) {
                    let tmp: Player = tokenContext.json
                    let restoreTo = tmp.viability===Viability.DEADFAINT?Viability.DEADFAINTVOTE:Viability.DEADVOTE // determine if vote being resored is a faint
                    tmp.viability = restoreTo
                    tokenContext.util.setPlayerData(tmp)
                }
                // use deadvote
                else if (tokenContext.json.viability === Viability.DEADVOTE) {
                    let tmp: Player = tokenContext.json
                    let useTo = tmp.viability===Viability.DEADFAINTVOTE?Viability.DEADFAINT:Viability.DEAD // determine if vote being used is a faint
                    tmp.viability = useTo
                    tokenContext.util.setPlayerData(tmp)
                }
            }
        }
    })
    
    return null;
  
}

export default Vote;
