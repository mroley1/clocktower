import { useContext, useEffect } from 'react';
import '@/components/Menus.scss';
import { GameContext } from '@/components/App';

function Kill(props: any) {
    
    const gameContext = useContext(GameContext)
    
    useEffect(() => {
        return () => {
            
        }
    })
    
    return (
        <></>
    );
  
}

export default Kill;
