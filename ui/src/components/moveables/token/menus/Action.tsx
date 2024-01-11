import { GameContext } from '@/components/App';
import '@/components/Menus.scss';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../Token';
import { AilmentTypes } from '@/common/AilmentTypes';

function Action(props: any) {
    
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
    
    function closeMenu() {
        tokenContext.util.closeMenu()
    }
    
    function ActionSelect() {
        return (
            <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>Change Alignment of {tokenContext.json.name}</h1>
                <div className='large_options'>
                    {tokenContext.json.role?.actions.map((action)=>{
                        const iconType = action.possibleAilments[0].ailmentType
                        const Icon = AilmentTypes.svg(iconType)
                        return (
                            <div key={action.title} className='option' title={action.title} onClick={()=>{}}>
                                {<Icon fill={"white"}></Icon>}
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
        )
    }
    
    function ActionTake(props: any) {
        return null
    }
    
    
    
    useEffect(() => {
        
    }, [])
    
    
    if (tokenContext.json.role?.actions.length === 0) {
        return null
    } else if (tokenContext.json.role?.actions.length === 1) {
        return <ActionTake action={tokenContext.json.role?.actions[0]}></ActionTake>
    } else {
        return <ActionSelect></ActionSelect>
    }
}

export default Action;
